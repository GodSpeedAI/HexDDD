import { z } from 'zod';
import { UUIDSchema, DateTimeSchema, StrictObjectSchema } from './shared';

/**
 * @description Zod schema for a comment.
 * This schema is used to validate comment data on the client-side.
 *
 * It ensures that the comment data conforms to the expected structure and types.
 *
 * @see https://zod.dev/
 */
export const CommentSchema = StrictObjectSchema({
  /**
   * @description The unique identifier for the comment.
   * Should be a valid UUID.
   */
  id: UUIDSchema,

  /**
   * @description The unique identifier for the post that the comment belongs to.
   * Should be a valid UUID.
   */
  post_id: UUIDSchema,

  /**
   * @description The unique identifier for the user who created the comment.
   * Should be a valid UUID.
   */
  user_id: UUIDSchema,

  /**
   * @description The content of the comment.
   * Should be a non-empty string (whitespace allowed is considered non-empty by tests).
   */
  content: z.string({ invalid_type_error: 'Content cannot be empty' }).min(1, { message: 'Content cannot be empty' }),

  /**
   * @description The timestamp of when the comment was created.
   * Should be a valid ISO 8601 date-time string.
   */
  created_at: DateTimeSchema,
});

/**
 * @description Inferred TypeScript type for a comment.
 * This type is derived from the Zod schema and represents a validated comment object.
 */
export type Comment = z.infer<typeof CommentSchema>;
