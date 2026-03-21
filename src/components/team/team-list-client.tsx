"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TeamCard } from "@/components/team/team-card"
import { CreateTeamDialog } from "@/components/team/create-team-dialog"
import { EmptyState } from "@/components/common/empty-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getTeams, getHackathons } from "@/lib/storage"
import type { Hackathon, Team } from "@/lib/types"

export function TeamListClient() {
  const searchParams = useSearchParams()
  const [teams, setTeams] = useState<Team[]>([])
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [hackathonTitleMap, setHackathonTitleMap] = useState<Map<string, string>>(new Map())
  const [selectedSlug, setSelectedSlug] = useState<string>("all")

  useEffect(() => {
    setTeams(getTeams())
    const hs = getHackathons()
    setHackathons(hs)
    const map = new Map<string, string>()
    for (const h of hs) {
      map.set(h.slug, h.title)
    }
    setHackathonTitleMap(map)

    const slugParam = searchParams.get("hackathon")
    if (slugParam && hs.some((h) => h.slug === slugParam)) {
      setSelectedSlug(slugParam)
    }
  }, [searchParams])

  const filtered = selectedSlug === "all" ? teams : teams.filter((t) => t.hackathonSlug === selectedSlug)

  return (
    <div className="space-y-6">
      {/* Filters + Create */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Select value={selectedSlug} onValueChange={setSelectedSlug}>
          <SelectTrigger className="w-full sm:w-64" aria-label="해커톤 필터">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {hackathons.map((h) => (
              <SelectItem key={h.slug} value={h.slug}>
                {h.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CreateTeamDialog
          hackathons={hackathons}
          defaultSlug={selectedSlug !== "all" ? selectedSlug : undefined}
          onCreated={(team) => setTeams((prev) => [...prev, team])}
        />
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        총 <span className="font-medium text-foreground">{filtered.length}</span>개 팀
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState title="등록된 팀이 없습니다" description="가장 먼저 팀을 등록해 보세요!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((t, i) => (
            <TeamCard
              key={t.teamCode}
              team={t}
              hackathonTitle={hackathonTitleMap.get(t.hackathonSlug)}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
