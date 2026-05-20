export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export type UserData = {
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  currency: CurrencyCode;
  quitDate: string; // ISO
  goal?: {
    title: string;
    amount: number;
    imageKey: string; // key into predefined gallery
  };
  notifications: {
    enabled: boolean;
    hour: number; // 0-23
    minute: number; // 0-59
  };
  history: Array<{
    startedAt: string; // ISO
    endedAt: string; // ISO
    durationMs: number;
    reason?: string;
  }>;
  language?: 'es' | 'en';
};

export const defaultUserData: Omit<UserData, 'cigarettesPerDay' | 'pricePerPack' | 'quitDate'> = {
  cigarettesPerPack: 20,
  currency: 'EUR',
  notifications: { enabled: false, hour: 9, minute: 0 },
  history: [],
};
