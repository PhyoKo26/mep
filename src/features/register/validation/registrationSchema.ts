import { useLanguageStore } from 'store';
import { getTranslation } from 'translation/i18n';
import { z } from 'zod';

const lang = useLanguageStore.getState().lang;
const t = getTranslation(lang) || {
  requireName: 'Name is required',
  requirePhone: 'Phone is required',
  invalidPhone: 'Invalid phone number',
};

export const RegisterSchema = z.object({
  profile: z.any().refine(val => !!val, { message: 'Profile photo is required' }),
  name: z.string().min(1, ' Name is required'),
  phone: z
    .string()
    .nonempty(t.requirePhone)
    .min(9, 'Phone number is too short')
    .max(11, 'Phone number is too long')
    .regex(/^09[0-9]{7,9}$/, t.invalidPhone),

  email: z.string().email('Invalid email address').min(1, t.requireEmail),
});

export type RegistrationSchemaType = z.infer<typeof RegisterSchema>;
