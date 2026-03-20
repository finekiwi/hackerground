"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/common/empty-state"
import { getLeaderboard } from "@/lib/storage"
import { formatDate } from "@/lib/format"
import type { HackathonDetail, LeaderboardEntry } from "@/lib/types"

interface TabLeaderboardProps {
  detail: HackathonDetail
}

function sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    // Ranked entries first (ascending rank)
    if (a.rank !== null && b.rank !== null) return a.rank - b.rank
    if (a.rank !== null) return -1
    if (b.rank !== null) return 1
    // Unranked: most recent submission first
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  })
}

export function TabLeaderboard({ detail }: TabLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const hasBreakdown = detail.sections.eval.scoreSource === "vote"

  useEffect(() => {
    const lb = getLeaderboard(detail.slug)
    if (lb) {
      setEntries(sortEntries(lb.entries))
      setUpdatedAt(lb.updatedAt)
    }
  }, [detail.slug])

  if (entries.length === 0) {
    return (
      <EmptyState
        title="아직 집계된 점수가 없습니다"
        description="제출 마감 후 리더보드가 업데이트됩니다."
      />
    )
  }

  const breakdown = detail.sections.eval.scoreDisplay?.breakdown ?? []

  return (
    <div className="space-y-4">
      {updatedAt && (
        <p className="text-xs text-muted-foreground">
          최종 업데이트: {formatDate(updatedAt)}
        </p>
      )}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">순위</TableHead>
              <TableHead>팀명</TableHead>
              <TableHead className="text-right">
                {detail.sections.eval.scoreDisplay?.label ?? "점수"}
              </TableHead>
              {hasBreakdown &&
                breakdown.map((b) => (
                  <TableHead key={b.key} className="text-right hidden sm:table-cell">
                    {b.label} ({b.weightPercent}%)
                  </TableHead>
                ))}
              <TableHead className="text-right hidden md:table-cell">제출 시각</TableHead>
              {detail.sections.leaderboard.note && (
                <TableHead className="hidden lg:table-cell">제출물</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.teamName}>
                <TableCell className="text-center font-medium">
                  {entry.rank ?? "—"}
                </TableCell>
                <TableCell className="font-medium">{entry.teamName}</TableCell>
                <TableCell className="text-right">
                  {entry.score !== null ? entry.score.toLocaleString("ko-KR") : "집계 중"}
                </TableCell>
                {hasBreakdown &&
                  breakdown.map((b) => (
                    <TableCell key={b.key} className="text-right hidden sm:table-cell">
                      {entry.scoreBreakdown?.[b.key] ?? "—"}
                    </TableCell>
                  ))}
                <TableCell className="text-right text-muted-foreground text-xs hidden md:table-cell">
                  {formatDate(entry.submittedAt)}
                </TableCell>
                {detail.sections.leaderboard.note && (
                  <TableCell className="hidden lg:table-cell">
                    {entry.artifacts && (
                      <div className="flex gap-2 text-xs">
                        {entry.artifacts.webUrl && (
                          <a
                            href={entry.artifacts.webUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            웹
                          </a>
                        )}
                        {entry.artifacts.pdfUrl && (
                          <a
                            href={entry.artifacts.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            PDF
                          </a>
                        )}
                        {entry.artifacts.planTitle && (
                          <span className="text-muted-foreground">
                            {entry.artifacts.planTitle}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {detail.sections.leaderboard.note && (
        <p className="text-xs text-muted-foreground">{detail.sections.leaderboard.note}</p>
      )}
    </div>
  )
}
