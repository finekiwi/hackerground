"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EmptyState } from "@/components/common/empty-state"
import { getTeams } from "@/lib/storage"
import { formatDate } from "@/lib/format"
import type { HackathonDetail, Team } from "@/lib/types"

interface TabTeamsProps {
  detail: HackathonDetail
}

export function TabTeams({ detail }: TabTeamsProps) {
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => {
    setTeams(getTeams(detail.slug))
  }, [detail.slug])

  if (!detail.sections.teams.campEnabled) {
    return (
      <EmptyState
        title="팀 모집 기능을 지원하지 않는 해커톤입니다"
        description="개인 참가 또는 사전 팀 구성으로 진행됩니다."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {teams.length > 0 ? `${teams.length}개 팀이 모집 중입니다` : "등록된 팀이 없습니다"}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={detail.sections.teams.listUrl}>캠프에서 더 보기 →</Link>
        </Button>
      </div>

      {teams.length === 0 ? (
        <EmptyState
          title="아직 팀이 없습니다"
          description="가장 먼저 팀을 등록해 보세요!"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.teamCode} className="border-border/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm">{team.name}</h4>
                  <Badge variant={team.isOpen ? "default" : "secondary"} className="text-xs">
                    {team.isOpen ? "모집 중" : "마감"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{team.intro}</p>
                {team.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    {team.memberCount}명 · {formatDate(team.createdAt, false)} 등록
                  </span>
                  {team.contact.url && (
                    <a
                      href={team.contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      지원하기 →
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
