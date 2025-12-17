import { ZodType, ZodError } from 'zod';

// Define the structure of error messages
interface FieldError {
  type: 'validation';
  message: string;
}

export const zodResolver = (schema: ZodType) => {
  return async (values: any) => {
    try {
      const data = schema.parse(values);
      return { values: data, errors: {} };
    } catch (e: any) {
      // Handle ZodError
      if (e instanceof ZodError) {
        // Reduce the errors from the ZodError into the correct format
        const errors = Object.entries(e.formErrors?.fieldErrors || {}).reduce((acc, [key, message]) => {
          acc[key] = {
            type: 'validation',
            message: message?.[0] || 'Invalid value',
          };
          return acc;
        }, {} as Record<string, FieldError>);

        return { values: {}, errors };
      }

      return { values: {}, errors: {} };
    }
  };
};
