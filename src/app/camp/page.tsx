import { Suspense } from "react"
import type { Metadata } from "next"
import { TeamListClient } from "@/components/team/team-list-client"

export const metadata: Metadata = {
  title: "팀 모집 | Hackerground",
}

export default function CampPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">팀 모집</h1>
        <p className="text-muted-foreground mt-1">해커톤 팀을 찾거나 등록하세요.</p>
      </div>
      <Suspense>
        <TeamListClient />
      </Suspense>
    </section>
  )
}
