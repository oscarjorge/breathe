import { UserData } from '@/store/types';

export type LiveStats = {
  msElapsed: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  moneySaved: number;
  cigarettesAvoided: number;
};

export function computeStats(data: UserData, now: number = Date.now()): LiveStats {
  const start = new Date(data.quitDate).getTime();
  const msElapsed = Math.max(0, now - start);

  const sec = Math.floor(msElapsed / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const pricePerCigarette = data.pricePerPack / data.cigarettesPerPack;
  const cigarettesAvoided = (data.cigarettesPerDay * msElapsed) / (24 * 60 * 60 * 1000);
  const moneySaved = cigarettesAvoided * pricePerCigarette;

  return { msElapsed, days, hours, minutes, seconds, moneySaved, cigarettesAvoided };
}
