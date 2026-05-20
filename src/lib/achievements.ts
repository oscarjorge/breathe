export type AchievementCategory = 'health' | 'streak' | 'money' | 'cigarettes';

export type Achievement = {
  id: string;
  category: AchievementCategory;
  icon: string;
  thresholdMs: number;
  labelKey: string;
  descriptionKey: string;
};

const H = 60 * 60 * 1000;
const D = 24 * H;
const M = 30 * D;
const Y = 365 * D;

export const ACHIEVEMENTS: Achievement[] = [
  // Health milestones
  { id: 'h_20min',    category: 'health',     icon: '❤️',  thresholdMs: 20 * 60 * 1000, labelKey: 'ach.h_20min.label',    descriptionKey: 'ach.h_20min.desc' },
  { id: 'h_8h',       category: 'health',     icon: '🩸',  thresholdMs: 8 * H,           labelKey: 'ach.h_8h.label',       descriptionKey: 'ach.h_8h.desc' },
  { id: 'h_12h',      category: 'health',     icon: '🫁',  thresholdMs: 12 * H,          labelKey: 'ach.h_12h.label',      descriptionKey: 'ach.h_12h.desc' },
  { id: 'h_24h',      category: 'health',     icon: '💙',  thresholdMs: 24 * H,          labelKey: 'ach.h_24h.label',      descriptionKey: 'ach.h_24h.desc' },
  { id: 'h_48h',      category: 'health',     icon: '👃',  thresholdMs: 48 * H,          labelKey: 'ach.h_48h.label',      descriptionKey: 'ach.h_48h.desc' },
  { id: 'h_72h',      category: 'health',     icon: '🌬️', thresholdMs: 72 * H,          labelKey: 'ach.h_72h.label',      descriptionKey: 'ach.h_72h.desc' },
  { id: 'h_2w',       category: 'health',     icon: '🚴',  thresholdMs: 14 * D,          labelKey: 'ach.h_2w.label',       descriptionKey: 'ach.h_2w.desc' },
  { id: 'h_1m',       category: 'health',     icon: '😮‍💨', thresholdMs: M,              labelKey: 'ach.h_1m.label',       descriptionKey: 'ach.h_1m.desc' },
  { id: 'h_3m',       category: 'health',     icon: '💪',  thresholdMs: 3 * M,           labelKey: 'ach.h_3m.label',       descriptionKey: 'ach.h_3m.desc' },
  { id: 'h_6m',       category: 'health',     icon: '🧘',  thresholdMs: 6 * M,           labelKey: 'ach.h_6m.label',       descriptionKey: 'ach.h_6m.desc' },
  { id: 'h_1y',       category: 'health',     icon: '🏆',  thresholdMs: Y,               labelKey: 'ach.h_1y.label',       descriptionKey: 'ach.h_1y.desc' },
  { id: 'h_5y',       category: 'health',     icon: '⭐',  thresholdMs: 5 * Y,           labelKey: 'ach.h_5y.label',       descriptionKey: 'ach.h_5y.desc' },

  // Streak milestones (same as health but labeled as streaks)
  { id: 's_1d',       category: 'streak',     icon: '1️⃣',  thresholdMs: D,               labelKey: 'ach.s_1d.label',       descriptionKey: 'ach.s_1d.desc' },
  { id: 's_3d',       category: 'streak',     icon: '3️⃣',  thresholdMs: 3 * D,           labelKey: 'ach.s_3d.label',       descriptionKey: 'ach.s_3d.desc' },
  { id: 's_7d',       category: 'streak',     icon: '📅',  thresholdMs: 7 * D,           labelKey: 'ach.s_7d.label',       descriptionKey: 'ach.s_7d.desc' },
  { id: 's_2w',       category: 'streak',     icon: '🗓️', thresholdMs: 14 * D,          labelKey: 'ach.s_2w.label',       descriptionKey: 'ach.s_2w.desc' },
  { id: 's_1m',       category: 'streak',     icon: '🌙',  thresholdMs: M,               labelKey: 'ach.s_1m.label',       descriptionKey: 'ach.s_1m.desc' },
  { id: 's_3m',       category: 'streak',     icon: '🌞',  thresholdMs: 3 * M,           labelKey: 'ach.s_3m.label',       descriptionKey: 'ach.s_3m.desc' },
  { id: 's_6m',       category: 'streak',     icon: '🎖️', thresholdMs: 6 * M,           labelKey: 'ach.s_6m.label',       descriptionKey: 'ach.s_6m.desc' },
  { id: 's_1y',       category: 'streak',     icon: '🎂',  thresholdMs: Y,               labelKey: 'ach.s_1y.label',       descriptionKey: 'ach.s_1y.desc' },

  // Money saved (threshold in euros stored separately — we map by index)
  { id: 'm_1',        category: 'money',      icon: '💶',  thresholdMs: 0,               labelKey: 'ach.m_1.label',        descriptionKey: 'ach.m_1.desc' },
  { id: 'm_10',       category: 'money',      icon: '💰',  thresholdMs: 0,               labelKey: 'ach.m_10.label',       descriptionKey: 'ach.m_10.desc' },
  { id: 'm_50',       category: 'money',      icon: '🛍️', thresholdMs: 0,               labelKey: 'ach.m_50.label',       descriptionKey: 'ach.m_50.desc' },
  { id: 'm_100',      category: 'money',      icon: '✈️', thresholdMs: 0,               labelKey: 'ach.m_100.label',      descriptionKey: 'ach.m_100.desc' },
  { id: 'm_500',      category: 'money',      icon: '🏖️', thresholdMs: 0,               labelKey: 'ach.m_500.label',      descriptionKey: 'ach.m_500.desc' },
  { id: 'm_1000',     category: 'money',      icon: '🌍',  thresholdMs: 0,               labelKey: 'ach.m_1000.label',     descriptionKey: 'ach.m_1000.desc' },

  // Cigarettes avoided
  { id: 'c_10',       category: 'cigarettes', icon: '🚭',  thresholdMs: 0,               labelKey: 'ach.c_10.label',       descriptionKey: 'ach.c_10.desc' },
  { id: 'c_100',      category: 'cigarettes', icon: '💨',  thresholdMs: 0,               labelKey: 'ach.c_100.label',      descriptionKey: 'ach.c_100.desc' },
  { id: 'c_500',      category: 'cigarettes', icon: '🌿',  thresholdMs: 0,               labelKey: 'ach.c_500.label',      descriptionKey: 'ach.c_500.desc' },
  { id: 'c_1000',     category: 'cigarettes', icon: '🌳',  thresholdMs: 0,               labelKey: 'ach.c_1000.label',     descriptionKey: 'ach.c_1000.desc' },
  { id: 'c_5000',     category: 'cigarettes', icon: '🌲',  thresholdMs: 0,               labelKey: 'ach.c_5000.label',     descriptionKey: 'ach.c_5000.desc' },
];

// Money thresholds in currency units
export const MONEY_THRESHOLDS: Record<string, number> = {
  m_1: 1, m_10: 10, m_50: 50, m_100: 100, m_500: 500, m_1000: 1000,
};

// Cigarette thresholds
export const CIG_THRESHOLDS: Record<string, number> = {
  c_10: 10, c_100: 100, c_500: 500, c_1000: 1000, c_5000: 5000,
};

export function isUnlocked(
  ach: Achievement,
  msElapsed: number,
  moneySaved: number,
  cigarettesAvoided: number,
): boolean {
  if (ach.category === 'health' || ach.category === 'streak') {
    return msElapsed >= ach.thresholdMs;
  }
  if (ach.category === 'money') {
    return moneySaved >= (MONEY_THRESHOLDS[ach.id] ?? Infinity);
  }
  if (ach.category === 'cigarettes') {
    return cigarettesAvoided >= (CIG_THRESHOLDS[ach.id] ?? Infinity);
  }
  return false;
}

export function unlockedCount(msElapsed: number, moneySaved: number, cigarettesAvoided: number): number {
  return ACHIEVEMENTS.filter((a) => isUnlocked(a, msElapsed, moneySaved, cigarettesAvoided)).length;
}
