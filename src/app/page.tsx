import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  CheckCircle2,
  FolderOpen,
  Users,
  TrendingUp,
  Clock,
  Zap,
  Crown,
} from "lucide-react";

const stats = [
  {
    title: "총 에이전트",
    value: "3",
    change: "콘텐츠 생성팀",
    icon: Bot,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "활성 팀",
    value: "1",
    change: "운영 중",
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "생성된 파일",
    value: "0",
    change: "시작 준비 완료",
    icon: FolderOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "완료 태스크",
    value: "0",
    change: "첫 작업을 시작해보세요",
    icon: CheckCircle2,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const agents = [
  {
    name: "뉴스레터 자동 생성 에이전트",
    role: "콘텐츠 생성팀",
    status: "idle",
    initials: "뉴",
    gradient: "from-blue-500 to-cyan-500",
    description: "최신 트렌드를 분석해 뉴스레터 초안을 자동으로 작성합니다",
  },
  {
    name: "블로그 생성 에이전트",
    role: "콘텐츠 생성팀",
    status: "idle",
    initials: "블",
    gradient: "from-violet-500 to-purple-500",
    description: "키워드와 주제를 입력하면 SEO 최적화된 블로그 글을 생성합니다",
  },
  {
    name: "카드뉴스 에이전트",
    role: "콘텐츠 생성팀",
    status: "idle",
    initials: "카",
    gradient: "from-pink-500 to-rose-500",
    description: "콘텐츠를 카드뉴스 형식으로 기획하고 텍스트를 구성합니다",
  },
];

const statusConfig = {
  active: { label: "활성", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  idle: { label: "대기", className: "bg-amber-100 text-amber-700 border-amber-200" },
  offline: { label: "오프라인", className: "bg-slate-100 text-slate-500 border-slate-200" },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1">
      <TopNav title="대시보드" />

      <main className="flex-1 p-6 space-y-6">
        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl shadow-blue-600/20">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-4 w-4 text-yellow-300" />
            <p className="text-blue-200 text-sm font-medium">CEO</p>
          </div>
          <h2 className="text-2xl font-bold mb-1">Agent Club에 오신 것을 환영합니다</h2>
          <p className="text-blue-300 text-sm">
            콘텐츠 생성팀 에이전트들이 준비되어 있습니다. 첫 번째 작업을 시작해보세요.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              에이전트 3개 대기 중
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{stat.title}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Agent Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">콘텐츠 생성팀</h3>
                <p className="text-xs text-slate-400 mt-0.5">에이전트 3개</p>
              </div>
              <a href="/agents" className="text-sm text-blue-600 hover:underline font-medium">
                팀 관리 →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agents.map((agent) => {
                const status = statusConfig[agent.status as keyof typeof statusConfig];
                return (
                  <Card
                    key={agent.name}
                    className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${agent.gradient} text-white font-semibold text-sm`}
                          >
                            {agent.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 text-sm leading-snug">{agent.name}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{agent.role}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${status.className}`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {agent.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Add agent card */}
              <a href="/agents">
                <Card className="border-2 border-dashed border-slate-200 shadow-none hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">새 팀 또는 에이전트 추가</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>

          {/* CEO Profile + Quick Start */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">내 프로필</h3>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">CEO</p>
                    <p className="text-xs text-slate-500">Agent Club</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">관리 중인 팀</span>
                    <span className="font-semibold text-slate-900">1개</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">총 에이전트</span>
                    <span className="font-semibold text-slate-900">3개</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">접속 상태</span>
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-emerald-600">온라인</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-base font-semibold text-slate-900">빠른 시작</h3>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0 divide-y divide-slate-50">
                {[
                  { icon: Clock, color: "text-blue-500 bg-blue-50", text: "뉴스레터 에이전트에 작업 요청하기", href: "/agents" },
                  { icon: FolderOpen, color: "text-violet-500 bg-violet-50", text: "에이전트 파일 보관함 열기", href: "/files" },
                  { icon: Users, color: "text-emerald-500 bg-emerald-50", text: "새 팀 추가하기", href: "/agents" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a key={i} href={item.href} className="flex gap-3 p-4 hover:bg-slate-50/50 transition-colors">
                      <div className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon size={13} />
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{item.text}</p>
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
