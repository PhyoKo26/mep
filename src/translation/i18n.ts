import en from './en';
import mm from './my';

export type LanguageType = 'mm' | 'en';

const translations = {
  en,
  mm,
};

export const getTranslation = (lang: LanguageType) => {
  return translations[lang] || translations.en;
};
