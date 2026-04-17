"use client";

import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Bot,
  Crown,
  Newspaper,
  PenLine,
  LayoutGrid,
} from "lucide-react";

const statusConfig = {
  active: {
    label: "활성",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500 animate-pulse",
  },
  idle: {
    label: "대기",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  offline: {
    label: "오프라인",
    className: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  },
};

const agents = [
  {
    name: "뉴스레터\n자동 생성 에이전트",
    status: "idle" as const,
    initials: "뉴",
    gradient: "from-blue-500 to-cyan-500",
    icon: Newspaper,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    description: "트렌드 분석 · 초안 작성 · CTA 구성",
  },
  {
    name: "블로그\n생성 에이전트",
    status: "idle" as const,
    initials: "블",
    gradient: "from-violet-500 to-purple-500",
    icon: PenLine,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    description: "SEO 최적화 · 목차 구성 · 본문 작성",
  },
  {
    name: "카드뉴스\n에이전트",
    status: "idle" as const,
    initials: "카",
    gradient: "from-pink-500 to-rose-500",
    icon: LayoutGrid,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
    description: "슬라이드 기획 · 카피 작성 · SNS 최적화",
  },
];

function ConnectorV({ height = "h-8" }: { height?: string }) {
  return <div className={`w-px ${height} bg-slate-200 mx-auto`} />;
}

function ConnectorBranch() {
  return (
    <div className="relative w-full">
      {/* vertical down from team */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-200" />
      {/* horizontal bar */}
      <div className="absolute top-6 left-[17%] right-[17%] h-px bg-slate-200" />
      {/* three vertical drops */}
      <div className="absolute top-6 left-[17%] w-px h-6 bg-slate-200" />
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-200" />
      <div className="absolute top-6 right-[17%] w-px h-6 bg-slate-200" />
      <div className="h-12" />
    </div>
  );
}

export default function AgentsPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopNav title="에이전트 팀" />

      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">에이전트 팀</h2>
            <p className="text-sm text-slate-500 mt-0.5">팀 1개 · 에이전트 3개</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl">
            <Plus size={16} />
            새 팀 / 에이전트 추가
          </Button>
        </div>

        {/* Org Chart */}
        <div className="flex flex-col items-center py-4 overflow-x-auto">
          <div className="min-w-[600px] w-full max-w-3xl">

            {/* ── CEO Node ── */}
            <div className="flex justify-center">
              <Card className="w-72 border-0 shadow-md ring-1 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow shrink-0">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">CEO</p>
                        <Badge className="text-[10px] bg-yellow-100 text-yellow-700 border-yellow-200">
                          Owner
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Agent Club 총괄</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connector: CEO → Team */}
            <ConnectorV height="h-8" />

            {/* ── Team Node ── */}
            <div className="flex justify-center">
              <Card className="w-72 border-0 shadow-md ring-1 ring-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow shrink-0">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900">콘텐츠 생성팀</p>
                      <p className="text-xs text-slate-500 mt-0.5">AI 기반 콘텐츠 자동 생산</p>
                    </div>
                    <Badge className="text-[10px] bg-violet-100 text-violet-700 border-violet-200 shrink-0">
                      에이전트 3
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connector: Team → Agents (branch) */}
            <ConnectorBranch />

            {/* ── Agent Nodes ── */}
            <div className="grid grid-cols-3 gap-4">
              {agents.map((agent) => {
                const status = statusConfig[agent.status];
                const AgentIcon = agent.icon;
                return (
                  <Card
                    key={agent.name}
                    className="border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group ring-1 ring-slate-100"
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                      {/* Avatar */}
                      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center shadow-md shrink-0`}>
                        <AgentIcon className="h-7 w-7 text-white" />
                      </div>

                      {/* Name */}
                      <div>
                        <p className="font-semibold text-slate-900 text-sm leading-snug whitespace-pre-line group-hover:text-blue-600 transition-colors">
                          {agent.name}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {agent.description}
                        </p>
                      </div>

                      {/* Status */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] flex items-center gap-1 ${status.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Add agent hint */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="col-start-2">
                <button className="w-full rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all py-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-500">
                  <Plus size={14} />
                  에이전트 추가
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Add new team */}
        <Card className="border-2 border-dashed border-slate-200 shadow-none hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <Plus className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">새 팀 만들기</p>
              <p className="text-xs text-slate-400 mt-0.5">마케팅팀, 리서치팀 등 원하는 팀을 추가하세요</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
