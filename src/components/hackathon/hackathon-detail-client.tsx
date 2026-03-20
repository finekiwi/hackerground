"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/common/status-badge"
import { TabOverview } from "@/components/hackathon/tabs/tab-overview"
import { TabEval } from "@/components/hackathon/tabs/tab-eval"
import { TabSchedule } from "@/components/hackathon/tabs/tab-schedule"
import { TabPrize } from "@/components/hackathon/tabs/tab-prize"
import { TabTeams } from "@/components/hackathon/tabs/tab-teams"
import { TabSubmit } from "@/components/hackathon/tabs/tab-submit"
import { TabLeaderboard } from "@/components/hackathon/tabs/tab-leaderboard"
import { getHackathon, getHackathonDetail } from "@/lib/storage"
import type { Hackathon, HackathonDetail } from "@/lib/types"

const TABS = [
  { value: "overview", label: "개요" },
  { value: "eval", label: "평가" },
  { value: "schedule", label: "일정" },
  { value: "prize", label: "시상" },
  { value: "teams", label: "팀" },
  { value: "submit", label: "제출" },
  { value: "leaderboard", label: "리더보드" },
] as const

type TabValue = (typeof TABS)[number]["value"]

interface HackathonDetailClientProps {
  slug: string
}

export function HackathonDetailClient({ slug }: HackathonDetailClientProps) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [detail, setDetail] = useState<HackathonDetail | null>(null)
  const [activeTab, setActiveTab] = useState<TabValue>("overview")

  useEffect(() => {
    setHackathon(getHackathon(slug) ?? null)
    setDetail(getHackathonDetail(slug) ?? null)
  }, [slug])

  if (!hackathon) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        해커톤 정보를 불러올 수 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <StatusBadge status={hackathon.status} />
          <span className="text-sm text-muted-foreground">{hackathon.period.timezone}</span>
        </div>
        <h1 className="text-2xl font-bold leading-snug">{hackathon.title}</h1>
        <div className="flex flex-wrap gap-1.5">
          {hackathon.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* No detail fallback */}
      {!detail ? (
        <div className="rounded-lg border border-dashed p-8 text-center space-y-2">
          <p className="font-medium">상세 정보를 준비 중입니다</p>
          <p className="text-sm text-muted-foreground">
            아직 상세 정보가 등록되지 않은 해커톤입니다. 공식 페이지를 확인해 주세요.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a
              href={hackathon.links.rules}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              규정 →
            </a>
            <a
              href={hackathon.links.faq}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              FAQ →
            </a>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="flex-wrap h-auto gap-1">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <TabOverview detail={detail} />
            </TabsContent>
            <TabsContent value="eval">
              <TabEval detail={detail} />
            </TabsContent>
            <TabsContent value="schedule">
              <TabSchedule detail={detail} />
            </TabsContent>
            <TabsContent value="prize">
              <TabPrize detail={detail} />
            </TabsContent>
            <TabsContent value="teams">
              <TabTeams detail={detail} />
            </TabsContent>
            <TabsContent value="submit">
              <TabSubmit detail={detail} />
            </TabsContent>
            <TabsContent value="leaderboard">
              <TabLeaderboard detail={detail} />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  )
}
