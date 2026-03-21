"use client"

import { useState, useEffect } from "react"
import { HackathonCard } from "@/components/hackathon/hackathon-card"
import { EmptyState } from "@/components/common/empty-state"
import { getHackathons } from "@/lib/storage"
import type { Hackathon, HackathonStatus } from "@/lib/types"

const STATUS_LABELS: Record<HackathonStatus, string> = {
  ongoing: "진행 중",
  upcoming: "예정",
  ended: "종료",
}

const ALL_STATUSES: HackathonStatus[] = ["ongoing", "upcoming", "ended"]

export function HackathonListClient() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [activeStatuses, setActiveStatuses] = useState<Set<HackathonStatus>>(
    new Set(ALL_STATUSES)
  )
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    setHackathons(getHackathons())
  }, [])

  const allTags = Array.from(new Set(hackathons.flatMap((h) => h.tags)))

  const filtered = hackathons.filter((h) => {
    const statusMatch = activeStatuses.has(h.status)
    const tagMatch = activeTag === null || h.tags.includes(activeTag)
    return statusMatch && tagMatch
  })

  function toggleStatus(status: HackathonStatus) {
    setActiveStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(status)) {
        if (next.size === 1) return next // keep at least one
        next.delete(status)
      } else {
        next.add(status)
      }
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={[
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                activeStatuses.has(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50",
              ].join(" ")}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={[
                "px-3 py-1 rounded-full text-xs border transition-colors",
                activeTag === null
                  ? "bg-zinc-800 text-white border-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-200"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50",
              ].join(" ")}
            >
              전체
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={[
                  "px-3 py-1 rounded-full text-xs border transition-colors",
                  activeTag === tag
                    ? "bg-zinc-800 text-white border-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-200"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50",
                ].join(" ")}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        총 <span className="font-medium text-foreground">{filtered.length}</span>개
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="해당하는 해커톤이 없습니다"
          description="필터를 조정해 보세요."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h, i) => (
            <HackathonCard key={h.slug} hackathon={h} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
