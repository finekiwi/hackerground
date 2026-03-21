// ─── Date ─────────────────────────────────────────────────────────────────────

const KO_DATE_FORMAT = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const KO_DATE_ONLY_FORMAT = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDate(iso: string, includeTime = true): string {
  const d = new Date(iso);
  return includeTime ? KO_DATE_FORMAT.format(d) : KO_DATE_ONLY_FORMAT.format(d);
}

export function isDatePast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

// ─── Currency ─────────────────────────────────────────────────────────────────

const KO_CURRENCY_FORMAT = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

export function formatCurrency(amountKRW: number): string {
  return KO_CURRENCY_FORMAT.format(amountKRW);
}

// ─── Milestone state ──────────────────────────────────────────────────────────

export type MilestoneState = "done" | "active" | "upcoming"

/**
 * Returns the state of a milestone given ordered milestone timestamps.
 * The "active" milestone is the first one that hasn't passed yet.
 * All preceding milestones are "done"; all following are "upcoming".
 */
export function getMilestoneState(
  milestones: Array<{ at: string }>,
  index: number
): MilestoneState {
  const now = Date.now()
  const activeIdx = milestones.findIndex((m) => new Date(m.at).getTime() > now)

  if (activeIdx === -1) {
    // All milestones have passed
    return "done"
  }
  if (index < activeIdx) return "done"
  if (index === activeIdx) return "active"
  return "upcoming"
}
