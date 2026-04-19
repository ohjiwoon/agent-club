"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  FolderOpen,
  Loader2,
  Bot,
  Clock,
  X,
} from "lucide-react";

interface FileRecord {
  id: string;
  name: string;
  content: string;
  agentId: string;
  agentName: string;
  team: string;
  type: "md" | "txt" | "other";
  createdAt: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FileRecord | null>(null);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.agentName.toLowerCase().includes(search.toLowerCase())
  );

  // group by agent
  const agentGroups = filtered.reduce<Record<string, FileRecord[]>>((acc, f) => {
    const key = f.agentName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {});

  return (
    <div className="flex flex-col flex-1">
      <TopNav title="에이전트 파일" />

      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">에이전트 파일 보관함</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              에이전트들이 생성한 결과물을 여기서 확인하고 열람하세요
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100 font-mono">
            POST /api/files
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">OpenClaw 연동 방법</p>
            <p className="text-xs text-blue-600 mt-0.5">
              OpenClaw 에이전트가 파일을 생성하면{" "}
              <code className="bg-blue-100 rounded px-1">POST /api/files</code>로 자동 전송하도록 스킬을 설정하세요.
              MD 파일은 클릭하면 바로 읽을 수 있습니다.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="파일명 또는 에이전트 검색..."
            className="pl-9 bg-white border-slate-200 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          /* Empty state */
          <Card className="border-0 shadow-sm">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-base font-semibold text-slate-400 mb-1">아직 파일이 없어요</p>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed mb-6">
                OpenClaw 에이전트가 작업을 완료하면 파일이 자동으로 여기에 나타납니다.
              </p>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-left max-w-sm">
                <p className="text-xs font-semibold text-slate-500 mb-2">테스트 방법 (터미널에서 실행)</p>
                <code className="text-[11px] text-slate-600 whitespace-pre-wrap break-all">
{`curl -X POST http://localhost:3000/api/files \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "테스트 뉴스레터",
    "content": "# 안녕하세요\\n\\n첫 번째 뉴스레터입니다.",
    "agentName": "뉴스레터 자동 생성 에이전트",
    "team": "콘텐츠 생성팀",
    "type": "md"
  }'`}
                </code>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* File list grouped by agent */
          <div className="space-y-6">
            {Object.entries(agentGroups).map(([agentName, agentFiles]) => (
              <div key={agentName} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700">{agentName}</h3>
                  <span className="text-xs text-slate-400">{agentFiles.length}개</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {agentFiles.map((file) => (
                    <Card
                      key={file.id}
                      className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group ring-1 ring-slate-100"
                      onClick={() => setSelected(file)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 px-1.5">
                                {file.type.toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock size={10} />
                                {formatDate(file.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Preview */}
                        <p className="mt-3 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {file.content.replace(/#+\s/g, "").substring(0, 100)}…
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MD Viewer Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-row items-start justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="text-base">{selected?.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Bot size={12} className="text-slate-400" />
                <span className="text-xs text-slate-400">{selected?.agentName}</span>
                {selected && (
                  <>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">{formatDate(selected.createdAt)}</span>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 mt-4 pr-1">
            {selected?.type === "md" ? (
              <div className="prose prose-sm prose-slate max-w-none">
                <ReactMarkdown>{selected.content}</ReactMarkdown>
              </div>
            ) : (
              <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">
                {selected?.content}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
