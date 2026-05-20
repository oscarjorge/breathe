import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import es from './es.json';
import en from './en.json';

const deviceLang = getLocales()[0]?.languageCode ?? 'en';
const initialLang = deviceLang.startsWith('es') ? 'es' : 'en';

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
  react: { useSuspense: false },
});

export default i18n;

export function setLanguage(lang: 'es' | 'en') {
  i18n.changeLanguage(lang);
}
