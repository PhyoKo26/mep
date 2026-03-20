import { useLanguageStore } from 'store';
import { getTranslation } from 'translation/i18n';
import { z } from 'zod';

const lang = useLanguageStore.getState().lang;
const t = getTranslation(lang) || {
  // requireName: 'Name is required',
  // requirePhone: 'Phone is required',
  // invalidPhone: 'Invalid phone number',
};

export const RegisterSchema = z.object({
  // profile: z.any().refine(val => !!val, { message: 'Profile photo is required' }),
  profile: z.any().optional(),
  // phone: z
  //   .string()
  //   .nonempty(t.requirePhone)
  //   .min(9, 'Phone number is too short')
  //   .max(11, 'Phone number is too long')
  //   .regex(/^09[0-9]{7,9}$/, t.invalidPhone),
  phone: z.string().optional(),

  name: z.string().nonempty(t.requireName),
  email: z.string()
    .nonempty(t.requireEmail)
    .email('Invalid email address'),
  password: z.string()
    .nonempty(t.requirePassword)
    .min(8, t.atleast8),
  confirmpwd: z.string()
    .nonempty(t.requireConfirm),
})
  .refine(data => data.password === data.confirmpwd, {
    message: "Passwords don't match",
    path: ["confirmpwd"],
  });

export type RegistrationSchemaType = z.infer<typeof RegisterSchema>;
