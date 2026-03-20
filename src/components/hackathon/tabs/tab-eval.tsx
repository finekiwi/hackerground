"use client"

import { Badge } from "@/components/ui/badge"
import type { HackathonDetail } from "@/lib/types"

interface TabEvalProps {
  detail: HackathonDetail
}

export function TabEval({ detail }: TabEvalProps) {
  const { eval: evalSection } = detail.sections

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-1">평가 지표</h3>
        <Badge variant="secondary" className="font-mono">
          {evalSection.metricName}
        </Badge>
      </div>

      <div>
        <h3 className="font-semibold mb-2">평가 방식</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{evalSection.description}</p>
      </div>

      {evalSection.scoreDisplay && (
        <div>
          <h3 className="font-semibold mb-2">{evalSection.scoreDisplay.label}</h3>
          {evalSection.scoreDisplay.breakdown && (
            <div className="space-y-2">
              {evalSection.scoreDisplay.breakdown.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <span className="text-sm w-20 text-muted-foreground">{item.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${item.weightPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">
                    {item.weightPercent}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {evalSection.limits && (
        <div>
          <h3 className="font-semibold mb-2">제한사항</h3>
          <div className="grid grid-cols-2 gap-3">
            {evalSection.limits.maxRuntimeSec !== undefined && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">최대 실행 시간</p>
                <p className="text-lg font-semibold mt-0.5">
                  {evalSection.limits.maxRuntimeSec}
                  <span className="text-sm font-normal text-muted-foreground ml-1">초</span>
                </p>
              </div>
            )}
            {evalSection.limits.maxSubmissionsPerDay !== undefined && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">일일 제출 한도</p>
                <p className="text-lg font-semibold mt-0.5">
                  {evalSection.limits.maxSubmissionsPerDay}
                  <span className="text-sm font-normal text-muted-foreground ml-1">회</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
