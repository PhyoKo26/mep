import { useLanguageStore } from 'store';
import { getTranslation } from 'translation/i18n';

const useTranslation = () => {
  const lang = useLanguageStore((state) => state.lang);

  // Memoize the translation so it only recalculates when 'lang' changes
  const t = getTranslation(lang);

  return t;
};

export default useTranslation;
