import { z } from 'zod';

/**
 * @description Base UUID validator with consistent error message.
 * Used across all entities that require UUID validation.
 * Overrides type error to match validation error for consistency with tests.
 */
export const UUIDSchema = z.string({ invalid_type_error: "Invalid UUID" }).uuid({ message: "Invalid UUID" });

/**
 * @description Base email validator with consistent error message.
 * Used for user email validation.
 * Overrides type error to match validation error for consistency with tests.
 */
export const EmailSchema = z.string({ invalid_type_error: "Invalid email address" }).email({ message: "Invalid email address" });

/**
 * @description Base non-empty string validator with consistent error message.
 * Used for required string fields like names, titles, and content.
 */
export const NonEmptyStringSchema = z
  .string({ invalid_type_error: "Name cannot be empty" })
  .trim()
  .min(1, { message: "Name cannot be empty" });

/**
 * @description Base non-empty string validator with field-specific error message.
 * Used for titles that cannot be empty.
 */
export const NonEmptyTitleSchema = z
  .string({ invalid_type_error: "Title cannot be empty" })
  .trim()
  .min(1, { message: "Title cannot be empty" });

/**
 * @description Base non-empty string validator with field-specific error message.
 * Used for content that cannot be empty.
 */
export const NonEmptyContentSchema = z
  .string({ invalid_type_error: "Content cannot be empty" })
  .trim()
  .min(1, { message: "Content cannot be empty" });

/**
 * @description Base ISO 8601 date-time validator with consistent error message.
 * Used for timestamp fields across all entities.
 * Overrides type error to match validation error for consistency with tests.
 */
export const DateTimeSchema = z.string({ invalid_type_error: "Invalid date format" }).datetime({ message: "Invalid date format" });

/**
 * @description Base nullable ISO 8601 date-time validator.
 * Used for optional timestamp fields.
 */
export const NullableDateTimeSchema = z.union([DateTimeSchema, z.null()]);

/**
 * @description Base boolean validator.
 * Used for boolean fields.
 */
export const BooleanSchema = z.boolean();

/**
 * @description Strict object schema that rejects extra fields.
 * Used for database entities that should not allow additional properties.
 */
export const StrictObjectSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).strict();

/**
 * @description Composite schema for common entity fields.
 * Contains UUID, created_at timestamp, and optional updated_at timestamp.
 */
export const BaseEntitySchema = z.object({
  id: UUIDSchema,
  created_at: DateTimeSchema,
  updated_at: NullableDateTimeSchema,
});

/**
 * @description Inferred TypeScript type for base entity fields.
 */
export type BaseEntity = z.infer<typeof BaseEntitySchema>;

/**
 * @description Composite schema for user-specific fields.
 * Combines base entity fields with user-specific validations.
 */
export const UserSpecificSchema = z.object({
  name: NonEmptyStringSchema,
  email: EmailSchema,
});

/**
 * @description Inferred TypeScript type for user-specific fields.
 */
export type UserSpecific = z.infer<typeof UserSpecificSchema>;

/**
 * @description Composite schema for content fields.
 * Used for posts and comments that have content.
 */
export const ContentSchema = z.object({
  content: z.string().nullable(),
});

/**
 * @description Inferred TypeScript type for content fields.
 */
export type Content = z.infer<typeof ContentSchema>;

/**
 * @description Composite schema for reference fields.
 * Used for foreign key relationships (user_id, post_id).
 */
export const ReferenceSchema = z.object({
  user_id: UUIDSchema,
  post_id: UUIDSchema,
});

/**
 * @description Inferred TypeScript type for reference fields.
 */
export type Reference = z.infer<typeof ReferenceSchema>;
