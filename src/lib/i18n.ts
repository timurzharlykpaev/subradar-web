import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import es from '@/locales/es.json';
import de from '@/locales/de.json';
import fr from '@/locales/fr.json';
import pt from '@/locales/pt.json';
import zh from '@/locales/zh.json';
import ja from '@/locales/ja.json';
import ko from '@/locales/ko.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  pt: { translation: pt },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'subradar-language',
      caches: ['localStorage'],
    },
  });

export default i18n;
