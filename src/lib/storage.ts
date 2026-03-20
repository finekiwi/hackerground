import type { Hackathon, HackathonDetail, Team, Leaderboard, Submission } from "@/lib/types";
import hackathonsData from "@/lib/data/hackathons.json";
import hackathonDetailsData from "@/lib/data/hackathon_details.json";
import teamsData from "@/lib/data/teams.json";
import leaderboardsData from "@/lib/data/leaderboards.json";

const KEYS = {
  hackathons: "hg:hackathons",
  hackathonDetails: "hg:hackathon_details",
  teams: "hg:teams",
  leaderboards: "hg:leaderboards",
  submissions: "hg:submissions",
} as const;

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initStorage(): void {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(KEYS.hackathons)) {
    localStorage.setItem(KEYS.hackathons, JSON.stringify(hackathonsData));
  }
  if (!localStorage.getItem(KEYS.hackathonDetails)) {
    localStorage.setItem(KEYS.hackathonDetails, JSON.stringify(hackathonDetailsData));
  }
  if (!localStorage.getItem(KEYS.teams)) {
    localStorage.setItem(KEYS.teams, JSON.stringify(teamsData));
  }
  if (!localStorage.getItem(KEYS.leaderboards)) {
    localStorage.setItem(KEYS.leaderboards, JSON.stringify(leaderboardsData));
  }
  if (!localStorage.getItem(KEYS.submissions)) {
    localStorage.setItem(KEYS.submissions, JSON.stringify([]));
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

export function getSubmissions(hackathonSlug?: string): Submission[] {
  const submissions = getItem<Submission[]>(KEYS.submissions);
  if (hackathonSlug) return submissions.filter((s) => s.hackathonSlug === hackathonSlug);
  return submissions;
}

export function addSubmission(submission: Omit<Submission, "id" | "submittedAt">): Submission {
  const submissions = getSubmissions();
  const newSubmission: Submission = {
    ...submission,
    id: `sub-${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  setItem(KEYS.submissions, [...submissions, newSubmission]);
  return newSubmission;
}

export function getMySubmission(hackathonSlug: string, teamName: string): Submission | undefined {
  return getSubmissions(hackathonSlug).find((s) => s.teamName === teamName);
}

export function updateSubmission(id: string, updates: Partial<Submission>): Submission | null {
  const submissions = getSubmissions();
  const idx = submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated = { ...submissions[idx], ...updates };
  submissions[idx] = updated;
  setItem(KEYS.submissions, submissions);
  return updated;
}
