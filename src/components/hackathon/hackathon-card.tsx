"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/common/status-badge"
import { formatDate } from "@/lib/format"
import type { Hackathon } from "@/lib/types"

interface HackathonCardProps {
  hackathon: Hackathon
  index: number
}

export function HackathonCard({ hackathon, index }: HackathonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Link href={`/hackathons/${hackathon.slug}`} className="block group">
        <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {hackathon.title}
              </h3>
              <StatusBadge status={hackathon.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex flex-wrap gap-1">
              {hackathon.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>
                <span className="font-medium">제출 마감</span>{" "}
                {formatDate(hackathon.period.submissionDeadlineAt, false)}
              </p>
              <p>
                <span className="font-medium">대회 종료</span>{" "}
                {formatDate(hackathon.period.endAt, false)}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
