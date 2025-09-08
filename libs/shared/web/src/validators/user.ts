import { z } from 'zod';

/**
 * @description Zod schema for a user.
 * This schema is used to validate user data on the client-side.
 *
 * It ensures that the user data conforms to the expected structure and types.
 *
 * @see https://zod.dev/
 */
export const UserSchema = z.object({
  /**
   * @description The unique identifier for the user.
   * Should be a valid UUID.
   */
  id: z.string().uuid({ message: "Invalid UUID" }),

  /**
   * @description The name of the user.
   * Should be a non-empty string.
   */
  name: z.string().min(1, { message: "Name cannot be empty" }),

  /**
   * @description The email address of the user.
   * Should be a valid email address.
   */
  email: z.string().email({ message: "Invalid email address" }),

  /**
   * @description The timestamp of when the user was created.
   * Should be a valid ISO 8601 date-time string.
   */
  created_at: z.string().datetime({ message: "Invalid date format" }),

  /**
   * @description The timestamp of when the user was last updated.
   * Should be a valid ISO 8601 date-time string or null.
   */
  updated_at: z.string().datetime({ message: "Invalid date format" }).nullable(),
});

/**
 * @description Inferred TypeScript type for a user.
 * This type is derived from the Zod schema and represents a validated user object.
 */
export type User = z.infer<typeof UserSchema>;
