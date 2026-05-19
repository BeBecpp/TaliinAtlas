"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";

interface ProtectedActionProps {
  children: (props: { onClick: () => void }) => ReactNode;
  onAuthed?: () => void;
}

export default function ProtectedAction({ children, onAuthed }: ProtectedActionProps) {
  const { requireAuth } = useAuth();

  const handleClick = () => {
    requireAuth(onAuthed);
  };

  return <>{children({ onClick: handleClick })}</>;
}
