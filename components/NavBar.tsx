"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  Trophy,
  Zap,
  History,
  LogOut,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NAVBAR_LINKS } from "@/lib/constants";

const ICON_MAP = {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  TrendingUp,
  Trophy,
  Zap,
  History,
} as const;

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex justify-around items-center z-40 md:hidden">
        {NAVBAR_LINKS.map((link) => {
          const Icon =
            ICON_MAP[link.icon as keyof typeof ICON_MAP];
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Left Sidebar */}
      <nav className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-card md:flex md:flex-col md:border-r md:border-border md:z-40">
        {/* Header */}
        <div className="p-4 border-b border-blue-600/30 bg-gradient-to-b from-blue-600/20 to-transparent">
          <div className="space-y-2">
            <h1 className="font-display text-5xl font-black text-blue-400 tracking-widest" style={{ textShadow: '0 0 6px rgba(59, 130, 246, 0.15)' }}>
              KHABIB MODE
            </h1>
            <div className="flex gap-2">
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" style={{ boxShadow: '0 0 4px rgba(59, 130, 246, 0.2)' }} />
              <div className="h-1 w-10 bg-blue-600/40 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2">
          {NAVBAR_LINKS.map((link) => {
            const Icon =
              ICON_MAP[link.icon as keyof typeof ICON_MAP];
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-l-2 border-l-blue-600 dark:border-l-blue-400 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-blue-500/5"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 space-y-3 border-t border-border">
          <Link
            href="/profile"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 transition-all duration-300"
          >
            <User size={20} />
            <span className="text-sm font-medium">Perfil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <p className="text-xs text-muted-foreground text-center mt-4">v1.0</p>
        </div>
      </nav>
    </>
  );
}
