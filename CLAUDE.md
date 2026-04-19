@AGENTS.md

# Agent Club — 프로젝트 컨텍스트

## 프로젝트 목적

**Agent Club**은 지운의 AI 에이전트 팀을 시각적으로 관리하는 대시보드 웹사이트입니다.

> ⚠️ 핵심 전제: 에이전트에게 업무를 직접 지시하는 도구가 아닙니다.
> 에이전트 조직 구조와 결과물을 **보고 관리**하는 것이 목적입니다.
> 업무 지시는 텔레그램(OpenClaw)으로 별도 진행합니다.

## 조직 계층 구조

```
Level 0: CEO (지운) — 사람
    ↓
Level 1: 마케팅 팀장 에이전트
    ↓         ↓           ↓
Level 2: 블로그팀   뉴스레터팀   카드뉴스팀
         에이전트    에이전트     에이전트
```

- **Level 0 (CEO)**: 사람. 텔레그램으로 지시
- **Level 1 (팀장)**: 팀원 에이전트들의 산출물을 취합·보고하는 에이전트
- **Level 2 (팀원)**: 실제 콘텐츠를 생성하는 에이전트

## 데이터 스키마

### Agent
```typescript
{
  id: string           // UUID (자동 생성)
  name: string         // 에이전트 이름
  team: string         // 소속 팀 (예: "뉴스레터팀")
  level: string        // "팀장" | "팀원"
  reportsTo: string    // 보고 대상 (예: "마케팅 팀장 에이전트" | "CEO")
  status: "active" | "idle" | "offline"
  description: string
  capabilities: string[]
  gradient: string     // Tailwind gradient (예: "from-blue-500 to-cyan-500")
  icon: string         // lucide-react 아이콘 이름
  registeredAt: string // ISO 8601
}
```

### FileRecord
```typescript
{
  id: string
  name: string         // 파일 제목
  content: string      // 마크다운 내용
  agentId: string
  agentName: string
  team: string
  type: "md" | "txt" | "other"
  createdAt: string    // ISO 8601
}
```

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/agents` | 전체 에이전트 목록 |
| POST | `/api/agents` | 에이전트 등록 |
| DELETE | `/api/agents?id=` | 에이전트 삭제 |
| GET | `/api/files` | 전체 파일 목록 |
| POST | `/api/files` | 파일 수신 (에이전트가 호출) |

## 주요 파일 위치

| 파일 | 역할 |
|------|------|
| `data/agents.json` | 에이전트 데이터 저장소 |
| `data/files.json` | 파일 데이터 저장소 |
| `src/lib/data.ts` | 데이터 읽기/쓰기 유틸 |
| `src/app/agents/page.tsx` | 조직도 페이지 |
| `src/app/files/page.tsx` | 파일 보관함 페이지 |
| `docs/agent-design-standard.md` | 에이전트 설계 표준서 (인간용) |

## 코딩 원칙

- 에이전트 조직도는 계층(Level)을 시각적으로 명확히 구분할 것
- 모든 데이터는 `data/*.json`에 저장 (Supabase 전환 전까지)
- 새 필드 추가 시 `src/lib/data.ts` 인터페이스 → `route.ts` → `page.tsx` 순서로 수정
- UI 컴포넌트는 shadcn/ui 우선 사용, 아이콘은 lucide-react 사용
