import { NextRequest, NextResponse } from "next/server";
import { readAgents, writeAgents, Agent } from "@/lib/data";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json(readAgents());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, team, level, reportsTo, description, capabilities, icon, gradient } = body;

    if (!name || !team) {
      return NextResponse.json({ error: "name과 team은 필수입니다." }, { status: 400 });
    }

    const newAgent: Agent = {
      id: randomUUID(),
      name,
      team,
      level: level ?? "팀원",
      reportsTo: reportsTo ?? "CEO",
      status: "idle",
      description: description ?? "",
      capabilities: capabilities ?? [],
      gradient: gradient ?? "from-slate-500 to-gray-600",
      icon: icon ?? "Bot",
      registeredAt: new Date().toISOString(),
    };

    const agents = readAgents();
    agents.push(newAgent);
    writeAgents(agents);

    return NextResponse.json(newAgent, { status: 201 });
  } catch {
    return NextResponse.json({ error: "등록 실패" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });

  const filtered = readAgents().filter((a) => a.id !== id);
  writeAgents(filtered);
  return NextResponse.json({ success: true });
}
