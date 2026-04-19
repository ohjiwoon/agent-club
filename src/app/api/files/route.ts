import { NextRequest, NextResponse } from "next/server";
import { readFiles, writeFiles, FileRecord } from "@/lib/data";
import { randomUUID } from "crypto";

// GET /api/files — 전체 파일 목록
export async function GET() {
  const files = readFiles();
  return NextResponse.json(files);
}

// POST /api/files — 파일 수신 (OpenClaw 에이전트가 호출)
// Body: { name, content, agentId, agentName, team, type? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, content, agentId, agentName, team, type } = body;

    if (!name || !content || !agentName) {
      return NextResponse.json(
        { error: "name, content, agentName은 필수입니다." },
        { status: 400 }
      );
    }

    const files = readFiles();

    const newFile: FileRecord = {
      id: randomUUID(),
      name,
      content,
      agentId: agentId ?? "",
      agentName,
      team: team ?? "",
      type: type ?? "md",
      createdAt: new Date().toISOString(),
    };

    files.unshift(newFile); // 최신 파일이 맨 위
    writeFiles(files);

    return NextResponse.json(newFile, { status: 201 });
  } catch {
    return NextResponse.json({ error: "파일 저장 실패" }, { status: 500 });
  }
}
