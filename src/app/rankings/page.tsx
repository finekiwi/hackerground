import type { Metadata } from "next"
import { GlobalLeaderboardClient } from "@/components/leaderboard/global-leaderboard-client"

export const metadata: Metadata = {
  title: "랭킹 | Hackerground",
}

export default function RankingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">랭킹</h1>
        <p className="text-muted-foreground mt-1">전체 해커톤 리더보드를 확인하세요.</p>
      </div>
      <GlobalLeaderboardClient />
    </section>
  )
}
