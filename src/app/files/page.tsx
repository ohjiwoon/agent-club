"use client";

import { useState } from "react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Search,
  FileText,
  Image,
  FolderOpen,
  Newspaper,
  PenLine,
  LayoutGrid,
} from "lucide-react";

const agents = [
  {
    name: "뉴스레터 자동 생성 에이전트",
    initials: "뉴",
    gradient: "from-blue-500 to-cyan-500",
    icon: Newspaper,
    iconColor: "text-blue-600 bg-blue-50",
    fileCount: 0,
  },
  {
    name: "블로그 생성 에이전트",
    initials: "블",
    gradient: "from-violet-500 to-purple-500",
    icon: PenLine,
    iconColor: "text-violet-600 bg-violet-50",
    fileCount: 0,
  },
  {
    name: "카드뉴스 에이전트",
    initials: "카",
    gradient: "from-pink-500 to-rose-500",
    icon: LayoutGrid,
    iconColor: "text-pink-600 bg-pink-50",
    fileCount: 0,
  },
];

const categories = ["전체", "문서", "이미지", "기타"];

export default function FilesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  return (
    <div className="flex flex-col flex-1">
      <TopNav title="에이전트 파일" />

      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">에이전트 파일 보관함</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              에이전트들이 생성한 결과물 파일을 한 곳에서 확인하고 관리하세요
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl self-start sm:self-auto">
            <Upload size={16} />
            파일 업로드
          </Button>
        </div>

        {/* Info banner */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">이 공간은 에이전트들의 작업 결과물을 보관합니다</p>
            <p className="text-xs text-blue-600 mt-0.5">
              에이전트가 뉴스레터, 블로그 글, 카드뉴스 등을 생성하면 자동으로 여기에 저장됩니다.
              파일을 직접 업로드하거나 에이전트에 작업을 요청해보세요.
            </p>
          </div>
        </div>

        {/* Agent sections */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">에이전트별 파일</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const AgentIcon = agent.icon;
              return (
                <Card
                  key={agent.name}
                  className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${agent.iconColor}`}>
                        <AgentIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {agent.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-xs text-slate-400">파일 {agent.fileCount}개</span>
                      <span className="text-[10px] text-slate-300 bg-slate-50 rounded-full px-2 py-0.5">비어있음</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="파일 이름 검색..."
              className="pl-9 bg-white border-slate-200 rounded-xl focus-visible:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 gap-1 self-start sm:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <Card className="border-0 shadow-sm">
          <CardContent className="py-20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-base font-semibold text-slate-400 mb-1">아직 파일이 없어요</p>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
              에이전트에 첫 번째 작업을 요청하거나, 공유할 파일을 직접 업로드해보세요.
            </p>
            <div className="flex gap-3">
              <a href="/agents">
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl border-slate-200 text-slate-600"
                >
                  에이전트 팀 보기
                </Button>
              </a>
              <Button className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Upload size={14} />
                파일 업로드
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
