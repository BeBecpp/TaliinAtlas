"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import AtlasNodeComponent, { type AtlasFlowNodeData } from "@/components/AtlasNode";
import type { AtlasData, AtlasNodeData } from "@/types/atlas";

const nodeTypes = {
  atlasNode: AtlasNodeComponent,
};

interface AtlasMapProps {
  atlas: AtlasData;
  nodes: AtlasNodeData[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  fogOpacity: number;
}

function AtlasMapInner({
  atlas,
  nodes,
  selectedNodeId,
  onSelectNode,
  fogOpacity,
}: AtlasMapProps) {
  const handleSelect = useCallback(
    (id: string) => {
      onSelectNode(id);
    },
    [onSelectNode]
  );

  const flowNodes: Node<AtlasFlowNodeData>[] = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        type: "atlasNode",
        position: node.position,
        data: {
          node,
          selected: selectedNodeId === node.id,
          onSelect: handleSelect,
        },
        draggable: false,
        selectable: false,
      })),
    [nodes, selectedNodeId, handleSelect]
  );

  const completedIds = useMemo(
    () => new Set(nodes.filter((n) => n.status === "completed").map((n) => n.id)),
    [nodes]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      atlas.edges.map((edge) => {
        const sourceDone = completedIds.has(edge.source);
        const targetDone = completedIds.has(edge.target);
        const bright = sourceDone && targetDone;

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: !bright,
          style: {
            stroke: bright ? "#22C55E" : "#06B6D4",
            strokeWidth: bright ? 2.5 : 1.5,
            opacity: bright ? 0.9 : 0.45,
          },
        };
      }),
    [atlas.edges, completedIds]
  );

  const clarity = 1 - fogOpacity;

  return (
    <div className="relative h-[min(70vh,720px)] w-full overflow-hidden rounded-2xl border border-white/10 bg-atlas-card/40">
      {/* Fog of Knowledge */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-700"
        style={{ opacity: fogOpacity }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#070A12_70%)]"
          animate={{ opacity: [0.7, 0.85, 0.7] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-atlas-bg via-transparent to-atlas-bg/80" />
        <motion.div
          className="absolute -left-1/4 top-1/4 h-1/2 w-1/2 rounded-full bg-atlas-primary/10 blur-[80px]"
          animate={{ x: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-1/4 h-1/2 w-1/2 rounded-full bg-atlas-cyan/10 blur-[80px]"
          animate={{ x: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* Clarity boost as progress grows */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-br from-atlas-primary/5 via-transparent to-atlas-cyan/5 transition-opacity duration-700"
        style={{ opacity: clarity * 0.6 }}
      />

      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.4}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
        className="atlas-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e293b"
        />
        <Controls
          className="!rounded-xl !border-white/10 !bg-atlas-card/90 !shadow-lg [&>button]:!border-white/10 [&>button]:!bg-atlas-bg [&>button]:!text-atlas-muted [&>button:hover]:!bg-atlas-primary/20"
        />
      </ReactFlow>

      <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-lg border border-white/10 bg-atlas-card/80 px-3 py-1.5 text-xs text-atlas-muted backdrop-blur-sm">
        <span className="text-atlas-cyan">Fog of Knowledge</span>
        {" · "}
        {Math.round(clarity * 100)}% revealed
      </div>
    </div>
  );
}

export default function AtlasMap(props: AtlasMapProps) {
  return (
    <ReactFlowProvider>
      <AtlasMapInner {...props} />
    </ReactFlowProvider>
  );
}
