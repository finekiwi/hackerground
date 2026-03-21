"use client"

import { Badge } from "@/components/ui/badge"
import type { HackathonDetail } from "@/lib/types"

interface TabOverviewProps {
  detail: HackathonDetail
}

export function TabOverview({ detail }: TabOverviewProps) {
  const { overview, info } = detail.sections

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">개요</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{overview.summary}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">팀 구성</h3>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline">
            {overview.teamPolicy.allowSolo ? "개인 참가 허용" : "팀 참가만 가능"}
          </Badge>
          <Badge variant="outline">최대 {overview.teamPolicy.maxTeamSize}인</Badge>
        </div>
      </div>

      {info.notice.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">공지사항</h3>
          <ul className="space-y-1.5">
            {info.notice.map((n, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <a
          href={info.links.rules}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          규정 보기 →
        </a>
        <a
          href={info.links.faq}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          FAQ →
        </a>
      </div>
    </div>
  )
}
