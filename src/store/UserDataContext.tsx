import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { loadUserData, saveUserData, clearUserData } from './storage';
import { UserData, defaultUserData } from './types';

type Ctx = {
  ready: boolean;
  data: UserData | null;
  setData: (data: UserData) => Promise<void>;
  update: (patch: Partial<UserData>) => Promise<void>;
  reset: () => Promise<void>;
  relapse: (reason?: string) => Promise<void>;
};

const UserDataContext = createContext<Ctx | null>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setDataState] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData().then((d) => {
      setDataState(d);
      setReady(true);
    });
  }, []);

  const setData = useCallback(async (next: UserData) => {
    setDataState(next);
    await saveUserData(next);
  }, []);

  const update = useCallback(
    async (patch: Partial<UserData>) => {
      if (!data) return;
      const next = { ...data, ...patch };
      setDataState(next);
      await saveUserData(next);
    },
    [data],
  );

  const reset = useCallback(async () => {
    await clearUserData();
    setDataState(null);
  }, []);

  const relapse = useCallback(
    async (reason?: string) => {
      if (!data) return;
      const now = new Date();
      const startedAt = data.quitDate;
      const endedAt = now.toISOString();
      const durationMs = now.getTime() - new Date(startedAt).getTime();
      const next: UserData = {
        ...data,
        quitDate: endedAt,
        history: [...data.history, { startedAt, endedAt, durationMs, reason }],
      };
      setDataState(next);
      await saveUserData(next);
    },
    [data],
  );

  const value = useMemo<Ctx>(
    () => ({ ready, data, setData, update, reset, relapse }),
    [ready, data, setData, update, reset, relapse],
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export function useUserData(): Ctx {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used inside UserDataProvider');
  return ctx;
}

export { defaultUserData };
