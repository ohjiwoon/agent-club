"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus, Bot, Crown, Newspaper, PenLine, LayoutGrid, Trash2, Loader2, ChevronDown,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  team: string;
  level: "팀장" | "팀원";
  reportsTo: string;
  status: "active" | "idle" | "offline";
  description: string;
  capabilities: string[];
  gradient: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = { Newspaper, PenLine, LayoutGrid, Bot };

const gradientOptions = [
  { label: "블루",   value: "from-blue-500 to-cyan-500" },
  { label: "바이올렛", value: "from-violet-500 to-purple-500" },
  { label: "핑크",   value: "from-pink-500 to-rose-500" },
  { label: "그린",   value: "from-emerald-500 to-teal-500" },
  { label: "오렌지", value: "from-orange-500 to-amber-500" },
  { label: "인디고", value: "from-indigo-500 to-blue-600" },
];

const statusConfig = {
  active:  { label: "활성",    dot: "bg-emerald-500 animate-pulse", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  idle:    { label: "대기",    dot: "bg-amber-400",                 badge: "bg-amber-100 text-amber-700 border-amber-200" },
  offline: { label: "오프라인", dot: "bg-slate-400",                badge: "bg-slate-100 text-slate-500 border-slate-200" },
};

// ── 연결선 컴포넌트 ─────────────────────────────
function VLine({ height = "h-8" }: { height?: string }) {
  return <div className={`w-px ${height} bg-slate-200 mx-auto`} />;
}

function BranchLines({ count }: { count: number }) {
  if (count === 0) return null;
  if (count === 1) return <VLine />;
  // 수평선 + 수직 드롭
  const pct = (i: number) => `${(100 / count) * i + 100 / (count * 2)}%`;
  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-200" />
      <div className="absolute top-6 h-px bg-slate-200"
        style={{ left: pct(0), right: `${100 - parseFloat(pct(count - 1))}%` }} />
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="absolute top-6 w-px h-6 bg-slate-200"
          style={{ left: pct(i) }} />
      ))}
      <div className="h-12" />
    </div>
  );
}

// ── 노드 카드 ────────────────────────────────────
function AgentNode({ agent, onDelete }: { agent: Agent; onDelete: (id: string) => void }) {
  const status = statusConfig[agent.status];
  const Icon   = iconMap[agent.icon] ?? Bot;
  return (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group ring-1 ring-slate-100">
      <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
        <div className={`h-13 w-13 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center shadow-md`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
            {agent.name}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{agent.team}</p>
          {agent.description && (
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">{agent.description}</p>
          )}
        </div>
        <Badge variant="outline" className={`text-[10px] flex items-center gap-1 ${status.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </Badge>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(agent.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </CardContent>
    </Card>
  );
}

// ── 메인 페이지 ──────────────────────────────────
export default function AgentsPage() {
  const [agents, setAgents]     = useState<Agent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [open, setOpen]         = useState(false);
  const [submitting, setSubmit] = useState(false);
  const [form, setForm] = useState({
    name: "", team: "", level: "팀원" as "팀장" | "팀원",
    reportsTo: "마케팅 팀장 에이전트",
    description: "", capabilities: "", gradient: gradientOptions[0].value,
  });

  const load = async () => {
    const res  = await fetch("/api/agents");
    setAgents(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleRegister = async () => {
    if (!form.name.trim() || !form.team.trim()) return;
    setSubmit(true);
    await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        capabilities: form.capabilities.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setOpen(false);
    setForm({ name: "", team: "", level: "팀원", reportsTo: "마케팅 팀장 에이전트", description: "", capabilities: "", gradient: gradientOptions[0].value });
    setSubmit(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/agents?id=${id}`, { method: "DELETE" });
    await load();
  };

  // 계층 분류
  const managers = agents.filter((a) => a.level === "팀장");
  const members  = agents.filter((a) => a.level === "팀원");

  // 팀장별로 팀원 그루핑
  const membersByManager = managers.map((mgr) => ({
    manager: mgr,
    teams: Array.from(new Set(members.filter((m) => m.reportsTo === mgr.name).map((m) => m.team))),
    members: members.filter((m) => m.reportsTo === mgr.name),
  }));

  const totalTeams = Array.from(new Set(members.map((m) => m.team))).length;

  return (
    <div className="flex flex-col flex-1">
      <TopNav title="에이전트 팀" />

      <main className="flex-1 p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">에이전트 조직도</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              팀 {totalTeams}개 · 에이전트 {agents.length}개
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl" onClick={() => setOpen(true)}>
            <Plus size={16} /> 에이전트 등록
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 overflow-x-auto">
            <div className="min-w-[640px] w-full max-w-4xl space-y-0">

              {/* ── Level 0: CEO ── */}
              <div className="flex justify-center">
                <Card className="w-64 border-0 shadow-md ring-1 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow shrink-0">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">CEO</p>
                        <Badge className="text-[10px] bg-yellow-100 text-yellow-700 border-yellow-200">Level 0</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">지운 · 총괄</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </CardContent>
                </Card>
              </div>

              {/* CEO → 팀장(들) 연결 */}
              <BranchLines count={managers.length} />

              {/* ── Level 1: 팀장 에이전트들 ── */}
              {managers.length > 0 && (
                <div className={`grid gap-6`}
                  style={{ gridTemplateColumns: `repeat(${managers.length}, minmax(0, 1fr))` }}>
                  {membersByManager.map(({ manager, teams, members: teamMembers }) => (
                    <div key={manager.id} className="flex flex-col items-center space-y-0">

                      {/* 팀장 노드 */}
                      <Card className="w-full border-0 shadow-md ring-1 ring-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${manager.gradient} flex items-center justify-center shadow shrink-0`}>
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-900 text-sm truncate">{manager.name}</p>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Badge className="text-[10px] bg-violet-100 text-violet-700 border-violet-200">Level 1 · 팀장</Badge>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(manager.id)}
                              className="text-slate-200 hover:text-red-400 transition-colors shrink-0"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          {manager.description && (
                            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">{manager.description}</p>
                          )}
                        </CardContent>
                      </Card>

                      {/* 팀장 → 팀원 연결 */}
                      {teamMembers.length > 0 && <BranchLines count={teamMembers.length} />}

                      {/* ── Level 2: 팀원 에이전트들 ── */}
                      {teamMembers.length > 0 && (
                        <div className="w-full grid gap-3"
                          style={{ gridTemplateColumns: `repeat(${Math.min(teamMembers.length, 3)}, minmax(0, 1fr))` }}>
                          {teamMembers.map((agent) => (
                            <AgentNode key={agent.id} agent={agent} onDelete={handleDelete} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 보고 대상 없는 팀원 (미분류) */}
              {(() => {
                const unassigned = members.filter(
                  (m) => !managers.some((mgr) => mgr.name === m.reportsTo)
                );
                if (unassigned.length === 0) return null;
                return (
                  <div className="pt-4 space-y-3">
                    <p className="text-xs text-center text-slate-400 font-medium">팀장 미배정 에이전트</p>
                    <div className="grid grid-cols-3 gap-3">
                      {unassigned.map((a) => <AgentNode key={a.id} agent={a} onDelete={handleDelete} />)}
                    </div>
                  </div>
                );
              })()}

              {/* 추가 버튼 */}
              <div className="pt-6 flex justify-center">
                <button
                  onClick={() => setOpen(true)}
                  className="rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all py-3 px-8 flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-500"
                >
                  <Plus size={14} /> 에이전트 추가
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 등록 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" /> 에이전트 등록
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">에이전트 이름 *</label>
              <Input placeholder="예: 인스타그램 캡션 에이전트" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">계층 *</label>
                <div className="flex rounded-xl border border-slate-200 bg-white p-1 gap-1">
                  {(["팀장", "팀원"] as const).map((lv) => (
                    <button key={lv} onClick={() => setForm({ ...form, level: lv })}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                        form.level === lv ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"
                      }`}>{lv}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">소속 팀 *</label>
                <Input placeholder="예: 뉴스레터팀" value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })} className="rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">보고 대상</label>
              <Input placeholder="예: 마케팅 팀장 에이전트" value={form.reportsTo}
                onChange={(e) => setForm({ ...form, reportsTo: e.target.value })} className="rounded-xl border-slate-200" />
              <p className="text-[11px] text-slate-400">팀장이면 "CEO", 팀원이면 담당 팀장 에이전트 이름</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">설명</label>
              <Input placeholder="예: 트렌드를 분석해 뉴스레터를 자동 작성합니다" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">기능 태그 (쉼표 구분)</label>
              <Input placeholder="예: 트렌드 분석, 초안 작성, CTA 구성" value={form.capabilities}
                onChange={(e) => setForm({ ...form, capabilities: e.target.value })} className="rounded-xl border-slate-200" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">카드 색상</label>
              <div className="flex gap-2 flex-wrap">
                {gradientOptions.map((g) => (
                  <button key={g.value} onClick={() => setForm({ ...form, gradient: g.value })}
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${g.value} transition-all ${
                      form.gradient === g.value ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"
                    }`} />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>취소</Button>
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700"
              onClick={handleRegister} disabled={!form.name.trim() || !form.team.trim() || submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "등록하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
