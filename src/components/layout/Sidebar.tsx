"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "대시보드",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "에이전트 팀",
    href: "/agents",
    icon: Users,
  },
  {
    label: "에이전트 파일",
    href: "/files",
    icon: FolderOpen,
  },
  {
    label: "설정",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white tracking-tight">
            Agent Club
          </span>
          <p className="text-[10px] text-slate-400 leading-tight">AI 팀 관리</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          메인 메뉴
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  isActive ? "text-white" : "text-slate-400"
                )}
                size={18}
              />
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-300" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700/60">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-800/60">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            👑
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">CEO</p>
            <p className="text-[10px] text-slate-500 truncate">Agent Club</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
