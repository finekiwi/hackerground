"use client"

import { formatCurrency } from "@/lib/format"
import type { HackathonDetail } from "@/lib/types"

interface TabPrizeProps {
  detail: HackathonDetail
}

const PLACE_LABELS: Record<string, string> = {
  "1st": "🥇 1위",
  "2nd": "🥈 2위",
  "3rd": "🥉 3위",
}

export function TabPrize({ detail }: TabPrizeProps) {
  const { prize } = detail.sections

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {prize.items.map((item) => (
          <div
            key={item.place}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <span className="font-medium">
              {PLACE_LABELS[item.place] ?? item.place}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(item.amountKRW)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        * 시상금은 세전 금액이며, 관련 세금은 수상자가 부담합니다.
      </p>
    </div>
  )
}
