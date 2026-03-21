"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { EmptyState } from "@/components/common/empty-state"
import { getScoreHistory } from "@/lib/storage"

const TEAM_COLORS = [
  "#60a5fa", // blue-400
  "#34d399", // emerald-400
  "#f472b6", // pink-400
  "#fb923c", // orange-400
  "#a78bfa", // violet-400
  "#facc15", // yellow-400
  "#22d3ee", // cyan-400
  "#f87171", // red-400
  "#4ade80", // green-400
  "#e879f9", // fuchsia-400
]

// Timestamps are rendered in the user's local timezone (new Date parses +09:00
// seed values into local time). This is intentional for a demo — organizers and
// reviewers in different timezones will see locally-adjusted times on the X-axis.
function formatTime(iso: string): string {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${mm}/${dd} ${hh}:${min}`
}

function calcDecimals(scores: number[]): number {
  return scores.reduce((max, score) => {
    const s = score.toString()
    // Guard against scientific notation (e.g. 1e-7) — indexOf(".") would be -1
    if (s.includes("e") || s.includes("E")) return Math.max(max, 4)
    const dot = s.indexOf(".")
    return dot === -1 ? max : Math.max(max, s.length - dot - 1)
  }, 0)
}

interface TrendChartProps {
  hackathonSlug: string
}

export function TrendChart({ hackathonSlug }: TrendChartProps) {
  const points = useMemo(() => getScoreHistory(hackathonSlug), [hackathonSlug])

  const teamNames = useMemo(
    () => [...new Set(points.map((p) => p.teamName))],
    [points]
  )

  const [activeTeams, setActiveTeams] = useState<Set<string>>(
    () => new Set(teamNames)
  )

  // Reset active teams when the hackathon changes (teamNames reference changes)
  useEffect(() => {
    setActiveTeams(new Set(teamNames))
  }, [teamNames])

  const decimals = useMemo(
    () => calcDecimals(points.map((p) => p.score)),
    [points]
  )

  // flat points → recharts data array
  // Each row corresponds to a unique timestamp; teams that didn't submit at that
  // exact time have undefined — connectNulls={true} connects across those gaps,
  // producing continuous trend lines between each team's actual submissions.
  const chartData = useMemo(() => {
    const allTimes = [...new Set(points.map((p) => p.submittedAt))].sort()
    const teamMap = new Map<string, Map<string, number>>()
    for (const name of teamNames) {
      teamMap.set(name, new Map())
    }
    for (const p of points) {
      teamMap.get(p.teamName)?.set(p.submittedAt, p.score)
    }
    return allTimes.map((t) => {
      const row: Record<string, string | number | undefined> = {
        time: formatTime(t),
      }
      for (const name of teamNames) {
        row[name] = teamMap.get(name)?.get(t)
      }
      return row
    })
  }, [points, teamNames])

  function toggleTeam(name: string) {
    setActiveTeams((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  if (points.length === 0) {
    return (
      <EmptyState
        title="점수 이력이 없습니다"
        description="제출 후 점수가 확정되면 그래프가 표시됩니다."
      />
    )
  }

  const allDeactivated = activeTeams.size === 0

  return (
    <div className="w-full space-y-3">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
            tickFormatter={(v: number) => v.toFixed(decimals)}
            width={decimals > 0 ? 60 : 40}
          />
          <Tooltip
            formatter={(value: unknown, name: string) => {
              const num = typeof value === "number" ? value : Number(value)
              return [num.toFixed(decimals), name]
            }}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              color: "hsl(var(--popover-foreground))",
              fontSize: 12,
            }}
          />
          {teamNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={TEAM_COLORS[i % TEAM_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls={true}
              strokeOpacity={activeTeams.has(name) ? 1 : 0.15}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Accessible team toggles — replaces recharts SVG legend which has no keyboard role */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="팀 표시 토글">
        {teamNames.map((name, i) => {
          const isActive = activeTeams.has(name)
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggleTeam(name)}
              aria-pressed={isActive}
              className={[
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-opacity",
                isActive ? "opacity-100" : "opacity-40",
              ].join(" ")}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: TEAM_COLORS[i % TEAM_COLORS.length] }}
                aria-hidden="true"
              />
              {name}
            </button>
          )
        })}
      </div>

      {allDeactivated && (
        <p className="text-center text-xs text-muted-foreground">
          팀을 선택하면 추이를 확인할 수 있습니다.
        </p>
      )}
    </div>
  )
}
