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
import * as authService from "./authService";
import type { AuthFormErrors, AuthModalMode, Session, User } from "./types";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isReady: boolean;
  authModalOpen: boolean;
  authModalMode: AuthModalMode;
  authMessage: string | null;
  openAuthModal: (mode?: AuthModalMode, message?: string) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
  login: (email: string, password: string) => AuthFormErrors | null;
  register: (name: string, email: string, password: string) => AuthFormErrors | null;
  logout: () => void;
  continueAsDemo: () => void;
  requireAuth: (onAuthed?: () => void) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("login");
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  useEffect(() => {
    const currentSession = authService.getCurrentSession();
    const currentUser = authService.getCurrentUser();
    setSession(currentSession);
    setUser(currentUser);
    setIsReady(true);
  }, []);

  const openAuthModal = useCallback((mode: AuthModalMode = "login", message?: string) => {
    setAuthModalMode(mode);
    setAuthMessage(message ?? null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthMessage(null);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const result = authService.login(email, password);
      if ("errors" in result) return result.errors;
      setUser(result.user);
      setSession(result.session);
      closeAuthModal();
      return null;
    },
    [closeAuthModal]
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const result = authService.register(name, email, password);
      if ("errors" in result) return result.errors;
      setUser(result.user);
      setSession(result.session);
      closeAuthModal();
      return null;
    },
    [closeAuthModal]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setSession(null);
  }, []);

  const continueAsDemo = useCallback(() => {
    const result = authService.continueAsDemo();
    setUser(result.user);
    setSession(result.session);
    closeAuthModal();
  }, [closeAuthModal]);

  const requireAuth = useCallback(
    (onAuthed?: () => void) => {
      if (user) {
        onAuthed?.();
        return true;
      }
      openAuthModal(
        "register",
        "Create a free local profile to save your atlas on this device."
      );
      return false;
    },
    [user, openAuthModal]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user),
      isReady,
      authModalOpen,
      authModalMode,
      authMessage,
      openAuthModal,
      closeAuthModal,
      setAuthModalMode,
      login,
      register,
      logout,
      continueAsDemo,
      requireAuth,
    }),
    [
      user,
      session,
      isReady,
      authModalOpen,
      authModalMode,
      authMessage,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      continueAsDemo,
      requireAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
