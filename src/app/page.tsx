import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Bot, FolderOpen, Users, TrendingUp, Zap } from "lucide-react";
import { readAgents, readFiles } from "@/lib/data";

export default function DashboardPage() {
  const agents = readAgents();
  const files  = readFiles();

  const managers  = agents.filter((a) => a.level === "팀장");
  const members   = agents.filter((a) => a.level === "팀원");
  const teams     = Array.from(new Set(members.map((a) => a.team)));
  const activeCount = agents.filter((a) => a.status === "active").length;

  const stats = [
    { title: "총 에이전트",   value: String(agents.length), sub: `팀장 ${managers.length} · 팀원 ${members.length}`, icon: Bot,       color: "text-blue-600",    bg: "bg-blue-50" },
    { title: "운영 중인 팀",  value: String(teams.length),  sub: teams.join(" · ") || "팀 없음",                       icon: Users,      color: "text-violet-600",  bg: "bg-violet-50" },
    { title: "생성된 파일",   value: String(files.length),  sub: files.length ? "파일 보관함에서 열람 가능" : "아직 없음", icon: FolderOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "활성 에이전트", value: String(activeCount),   sub: activeCount ? "작업 진행 중" : "모두 대기 중",          icon: Zap,        color: "text-orange-600",  bg: "bg-orange-50" },
  ];

  return (
    <div className="flex flex-col flex-1">
      <TopNav title="대시보드" />

      <main className="flex-1 p-6 space-y-6">

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl shadow-blue-600/20">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-4 w-4 text-yellow-300" />
            <p className="text-blue-200 text-sm font-medium">CEO · 지운</p>
          </div>
          <h2 className="text-2xl font-bold mb-1">Agent Club</h2>
          <p className="text-blue-300 text-sm">
            에이전트 조직의 현황과 결과물을 한눈에 관리하세요.
          </p>
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              에이전트 {agents.length}개 등록됨
            </div>
            {teams.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                팀 {teams.length}개 운영 중
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`rounded-xl p-2.5 ${s.bg}`}>
                      <Icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{s.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* 조직 현황 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">조직 현황</h3>
              <a href="/agents" className="text-sm text-blue-600 hover:underline font-medium">조직도 보기 →</a>
            </div>

            {/* 팀장 */}
            {managers.map((mgr) => {
              const teamMembers = members.filter((m) => m.reportsTo === mgr.name);
              const mgrTeams    = Array.from(new Set(teamMembers.map((m) => m.team)));
              return (
                <div key={mgr.id} className="space-y-2">
                  <Card className="border-0 shadow-sm ring-1 ring-violet-100 bg-violet-50/40">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${mgr.gradient} flex items-center justify-center shrink-0`}>
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm truncate">{mgr.name}</p>
                          <Badge className="text-[10px] bg-violet-100 text-violet-700 border-violet-200 shrink-0">팀장</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{mgrTeams.join(" · ")} 관리</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 팀원들 */}
                  <div className="pl-4 border-l-2 border-violet-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {teamMembers.map((agent) => (
                      <Card key={agent.id} className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center shrink-0`}>
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 text-xs group-hover:text-blue-600 transition-colors truncate">{agent.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{agent.team}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}

            {agents.length === 0 && (
              <Card className="border-2 border-dashed border-slate-200 shadow-none">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <Bot className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">등록된 에이전트가 없습니다</p>
                  <a href="/agents" className="mt-3 text-xs text-blue-600 hover:underline">에이전트 등록하기 →</a>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CEO 프로필 + 빠른 이동 */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">내 프로필</h3>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">지운</p>
                    <p className="text-xs text-slate-500">CEO · Agent Club</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: "관리 팀", value: `${teams.length}개` },
                    { label: "총 에이전트", value: `${agents.length}개` },
                    { label: "생성 파일", value: `${files.length}개` },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-slate-500">{row.label}</span>
                      <span className="font-semibold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-slate-500">접속 상태</span>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-emerald-600">온라인</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-base font-semibold text-slate-900">바로 가기</h3>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0 divide-y divide-slate-50">
                {[
                  { icon: Bot,       color: "text-violet-500 bg-violet-50", text: "조직도 관리",     href: "/agents" },
                  { icon: FolderOpen, color: "text-blue-500 bg-blue-50",   text: "에이전트 파일 보관함", href: "/files" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.href} href={item.href}
                      className="flex gap-3 p-4 hover:bg-slate-50/50 transition-colors">
                      <div className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon size={13} />
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed self-center">{item.text}</p>
                    </a>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
