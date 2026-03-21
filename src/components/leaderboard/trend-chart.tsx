"use client"

import { useMemo, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

  const decimals = useMemo(
    () => calcDecimals(points.map((p) => p.score)),
    [points]
  )

  // flat points → recharts data array
  const chartData = useMemo(() => {
    const allTimes = [...new Set(points.map((p) => p.submittedAt))].sort()
    // teamName → (submittedAt → score)
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

  function handleLegendClick(teamName: string) {
    setActiveTeams((prev) => {
      const next = new Set(prev)
      if (next.has(teamName)) {
        next.delete(teamName)
      } else {
        next.add(teamName)
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

  return (
    <div className="w-full">
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
            formatter={(value: number, name: string) => [
              value.toFixed(decimals),
              name,
            ]}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              color: "hsl(var(--popover-foreground))",
              fontSize: 12,
            }}
          />
          <Legend
            onClick={(e) => handleLegendClick(e.value as string)}
            wrapperStyle={{ cursor: "pointer", fontSize: 12 }}
          />
          {teamNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={TEAM_COLORS[i % TEAM_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls={false}
              strokeOpacity={activeTeams.has(name) ? 1 : 0.15}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
