"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sampleAtlas } from "@/data/sampleAtlas";
import { learningModeToGeneration } from "@/lib/ai/modes";
import type { AIEngineMeta } from "@/lib/ai/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  applyProgressToNodes,
  buildAtlasExport,
  completeNodeAndUnlock,
  computeProgressStats,
  getNodeStatuses,
  initializeAtlasNodes,
} from "@/lib/atlasProgress";
import { downloadJson } from "@/lib/exportJson";
import {
  clearGuestProgress,
  loadGuestProgress,
  saveGuestProgress,
} from "@/lib/storage/progressStorage";
import {
  createSavedAtlas,
  getAtlasById,
  updateSavedAtlasFromWorkspace,
} from "@/lib/storage/savedAtlasStorage";
import type { SavedAtlas } from "@/types/savedAtlas";
import type { AtlasData, AtlasNodeData, LearningMode } from "@/types/atlas";

type QuizFeedback = { type: "success" | "error"; message: string } | null;

function buildSnapshot(
  nodes: AtlasNodeData[],
  topic: string,
  mode: LearningMode,
  atlasId: string
): string {
  return JSON.stringify({
    atlasId,
    topic,
    mode,
    statuses: getNodeStatuses(nodes),
  });
}

interface AtlasWorkspaceContextValue {
  topic: string;
  setTopic: (v: string) => void;
  learningMode: LearningMode;
  setLearningMode: (m: LearningMode) => void;
  atlasLoaded: boolean;
  atlas: AtlasData;
  nodes: AtlasNodeData[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  feedback: QuizFeedback;
  stats: ReturnType<typeof computeProgressStats>;
  fogOpacity: number;
  prerequisiteTitles: string[];
  savedAtlasId: string | null;
  isDirty: boolean;
  isUnsaved: boolean;
  handleGenerate: () => void;
  handleQuizAnswer: (nodeId: string, optionIndex: number) => void;
  handleExport: () => void;
  handleReset: () => void;
  saveCurrentAtlas: (asNew?: boolean) => boolean;
  loadSavedAtlas: (saved: SavedAtlas) => void;
  requestLoadSavedAtlas: (saved: SavedAtlas) => void;
  pendingAtlas: SavedAtlas | null;
  confirmLeaveUnsaved: () => void;
  cancelLeaveUnsaved: () => void;
  showUnsavedDialog: boolean;
  engineMeta: AIEngineMeta | null;
  isGenerating: boolean;
  generateError: string | null;
}

const AtlasWorkspaceContext = createContext<AtlasWorkspaceContextValue | null>(null);

export function AtlasWorkspaceProvider({ children }: { children: ReactNode }) {
  const { user, isReady, requireAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [topic, setTopic] = useState("Learn JavaScript Async");
  const [learningMode, setLearningMode] = useState<LearningMode>("explore");
  const [atlasLoaded, setAtlasLoaded] = useState(false);
  const [atlas, setAtlas] = useState<AtlasData>(sampleAtlas);
  const [nodes, setNodes] = useState<AtlasNodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<QuizFeedback>(null);
  const [savedAtlasId, setSavedAtlasId] = useState<string | null>(null);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string | null>(null);
  const [pendingAtlas, setPendingAtlas] = useState<SavedAtlas | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [engineMeta, setEngineMeta] = useState<AIEngineMeta | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const applyWorkspace = useCallback(
    (
      nextAtlas: AtlasData,
      nextNodes: AtlasNodeData[],
      nextTopic: string,
      nextMode: LearningMode,
      savedId: string | null
    ) => {
      setAtlas(nextAtlas);
      setNodes(nextNodes);
      setTopic(nextTopic);
      setLearningMode(nextMode);
      setSavedAtlasId(savedId);
      setAtlasLoaded(true);
      setSelectedNodeId(null);
      setFeedback(null);
      setLastSavedSnapshot(
        buildSnapshot(nextNodes, nextTopic, nextMode, nextAtlas.id)
      );
    },
    []
  );

  const persistProgress = useCallback(
    (updated: AtlasNodeData[], meta?: { atlas?: AtlasData; topic?: string; mode?: LearningMode }) => {
      const nextAtlas = meta?.atlas ?? atlas;
      const nextTopic = meta?.topic ?? topic;
      const nextMode = meta?.mode ?? learningMode;
      setNodes(updated);

      if (savedAtlasId && user) {
        const record = updateSavedAtlasFromWorkspace(savedAtlasId, {
          atlas: nextAtlas,
          nodes: updated,
          topicInput: nextTopic,
          mode: nextMode,
          title: nextTopic,
          description: nextAtlas.description,
        });
        if (record) {
          setLastSavedSnapshot(
            buildSnapshot(updated, nextTopic, nextMode, nextAtlas.id)
          );
        }
      } else if (!savedAtlasId) {
        saveGuestProgress(nextAtlas.id, getNodeStatuses(updated));
      }
    },
    [atlas, topic, learningMode, savedAtlasId, user]
  );

  const handleGenerate = useCallback(async () => {
    const input = topic.trim() || "Learn programming";
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/ai/generate-atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          mode: learningModeToGeneration(learningMode),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Generation failed");
      }

      setEngineMeta(data.engine);
      const generatedAtlas = data.atlas as AtlasData;
      const initialNodes = generatedAtlas.nodes.map((n: AtlasNodeData) => ({
        ...n,
        status: n.id === generatedAtlas.nodes[0]?.id ? "available" : "locked",
      })) as AtlasNodeData[];

      const guestProgress = loadGuestProgress(generatedAtlas.id);
      const nodesWithGuest = guestProgress
        ? applyProgressToNodes(initialNodes, guestProgress)
        : initialNodes;

      applyWorkspace(
        { ...generatedAtlas, nodes: nodesWithGuest },
        nodesWithGuest,
        generatedAtlas.topic,
        learningMode,
        null
      );
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate atlas");
      const nextAtlas = { ...sampleAtlas, topic: input };
      const initialNodes = initializeAtlasNodes(nextAtlas);
      applyWorkspace(nextAtlas, initialNodes, nextAtlas.topic, learningMode, null);
      setEngineMeta(null);
    } finally {
      setIsGenerating(false);
    }
  }, [topic, learningMode, applyWorkspace]);

  const loadSavedAtlas = useCallback(
    (saved: SavedAtlas) => {
      const nodesWithProgress = applyProgressToNodes(
        saved.atlas.nodes.map((n) => ({ ...n })),
        saved.progress
      );
      applyWorkspace(
        { ...saved.atlas, nodes: nodesWithProgress },
        nodesWithProgress,
        saved.topicInput,
        saved.mode,
        saved.id
      );
      updateSavedAtlasFromWorkspace(saved.id, {
        atlas: saved.atlas,
        nodes: nodesWithProgress,
        touchOpened: true,
      });
      router.replace("/");
    },
    [applyWorkspace, router]
  );

  const requestLoadSavedAtlas = useCallback(
    (saved: SavedAtlas) => {
      const dirty =
        atlasLoaded &&
        (savedAtlasId
          ? buildSnapshot(nodes, topic, learningMode, atlas.id) !== lastSavedSnapshot
          : true);
      if (dirty) {
        setPendingAtlas(saved);
        setShowUnsavedDialog(true);
        return;
      }
      loadSavedAtlas(saved);
    },
    [
      atlasLoaded,
      savedAtlasId,
      nodes,
      topic,
      learningMode,
      atlas.id,
      lastSavedSnapshot,
      loadSavedAtlas,
    ]
  );

  const confirmLeaveUnsaved = useCallback(() => {
    if (pendingAtlas) loadSavedAtlas(pendingAtlas);
    setPendingAtlas(null);
    setShowUnsavedDialog(false);
  }, [pendingAtlas, loadSavedAtlas]);

  const cancelLeaveUnsaved = useCallback(() => {
    setPendingAtlas(null);
    setShowUnsavedDialog(false);
  }, []);

  useEffect(() => {
    const savedId = searchParams.get("saved");
    if (!savedId || !isReady || !user) return;
    const saved = getAtlasById(savedId);
    if (saved && saved.userId === user.id) {
      loadSavedAtlas(saved);
    }
  }, [searchParams, user, isReady, loadSavedAtlas]);

  const handleQuizAnswer = useCallback(
    (nodeId: string, optionIndex: number) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || node.status === "locked" || node.status === "completed") return;

      if (optionIndex === node.correctAnswer) {
        const updated = completeNodeAndUnlock(nodes, nodeId);
        persistProgress(updated);
        setFeedback({
          type: "success",
          message: "Concept completed. New knowledge unlocked.",
        });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({
          type: "error",
          message: "Not quite. Review the explanation and try again.",
        });
      }
    },
    [nodes, persistProgress]
  );

  const handleExport = useCallback(() => {
    const exportData = buildAtlasExport(atlas, nodes);
    const slug = atlas.topic.toLowerCase().replace(/\s+/g, "-");
    downloadJson(exportData, `taliin-atlas-${slug}.json`);
  }, [atlas, nodes]);

  const handleReset = useCallback(() => {
    const resetNodes = sampleAtlas.nodes.map((n) => ({ ...n }));
    const resetAtlas = { ...sampleAtlas, topic: atlas.topic, description: atlas.description };
    setAtlas(resetAtlas);
    setNodes(resetNodes);
    setSelectedNodeId(null);
    setFeedback(null);
    if (savedAtlasId && user) {
      persistProgress(resetNodes, { atlas: resetAtlas });
    } else {
      clearGuestProgress(atlas.id);
    }
    setLastSavedSnapshot(
      buildSnapshot(resetNodes, topic, learningMode, resetAtlas.id)
    );
  }, [atlas, topic, learningMode, savedAtlasId, user, persistProgress]);

  const saveCurrentAtlas = useCallback(
    (asNew = false): boolean => {
      if (!requireAuth()) return false;
      if (!atlasLoaded || !user) return false;

      if (savedAtlasId && !asNew) {
        const updated = updateSavedAtlasFromWorkspace(savedAtlasId, {
          atlas,
          nodes,
          topicInput: topic,
          mode: learningMode,
          title: topic,
          description: atlas.description,
        });
        if (updated) {
          setLastSavedSnapshot(buildSnapshot(nodes, topic, learningMode, atlas.id));
          return true;
        }
      }

      const created = createSavedAtlas({
        userId: user.id,
        title: topic.trim() || atlas.topic,
        description: atlas.description,
        topicInput: topic,
        mode: learningMode,
        atlas,
        nodes,
      });
      setSavedAtlasId(created.id);
      setLastSavedSnapshot(buildSnapshot(nodes, topic, learningMode, atlas.id));
      return true;
    },
    [requireAuth, atlasLoaded, user, savedAtlasId, atlas, nodes, topic, learningMode]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const stats = useMemo(() => computeProgressStats(nodes), [nodes]);

  const fogOpacity = useMemo(() => {
    if (nodes.length === 0) return 0.85;
    const ratio = stats.completed / nodes.length;
    return Math.max(0.15, 0.85 - ratio * 0.7);
  }, [nodes.length, stats.completed]);

  const prerequisiteTitles = useMemo(() => {
    if (!selectedNode) return [];
    return selectedNode.prerequisites
      .map((id) => nodes.find((n) => n.id === id)?.title)
      .filter((t): t is string => Boolean(t));
  }, [selectedNode, nodes]);

  const isDirty = useMemo(() => {
    if (!atlasLoaded) return false;
    const current = buildSnapshot(nodes, topic, learningMode, atlas.id);
    if (savedAtlasId) return lastSavedSnapshot !== null && current !== lastSavedSnapshot;
    return true;
  }, [atlasLoaded, nodes, topic, learningMode, atlas.id, savedAtlasId, lastSavedSnapshot]);

  const isUnsaved = atlasLoaded && (!savedAtlasId || isDirty);

  const value = useMemo<AtlasWorkspaceContextValue>(
    () => ({
      topic,
      setTopic,
      learningMode,
      setLearningMode,
      atlasLoaded,
      atlas,
      nodes,
      selectedNodeId,
      setSelectedNodeId,
      feedback,
      stats,
      fogOpacity,
      prerequisiteTitles,
      savedAtlasId,
      isDirty,
      isUnsaved,
      handleGenerate,
      handleQuizAnswer,
      handleExport,
      handleReset,
      saveCurrentAtlas,
      loadSavedAtlas,
      requestLoadSavedAtlas,
      pendingAtlas,
      confirmLeaveUnsaved,
      cancelLeaveUnsaved,
      showUnsavedDialog,
      engineMeta,
      isGenerating,
      generateError,
    }),
    [
      topic,
      learningMode,
      atlasLoaded,
      atlas,
      nodes,
      selectedNodeId,
      feedback,
      stats,
      fogOpacity,
      prerequisiteTitles,
      savedAtlasId,
      isDirty,
      isUnsaved,
      handleGenerate,
      handleQuizAnswer,
      handleExport,
      handleReset,
      saveCurrentAtlas,
      loadSavedAtlas,
      requestLoadSavedAtlas,
      pendingAtlas,
      confirmLeaveUnsaved,
      cancelLeaveUnsaved,
      showUnsavedDialog,
      engineMeta,
      isGenerating,
      generateError,
    ]
  );

  return (
    <AtlasWorkspaceContext.Provider value={value}>
      {children}
    </AtlasWorkspaceContext.Provider>
  );
}

export function useAtlasWorkspace(): AtlasWorkspaceContextValue {
  const ctx = useContext(AtlasWorkspaceContext);
  if (!ctx) throw new Error("useAtlasWorkspace must be used within AtlasWorkspaceProvider");
  return ctx;
}
