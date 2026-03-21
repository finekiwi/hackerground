"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createTeam } from "@/lib/storage"
import type { Hackathon, Team } from "@/lib/types"

interface CreateTeamDialogProps {
  hackathons: Hackathon[]
  defaultSlug?: string
  onCreated: (team: Team) => void
}

interface FormErrors {
  name?: string
  intro?: string
  hackathonSlug?: string
}

export function CreateTeamDialog({ hackathons, defaultSlug, onCreated }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [intro, setIntro] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [memberCount, setMemberCount] = useState("1")
  const [lookingFor, setLookingFor] = useState("")
  const [hackathonSlug, setHackathonSlug] = useState(defaultSlug ?? "")
  const [contactUrl, setContactUrl] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  function resetForm() {
    setName("")
    setIntro("")
    setIsOpen(true)
    setMemberCount("1")
    setLookingFor("")
    setHackathonSlug(defaultSlug ?? "")
    setContactUrl("")
    setErrors({})
  }

  function handleSubmit() {
    const newErrors: FormErrors = {}
    if (!name.trim()) newErrors.name = "팀 이름을 입력해 주세요"
    if (!intro.trim()) newErrors.intro = "팀 소개를 입력해 주세요"
    if (!hackathonSlug) newErrors.hackathonSlug = "해커톤을 선택해 주세요"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const parsedCount = parseInt(memberCount, 10)
    const team = createTeam({
      hackathonSlug,
      name: name.trim(),
      isOpen,
      memberCount: isNaN(parsedCount) ? 1 : parsedCount,
      lookingFor: lookingFor
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      intro: intro.trim(),
      contact: { type: "link", url: contactUrl.trim() || undefined },
    })

    onCreated(team)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button>팀 등록하기</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 팀 등록</DialogTitle>
          <DialogDescription>팀 정보를 입력하고 등록하세요.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="team-name" className="text-sm font-medium">팀 이름</label>
            <Input
              id="team-name"
              aria-label="팀 이름"
              aria-invalid={!!errors.name}
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })) }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Intro */}
          <div className="space-y-1">
            <label htmlFor="team-intro" className="text-sm font-medium">팀 소개</label>
            <Textarea
              id="team-intro"
              aria-label="팀 소개"
              aria-invalid={!!errors.intro}
              value={intro}
              onChange={(e) => { setIntro(e.target.value); setErrors((p) => ({ ...p, intro: undefined })) }}
            />
            {errors.intro && <p className="text-xs text-destructive">{errors.intro}</p>}
          </div>

          {/* isOpen */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="team-is-open"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="rounded border-input"
            />
            <label htmlFor="team-is-open" className="text-sm font-medium">모집 중</label>
          </div>

          {/* Member Count */}
          <div className="space-y-1">
            <label htmlFor="team-member-count" className="text-sm font-medium">현재 인원</label>
            <Input
              id="team-member-count"
              type="number"
              min={1}
              aria-label="현재 인원"
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
            />
          </div>

          {/* Looking For */}
          <div className="space-y-1">
            <label htmlFor="team-looking-for" className="text-sm font-medium">찾는 포지션</label>
            <Input
              id="team-looking-for"
              aria-label="찾는 포지션"
              placeholder="프론트엔드, 백엔드"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
            />
          </div>

          {/* Hackathon Select */}
          <div className="space-y-1">
            <label className="text-sm font-medium">해커톤 선택</label>
            <Select value={hackathonSlug} onValueChange={(v) => { setHackathonSlug(v); setErrors((p) => ({ ...p, hackathonSlug: undefined })) }}>
              <SelectTrigger aria-label="해커톤 선택" aria-invalid={!!errors.hackathonSlug}>
                <SelectValue placeholder="해커톤을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {hackathons.map((h) => (
                  <SelectItem key={h.slug} value={h.slug}>
                    {h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hackathonSlug && <p className="text-xs text-destructive">{errors.hackathonSlug}</p>}
          </div>

          {/* Contact URL */}
          <div className="space-y-1">
            <label htmlFor="team-contact-url" className="text-sm font-medium">연락 링크</label>
            <Input
              id="team-contact-url"
              aria-label="연락 링크"
              placeholder="오픈카톡/구글폼 URL"
              value={contactUrl}
              onChange={(e) => setContactUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>등록</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
