import { describe, test, expect } from 'vitest';
import {
  initStorage,
  getHackathons,
  getHackathon,
  getHackathonDetail,
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getLeaderboard,
  addSubmission,
  getMySubmission,
  updateSubmission,
  getSubmissions,
} from '@/lib/storage';

// ─── initStorage ──────────────────────────────────────────────────────────────

describe('initStorage', () => {
  test('seeds all keys on first call', () => {
    initStorage();
    expect(localStorage.getItem('hg:hackathons')).not.toBeNull();
    expect(localStorage.getItem('hg:hackathon_details')).not.toBeNull();
    expect(localStorage.getItem('hg:teams')).not.toBeNull();
    expect(localStorage.getItem('hg:leaderboards')).not.toBeNull();
    expect(localStorage.getItem('hg:submissions')).not.toBeNull();
  });

  test('does not overwrite existing data on subsequent calls', () => {
    initStorage();
    localStorage.setItem('hg:hackathons', JSON.stringify([{ slug: 'custom' }]));
    initStorage();
    const hackathons = JSON.parse(localStorage.getItem('hg:hackathons')!);
    expect(hackathons[0].slug).toBe('custom');
  });
});

// ─── Hackathons ────────────────────────────────────────────────────────────────

describe('getHackathons', () => {
  test('returns seeded hackathons', () => {
    initStorage();
    const list = getHackathons();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('slug');
  });
});

describe('getHackathon', () => {
  test('returns hackathon by slug', () => {
    initStorage();
    const slug = getHackathons()[0].slug;
    expect(getHackathon(slug)?.slug).toBe(slug);
  });

  test('returns undefined for unknown slug', () => {
    initStorage();
    expect(getHackathon('nonexistent')).toBeUndefined();
  });
});

describe('getHackathonDetail', () => {
  test('returns detail by slug', () => {
    initStorage();
    const hackathons = getHackathons();
    // Find a slug that has a detail
    const detail = hackathons.map((h) => getHackathonDetail(h.slug)).find(Boolean);
    expect(detail).toBeDefined();
    expect(detail).toHaveProperty('slug');
  });

  test('returns undefined for slug with no detail', () => {
    initStorage();
    expect(getHackathonDetail('no-detail-slug')).toBeUndefined();
  });
});

// ─── Teams ────────────────────────────────────────────────────────────────────

describe('getTeams', () => {
  test('returns all seeded teams', () => {
    initStorage();
    expect(getTeams().length).toBeGreaterThan(0);
  });

  test('filters by hackathonSlug', () => {
    initStorage();
    const all = getTeams();
    const slug = all[0].hackathonSlug;
    const filtered = getTeams(slug);
    expect(filtered.every((t) => t.hackathonSlug === slug)).toBe(true);
    expect(filtered.length).toBeLessThanOrEqual(all.length);
  });

  test('returns empty array for unknown hackathonSlug', () => {
    initStorage();
    expect(getTeams('no-such-hackathon')).toHaveLength(0);
  });
});

describe('createTeam', () => {
  test('creates a team and persists it', () => {
    initStorage();
    const before = getTeams().length;
    const team = createTeam({
      name: 'Alpha',
      hackathonSlug: 'test-hack',
      intro: 'We build.',
      isOpen: true,
      positions: ['Frontend'],
      contactLink: 'https://example.com',
    });
    expect(team.teamCode).toMatch(/^T-/);
    expect(team.createdAt).toBeTruthy();
    expect(getTeams()).toHaveLength(before + 1);
  });

  test('newly created team is retrievable by teamCode', () => {
    initStorage();
    const team = createTeam({
      name: 'Beta',
      hackathonSlug: 'test-hack',
      intro: 'We ship.',
      isOpen: false,
      positions: [],
      contactLink: '',
    });
    expect(getTeam(team.teamCode)?.name).toBe('Beta');
  });
});

describe('updateTeam', () => {
  test('updates existing team fields', () => {
    initStorage();
    const team = createTeam({ name: 'Gamma', hackathonSlug: 'h1', intro: 'Old', isOpen: true, positions: [], contactLink: '' });
    const updated = updateTeam(team.teamCode, { intro: 'New intro', isOpen: false });
    expect(updated?.intro).toBe('New intro');
    expect(updated?.isOpen).toBe(false);
    expect(getTeam(team.teamCode)?.intro).toBe('New intro');
  });

  test('returns null for unknown teamCode', () => {
    initStorage();
    expect(updateTeam('NONEXISTENT', { name: 'X' })).toBeNull();
  });
});

describe('deleteTeam', () => {
  test('removes team from storage', () => {
    initStorage();
    const team = createTeam({ name: 'ToDelete', hackathonSlug: 'h1', intro: '', isOpen: true, positions: [], contactLink: '' });
    expect(deleteTeam(team.teamCode)).toBe(true);
    expect(getTeam(team.teamCode)).toBeUndefined();
  });

  test('returns false for unknown teamCode', () => {
    initStorage();
    expect(deleteTeam('NONEXISTENT')).toBe(false);
  });
});

// ─── Leaderboards ─────────────────────────────────────────────────────────────

describe('getLeaderboard', () => {
  test('returns leaderboard by hackathonSlug', () => {
    initStorage();
    const boards = JSON.parse(localStorage.getItem('hg:leaderboards')!);
    const slug = boards[0].hackathonSlug;
    expect(getLeaderboard(slug)?.hackathonSlug).toBe(slug);
  });

  test('returns undefined for unknown slug', () => {
    initStorage();
    expect(getLeaderboard('no-board')).toBeUndefined();
  });
});

// ─── Submissions ──────────────────────────────────────────────────────────────

describe('addSubmission', () => {
  test('creates a submission with generated id and timestamp', () => {
    initStorage();
    const sub = addSubmission({ hackathonSlug: 'h1', teamName: 'TeamX', artifacts: {} });
    expect(sub.id).toMatch(/^sub-/);
    expect(sub.submittedAt).toBeTruthy();
    expect(getSubmissions('h1')).toHaveLength(1);
  });
});

describe('getMySubmission', () => {
  test('returns submission by hackathonSlug and teamName', () => {
    initStorage();
    addSubmission({ hackathonSlug: 'h1', teamName: 'TeamA', artifacts: {} });
    expect(getMySubmission('h1', 'TeamA')).toBeDefined();
    expect(getMySubmission('h1', 'TeamB')).toBeUndefined();
  });
});

describe('updateSubmission', () => {
  test('updates submission fields', () => {
    initStorage();
    const sub = addSubmission({ hackathonSlug: 'h1', teamName: 'TeamC', artifacts: {} });
    const updated = updateSubmission(sub.id, { teamName: 'TeamC-renamed' });
    expect(updated?.teamName).toBe('TeamC-renamed');
  });

  test('returns null for unknown id', () => {
    initStorage();
    expect(updateSubmission('nonexistent', {})).toBeNull();
  });
});
