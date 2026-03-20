import { HackathonDetailClient } from "@/components/hackathon/hackathon-detail-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return {
    title: `해커톤 상세 | Hackerground`,
    description: `${slug} 해커톤 상세 정보`,
  }
}

export default async function HackathonDetailPage({ params }: Props) {
  const { slug } = await params
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <HackathonDetailClient slug={slug} />
    </main>
  )
}
