"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addSubmission, getMySubmission } from "@/lib/storage"
import type { HackathonDetail } from "@/lib/types"

interface TabSubmitProps {
  detail: HackathonDetail
}

export function TabSubmit({ detail }: TabSubmitProps) {
  const { submit } = detail.sections
  const items = submit.submissionItems ?? []

  const [teamName, setTeamName] = useState("")
  const [values, setValues] = useState<Record<string, string>>({})
  // For text_or_url items: mode per item key ("text" | "url")
  const [modes, setModes] = useState<Record<string, "text" | "url">>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function getMode(key: string): "text" | "url" {
    return modes[key] ?? "text"
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!teamName.trim()) {
      setError("팀 이름을 입력해주세요.")
      return
    }

    const existing = getMySubmission(detail.slug, teamName.trim())
    if (existing) {
      setError("이미 제출한 팀 이름입니다.")
      return
    }

    const artifacts: Record<string, string> = {}
    for (const item of items) {
      const val = values[item.key]?.trim()
      if (val) artifacts[item.key] = val
    }

    addSubmission({ hackathonSlug: detail.slug, teamName: teamName.trim(), artifacts })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center space-y-2">
        <p className="text-lg font-semibold">제출 완료 🎉</p>
        <p className="text-sm text-muted-foreground">리더보드에 반영 중입니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">제출 가이드</h3>
        <ul className="space-y-1.5">
          {submit.guide.map((g, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">팀 이름 *</label>
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="등록한 팀 이름을 입력하세요"
          />
        </div>

        {items.map((item) => {
          const format = item.format
          const isTextOrUrl = format === "text_or_url"
          const mode = getMode(item.key)
          const effectiveFormat = isTextOrUrl ? mode : format

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{item.title}</label>
                {isTextOrUrl && (
                  <div className="flex rounded-md border overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setModes((p) => ({ ...p, [item.key]: "text" }))}
                      className={[
                        "px-2 py-1 transition-colors",
                        mode === "text"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      텍스트
                    </button>
                    <button
                      type="button"
                      onClick={() => setModes((p) => ({ ...p, [item.key]: "url" }))}
                      className={[
                        "px-2 py-1 transition-colors",
                        mode === "url"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      URL
                    </button>
                  </div>
                )}
              </div>

              {effectiveFormat === "text" ? (
                <Textarea
                  rows={4}
                  value={values[item.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [item.key]: e.target.value }))}
                  placeholder="내용을 입력하세요"
                />
              ) : (
                <Input
                  type="url"
                  value={values[item.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [item.key]: e.target.value }))}
                  placeholder={format === "pdf_url" ? "PDF URL을 입력하세요" : "URL을 입력하세요"}
                />
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full">
        제출하기
      </Button>
    </form>
  )
}
