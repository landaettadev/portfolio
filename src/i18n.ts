import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
};

const STORAGE_KEY = 'lang';

/** Saved choice first, then the browser language; Spanish-speaking visitors get Spanish. */
const detect = (): 'es' | 'en' => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.languages?.[0] ?? navigator.language : 'en';
  return nav?.toLowerCase().startsWith('es') ? 'es' : 'en';
};

const syncDocument = (lng: string) => {
  const lang = lng.startsWith('es') ? 'es' : 'en';
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: detect(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

syncDocument(i18n.language);
i18n.on('languageChanged', syncDocument);

export default i18n;
