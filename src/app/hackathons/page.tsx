import { HackathonListClient } from "@/components/hackathon/hackathon-list-client"

export const metadata = {
  title: "해커톤 목록 | Hackerground",
  description: "Dacon 해커톤 전체 목록",
}

export default function HackathonsPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">해커톤</h1>
        <p className="mt-2 text-muted-foreground">진행 중이거나 예정된 해커톤을 확인하세요.</p>
      </div>
      <HackathonListClient />
    </main>
  )
}
