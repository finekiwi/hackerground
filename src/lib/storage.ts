import type { Hackathon, HackathonDetail, Team, Leaderboard, SubmissionRecord, ScoreHistoryPoint, ScoreHistory } from "@/lib/types";
import hackathonsData from "@/lib/data/hackathons.json";
import hackathonDetailsData from "@/lib/data/hackathon_details.json";
import teamsData from "@/lib/data/teams.json";
import leaderboardsData from "@/lib/data/leaderboards.json";
import scoreHistoryData from "@/lib/data/score_history.json";

// Bump this when seed data for hackathons / hackathon_details / leaderboards / score_history changes.
// Teams and submissions are user-generated and are NOT reset on version bump.
const SEED_VERSION = "2";
const KEYS = {
  seedVersion: "hg:seed_version",
  hackathons: "hg:hackathons",
  hackathonDetails: "hg:hackathon_details",
  teams: "hg:teams",
  leaderboards: "hg:leaderboards",
  submissions: "hg:submissions",
  scoreHistory: "hg:score_history",
} as const;

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initStorage(): void {
  if (typeof window === "undefined") return;

  const storedVersion = localStorage.getItem(KEYS.seedVersion);

  if (storedVersion !== SEED_VERSION) {
    // Seed data changed — refresh read-only collections only
    localStorage.setItem(KEYS.hackathons, JSON.stringify(hackathonsData));
    localStorage.setItem(KEYS.hackathonDetails, JSON.stringify(hackathonDetailsData));
    localStorage.setItem(KEYS.leaderboards, JSON.stringify(leaderboardsData));
    localStorage.setItem(KEYS.scoreHistory, JSON.stringify(scoreHistoryData));
    localStorage.setItem(KEYS.seedVersion, SEED_VERSION);
  }

  // User-generated data: initialize only when absent
  if (!localStorage.getItem(KEYS.teams)) {
    localStorage.setItem(KEYS.teams, JSON.stringify(teamsData));
  }
  if (!localStorage.getItem(KEYS.submissions)) {
    localStorage.setItem(KEYS.submissions, JSON.stringify([]));
  }
  // Backfill: recover if hg:score_history is missing despite seed_version=2
  if (!localStorage.getItem(KEYS.scoreHistory)) {
    localStorage.setItem(KEYS.scoreHistory, JSON.stringify(scoreHistoryData));
  }
}

function getItem<T>(key: string): T {
  if (typeof window === "undefined") return [] as unknown as T;
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : ([] as unknown as T);
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Hackathons ───────────────────────────────────────────────────────────────

export function getHackathons(): Hackathon[] {
  return getItem<Hackathon[]>(KEYS.hackathons);
}

export function getHackathon(slug: string): Hackathon | undefined {
  return getHackathons().find((h) => h.slug === slug);
}

// ─── Hackathon Details ────────────────────────────────────────────────────────

export function getHackathonDetails(): HackathonDetail[] {
  return getItem<HackathonDetail[]>(KEYS.hackathonDetails);
}

export function getHackathonDetail(slug: string): HackathonDetail | undefined {
  return getHackathonDetails().find((d) => d.slug === slug);
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export function getTeams(hackathonSlug?: string): Team[] {
  const teams = getItem<Team[]>(KEYS.teams);
  if (hackathonSlug) return teams.filter((t) => t.hackathonSlug === hackathonSlug);
  return teams;
}

export function getTeam(teamCode: string): Team | undefined {
  return getTeams().find((t) => t.teamCode === teamCode);
}

export function createTeam(team: Omit<Team, "teamCode" | "createdAt">): Team {
  const teams = getTeams();
  const newTeam: Team = {
    ...team,
    teamCode: `T-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  setItem(KEYS.teams, [...teams, newTeam]);
  return newTeam;
}

export function updateTeam(teamCode: string, updates: Partial<Team>): Team | null {
  const teams = getTeams();
  const idx = teams.findIndex((t) => t.teamCode === teamCode);
  if (idx === -1) return null;
  const updated = { ...teams[idx], ...updates };
  teams[idx] = updated;
  setItem(KEYS.teams, teams);
  return updated;
}

export function deleteTeam(teamCode: string): boolean {
  const teams = getTeams();
  const filtered = teams.filter((t) => t.teamCode !== teamCode);
  if (filtered.length === teams.length) return false;
  setItem(KEYS.teams, filtered);
  return true;
}

// ─── Leaderboards ─────────────────────────────────────────────────────────────

export function getLeaderboards(): Leaderboard[] {
  return getItem<Leaderboard[]>(KEYS.leaderboards);
}

export function getLeaderboard(hackathonSlug: string): Leaderboard | undefined {
  return getLeaderboards().find((l) => l.hackathonSlug === hackathonSlug);
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export function getSubmissions(hackathonSlug?: string): SubmissionRecord[] {
  const submissions = getItem<SubmissionRecord[]>(KEYS.submissions);
  if (hackathonSlug) return submissions.filter((s) => s.hackathonSlug === hackathonSlug);
  return submissions;
}

export function addSubmission(
  submission: Omit<SubmissionRecord, "id" | "submittedAt">
): SubmissionRecord {
  const now = new Date().toISOString();
  const newSubmission: SubmissionRecord = {
    ...submission,
    id: `sub-${Date.now()}`,
    submittedAt: now,
  };

  // Persist submission record
  setItem(KEYS.submissions, [...getSubmissions(), newSubmission]);

  // Add a pending (unranked) entry to the leaderboard
  const leaderboards = getLeaderboards();
  const lbIdx = leaderboards.findIndex((l) => l.hackathonSlug === submission.hackathonSlug);
  if (lbIdx !== -1) {
    const alreadyExists = leaderboards[lbIdx].entries.some(
      (e) => e.teamName === submission.teamName
    );
    if (!alreadyExists) {
      leaderboards[lbIdx].entries.push({
        rank: null,
        teamName: submission.teamName,
        score: null,
        submittedAt: now,
      });
      setItem(KEYS.leaderboards, leaderboards);
    }
  }

  return newSubmission;
}

export function getMySubmission(
  hackathonSlug: string,
  teamName: string
): SubmissionRecord | undefined {
  return getSubmissions(hackathonSlug).find((s) => s.teamName === teamName);
}

export function updateSubmission(
  id: string,
  updates: Partial<SubmissionRecord>
): SubmissionRecord | null {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated = { ...submissions[idx], ...updates };
  submissions[idx] = updated;
  setItem(KEYS.submissions, submissions);
  return updated;
}

// ─── Score History ─────────────────────────────────────────────────────────────

export function getScoreHistory(hackathonSlug: string): ScoreHistoryPoint[] {
  const all = getItem<ScoreHistory[]>(KEYS.scoreHistory);
  return all.find((h) => h.hackathonSlug === hackathonSlug)?.points ?? [];
}

// Called when a leaderboard score is confirmed (not at submission time,
// since addSubmission creates a score=null pending entry).
// P2 will wire this up when scores are finalized.
export function addScoreHistoryPoint(
  hackathonSlug: string,
  point: ScoreHistoryPoint
): void {
  const all = getItem<ScoreHistory[]>(KEYS.scoreHistory);
  const idx = all.findIndex((h) => h.hackathonSlug === hackathonSlug);
  if (idx !== -1) {
    all[idx].points.push(point);
  } else {
    all.push({ hackathonSlug, points: [point] });
  }
  setItem(KEYS.scoreHistory, all);
}
