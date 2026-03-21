"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import type { Team } from "@/lib/types"

interface TeamCardProps {
  team: Team
  hackathonTitle?: string
  index: number
}

export function TeamCard({ team, hackathonTitle, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card className="h-full border-border/60" data-testid="team-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-snug">{team.name}</h3>
            <Badge variant={team.isOpen ? "default" : "secondary"} className="shrink-0">
              {team.isOpen ? "모집 중" : "마감"}
            </Badge>
          </div>
          {hackathonTitle && (
            <p className="text-xs text-muted-foreground">{hackathonTitle}</p>
          )}
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{team.intro}</p>
          {team.lookingFor.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {team.lookingFor.map((role) => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{team.memberCount}명 · {formatDate(team.createdAt, false)}</span>
            {team.contact.url && (
              <a
                href={team.contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                지원하기
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
