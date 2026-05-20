import { CurrencyCode } from '@/store/types';

const currencyLocaleMap: Record<CurrencyCode, string> = {
  EUR: 'es-ES',
  USD: 'en-US',
  GBP: 'en-GB',
};

export function formatMoney(amount: number, currency: CurrencyCode, locale?: string): string {
  const l = locale ?? currencyLocaleMap[currency];
  return new Intl.NumberFormat(l, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatInteger(value: number, locale: string = 'es-ES'): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.floor(value));
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
