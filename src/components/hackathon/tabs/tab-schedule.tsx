"use client"

import { formatDate, getMilestoneState } from "@/lib/format"
import type { HackathonDetail } from "@/lib/types"

interface TabScheduleProps {
  detail: HackathonDetail
}

export function TabSchedule({ detail }: TabScheduleProps) {
  const { schedule } = detail.sections
  const milestones = schedule.milestones

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">기준 시간대: {schedule.timezone}</p>
      <ol className="relative border-l border-border ml-2 space-y-0">
        {milestones.map((m, i) => {
          const state = getMilestoneState(milestones, i)
          return (
            <li key={i} className="ml-6 pb-6 last:pb-0">
              {/* Dot */}
              <span
                className={[
                  "absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2",
                  state === "done"
                    ? "border-muted-foreground bg-muted-foreground"
                    : state === "active"
                      ? "border-primary bg-primary"
                      : "border-border bg-background",
                ].join(" ")}
              />
              <div className="space-y-0.5">
                <p
                  className={[
                    "text-sm font-medium",
                    state === "upcoming" ? "text-muted-foreground" : "text-foreground",
                  ].join(" ")}
                >
                  {m.name}
                  {state === "active" && (
                    <span className="ml-2 text-xs font-normal text-primary">← 현재</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(m.at)}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
