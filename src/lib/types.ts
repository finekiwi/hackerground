// ─── Hackathon List ──────────────────────────────────────────────────────────

export type HackathonStatus = "ongoing" | "upcoming" | "ended"

export interface Hackathon {
  slug: string
  title: string
  status: HackathonStatus
  tags: string[]
  thumbnailUrl: string
  period: {
    timezone: string
    submissionDeadlineAt: string
    endAt: string
  }
  links: {
    detail: string
    rules: string
    faq: string
  }
}

// ─── Hackathon Detail ─────────────────────────────────────────────────────────

export interface ScoreBreakdownItem {
  key: string
  label: string
  weightPercent: number
}

export interface HackathonDetail {
  slug: string
  title: string
  sections: {
    overview: {
      summary: string
      teamPolicy: {
        allowSolo: boolean
        maxTeamSize: number
      }
    }
    info: {
      notice: string[]
      links: {
        rules: string
        faq: string
      }
    }
    eval: {
      metricName: string
      description: string
      scoreSource?: "vote" | "leaderboard"
      scoreDisplay?: {
        label: string
        breakdown?: ScoreBreakdownItem[]
      }
      limits?: {
        maxRuntimeSec?: number
        maxSubmissionsPerDay?: number
      }
    }
    schedule: {
      timezone: string
      milestones: Array<{
        name: string
        at: string
      }>
    }
    prize: {
      items: Array<{
        place: string
        amountKRW: number
      }>
    }
    teams: {
      campEnabled: boolean
      listUrl: string
    }
    submit: {
      allowedArtifactTypes: string[]
      submissionUrl: string
      guide: string[]
      submissionItems?: Array<{
        key: string
        title: string
        format: "text" | "url" | "pdf_url" | "text_or_url"
      }>
    }
    leaderboard: {
      publicLeaderboardUrl: string
      note: string
    }
  }
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface Team {
  teamCode: string
  hackathonSlug: string
  name: string
  isOpen: boolean
  memberCount: number
  lookingFor: string[]
  intro: string
  contact: {
    type: "link" | "email"
    url?: string
    email?: string
  }
  createdAt: string
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export interface ArtifactLink {
  webUrl?: string
  pdfUrl?: string
  planTitle?: string
}

export interface LeaderboardEntry {
  rank: number | null
  teamName: string
  score: number | null
  submittedAt: string
  scoreBreakdown?: Record<string, number>
  artifacts?: ArtifactLink
}

export interface Leaderboard {
  hackathonSlug: string
  updatedAt: string
  entries: LeaderboardEntry[]
}

// ─── Score History ────────────────────────────────────────────────────────────

export interface ScoreHistoryPoint {
  teamName: string
  score: number
  submittedAt: string
}

export interface ScoreHistory {
  hackathonSlug: string
  points: ScoreHistoryPoint[]
}

// ─── Submission ───────────────────────────────────────────────────────────────

export interface SubmissionRecord {
  id: string
  hackathonSlug: string
  teamName: string
  submittedAt: string
  artifacts: Record<string, string>
}
