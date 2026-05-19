"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Download, FlaskConical, LogIn, Map, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAtlasWorkspace } from "@/context/AtlasWorkspaceContext";
import UserMenu from "@/components/auth/UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { atlasLoaded, handleExport } = useAtlasWorkspace();

  const linkClass = (href: string) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition ${
      pathname === href
        ? "bg-atlas-primary/20 text-atlas-text"
        : "text-atlas-muted hover:bg-white/5 hover:text-atlas-text"
    }`;

  const scrollToProgress = () => {
    if (pathname !== "/") {
      window.location.href = "/#progress";
      return;
    }
    document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-atlas-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-atlas-primary/30 bg-atlas-primary/10">
            <Sparkles className="h-4 w-4 text-atlas-primary" />
          </div>
          <span className="hidden font-bold text-atlas-text sm:inline">TaliinAtlas</span>
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-1 overflow-x-auto">
          <Link href="/" className={linkClass("/")}>
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Generate</span>
          </Link>
          <Link href="/library" className={linkClass("/library")}>
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">My Atlases</span>
          </Link>
          <Link href="/lab" className={linkClass("/lab")}>
            <FlaskConical className="h-4 w-4" />
            <span className="hidden sm:inline">AI Lab</span>
          </Link>
          <button type="button" onClick={scrollToProgress} className={linkClass("/#progress")}>
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </button>
          {atlasLoaded && (
            <button
              type="button"
              onClick={handleExport}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-atlas-muted hover:bg-white/5 hover:text-atlas-cyan md:flex"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="flex items-center gap-2 rounded-xl border border-atlas-primary/30 bg-atlas-primary/10 px-3 py-2 text-sm font-medium text-atlas-primary transition hover:shadow-glow"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Log in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
