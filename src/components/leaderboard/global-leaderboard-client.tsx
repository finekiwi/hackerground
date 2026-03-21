"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/common/empty-state"
import { getLeaderboards, getHackathons } from "@/lib/storage"
import { formatDate } from "@/lib/format"
import type { Leaderboard, LeaderboardEntry } from "@/lib/types"

type Period = "7d" | "30d" | "all"

function filterByPeriod(entries: LeaderboardEntry[], period: Period): LeaderboardEntry[] {
  if (period === "all") return entries
  const now = Date.now()
  const ms = period === "7d" ? 7 * 86_400_000 : 30 * 86_400_000
  return entries.filter((e) => now - new Date(e.submittedAt).getTime() <= ms)
}

function sortAndRank(entries: LeaderboardEntry[]): (LeaderboardEntry & { displayRank: string })[] {
  const scored = entries.filter((e) => e.score !== null)
  const unscored = entries.filter((e) => e.score === null)

  scored.sort((a, b) => (b.score as number) - (a.score as number))

  return [
    ...scored.map((e, i) => ({ ...e, displayRank: String(i + 1) })),
    ...unscored.map((e) => ({ ...e, displayRank: "\u2014" })),
  ]
}

function LeaderboardTable({ entries }: { entries: (LeaderboardEntry & { displayRank: string })[] }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">순위</TableHead>
            <TableHead>팀명</TableHead>
            <TableHead className="text-right">점수</TableHead>
            <TableHead className="text-right hidden sm:table-cell">제출 시각</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.teamName}>
              <TableCell className="text-center font-medium">{entry.displayRank}</TableCell>
              <TableCell className="font-medium">{entry.teamName}</TableCell>
              <TableCell className="text-right">
                {entry.score !== null ? entry.score.toLocaleString("ko-KR") : "집계 중"}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-xs hidden sm:table-cell">
                {formatDate(entry.submittedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function GlobalLeaderboardClient() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([])
  const [hackathonTitleMap, setHackathonTitleMap] = useState<Map<string, string>>(new Map())
  const [selectedSlug, setSelectedSlug] = useState<string>("all")
  const [period, setPeriod] = useState<Period>("all")

  useEffect(() => {
    setLeaderboards(getLeaderboards())
    const map = new Map<string, string>()
    for (const h of getHackathons()) {
      map.set(h.slug, h.title)
    }
    setHackathonTitleMap(map)
  }, [])

  const periods: { value: Period; label: string }[] = [
    { value: "7d", label: "7일" },
    { value: "30d", label: "30일" },
    { value: "all", label: "전체" },
  ]

  const filteredBoards = useMemo(() => {
    const boards = selectedSlug === "all" ? leaderboards : leaderboards.filter((l) => l.hackathonSlug === selectedSlug)
    return boards.map((lb) => ({
      hackathonSlug: lb.hackathonSlug,
      entries: sortAndRank(filterByPeriod(lb.entries, period)),
    }))
  }, [leaderboards, selectedSlug, period])

  const totalCount = filteredBoards.reduce((sum, b) => sum + b.entries.length, 0)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedSlug} onValueChange={setSelectedSlug}>
          <SelectTrigger className="w-full sm:w-64" aria-label="해커톤 선택">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {leaderboards.map((lb) => (
              <SelectItem key={lb.hackathonSlug} value={lb.hackathonSlug}>
                {hackathonTitleMap.get(lb.hackathonSlug) ?? lb.hackathonSlug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={[
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                period === p.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        총 <span className="font-medium text-foreground">{totalCount}</span>개 항목
      </p>

      {/* Tables */}
      {totalCount === 0 ? (
        <EmptyState title="해당하는 리더보드 항목이 없습니다" description="필터를 조정해 보세요." />
      ) : selectedSlug !== "all" ? (
        <LeaderboardTable entries={filteredBoards[0]?.entries ?? []} />
      ) : (
        <div className="space-y-8">
          {filteredBoards.map((board) => (
            <div key={board.hackathonSlug} className="space-y-3">
              <h2 className="text-lg font-semibold">
                {hackathonTitleMap.get(board.hackathonSlug) ?? board.hackathonSlug}
              </h2>
              <LeaderboardTable entries={board.entries} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
