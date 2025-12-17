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
      email: z.string().email('Invalid email address').min(1, t.requireEmail),
      // password: z
      //   .string({
      //     required_error: t.requirePassword,
      //   }),
    });
  }, [lang, t]);
};

export type LoginSchemaType = z.infer<ReturnType<typeof LoginSchema>>;