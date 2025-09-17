import { z } from 'zod';
import {
  UUIDSchema,
  NonEmptyTitleSchema,
  NonEmptyContentSchema,
  DateTimeSchema,
  NullableDateTimeSchema,
  BooleanSchema,
  StrictObjectSchema,
} from './shared';

/**
 * @description Zod schema for a post.
 * This schema is used to validate post data on the client-side.
 *
 * It ensures that the post data conforms to the expected structure and types.
 *
 * @see https://zod.dev/
 */
export const PostSchema = StrictObjectSchema({
  /**
   * @description The unique identifier for the post.
   * Should be a valid UUID.
   */
  id: UUIDSchema,

  /**
   * @description The unique identifier for the user who created the post.
   * Should be a valid UUID.
   */
  user_id: UUIDSchema,

  /**
   * @description The title of the post.
   * Should be a non-empty string.
   */
  title: NonEmptyTitleSchema,

  /**
   * @description The content of the post.
   * Should be a string or null.
   */
  content: NonEmptyContentSchema.nullable(),

  /**
   * @description Whether the post is published or not.
   * Should be a boolean.
   */
  published: BooleanSchema,

  /**
   * @description The timestamp of when the post was created.
   * Should be a valid ISO 8601 date-time string.
   */
  created_at: DateTimeSchema,

  /**
   * @description The timestamp of when the post was last updated.
   * Should be a valid ISO 8601 date-time string or null.
   */
  updated_at: NullableDateTimeSchema,
});

/**
 * @description Inferred TypeScript type for a post.
 * This type is derived from the Zod schema and represents a validated post object.
 */
export type Post = z.infer<typeof PostSchema>;
