// schemas/login.ts
import { useLanguageStore } from 'store';
import { getTranslation } from 'translation/i18n';
import { z } from 'zod';
import { useMemo } from 'react';

export const LoginSchema = () => {
  const lang = useLanguageStore(state => state.lang);
  const t = getTranslation(lang);

  return useMemo(() => {
    return z.object({
      email: z.string()
        .nonempty(t.requireEmail)
        .email('Invalid email address'),
      password: z.string()
        .nonempty(t.requirePassword)
        .min(8, t.atleast8),
    });
  }, [lang, t]);
};

export type LoginSchemaType = z.infer<ReturnType<typeof LoginSchema>>;