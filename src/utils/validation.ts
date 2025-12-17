import { z } from 'zod';

export const emailValidation = z.string().email('Invalid email address').min(5, 'Email must be at least 5 characters');

export const passwordValidation = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(100, 'Password cannot exceed 100 characters');

export const nameValidation = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters');
