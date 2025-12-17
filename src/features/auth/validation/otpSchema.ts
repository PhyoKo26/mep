import { useLanguageStore } from 'store';
import { getTranslation } from 'translation/i18n';
import { z } from 'zod';
const lang = useLanguageStore.getState().lang;
const t = getTranslation(lang);

export const OtpSchema = z.object({
  otp: z
    .string({
      required_error: t.requireOtp,
    })
    .min(6, 'OTP must be at least 6 characters long'),
});

export type OtpSchemaType = z.infer<typeof OtpSchema>;
