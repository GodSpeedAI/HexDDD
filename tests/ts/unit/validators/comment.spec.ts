import { ZodError } from 'zod';
import { DbCommentSchema } from '../../../../libs/shared/web/src/index';

describe('DbCommentSchema', () => {
  const validCommentData = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    post_id: 'b1ffdc88-8d1c-5df9-cc7e-7cc9ce471b22',
    user_id: 'c2aadd99-9e2d-6ef0-dd8f-8dda9d491c33',
    content: 'This is a comment on the post.',
    created_at: '2023-01-01T12:00:00.000Z',
  };

  describe('valid data', () => {
    it('should validate a correct comment object', () => {
      const result = DbCommentSchema.safeParse(validCommentData);
      expect(result.success).toBe(true);
    });

    it('should accept various valid UUID formats for id, post_id, and user_id', () => {
      const validUUIDs = [
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      ];

      validUUIDs.forEach(uuid => {
        const result = DbCommentSchema.safeParse({
          ...validCommentData,
          id: uuid,
          post_id: uuid,
          user_id: uuid
        });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid non-empty content', () => {
      const validContents = [
        'This is a comment on the post.',
        'A',
        'Comment with special characters! @#$%^&*()',
        '   ',
      ];

      validContents.forEach(content => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, content });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid ISO 8601 date strings', () => {
      const validDates = [
        '2023-01-01T12:00:00.000Z',
        '2023-01-01T12:00:00.000+00:00',
        '2023-01-01T12:00:00.000-05:00',
        '2023-01-01T00:00:00.000Z',
      ];

      validDates.forEach(date => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, created_at: date });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('invalid data', () => {
    it('should fail validation if id is not a valid UUID', () => {
      const invalidIds = [
        'not-a-uuid',
        '123456789',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11-extra',
        'a0eebc99-9c0b-4ef8-bb6d',
        '',
        123,
        null,
        undefined,
      ];

      invalidIds.forEach(id => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, id });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid UUID');
        }
      });
    });

    it('should fail validation if post_id is not a valid UUID', () => {
      const invalidPostIds = [
        'not-a-uuid',
        '123456789',
        'b1ffdc88-8d1c-5df9-cc7e-7cc9ce471b22-extra',
        'b1ffdc88-8d1c-5df9-cc7e',
        '',
        123,
        null,
        undefined,
      ];

      invalidPostIds.forEach(postId => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, post_id: postId });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid UUID');
        }
      });
    });

    it('should fail validation if user_id is not a valid UUID', () => {
      const invalidUserIds = [
        'not-a-uuid',
        '123456789',
        'c2ggdd99-9e2d-6ef0-dd8f-8dda9d491c33-extra',
        'c2ggdd99-9e2d-6ef0-dd8f',
        '',
        123,
        null,
        undefined,
      ];

      invalidUserIds.forEach(userId => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, user_id: userId });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid UUID');
        }
      });
    });

    it('should fail validation if content is empty', () => {
      const result = DbCommentSchema.safeParse({ ...validCommentData, content: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Content cannot be empty');
      }
    });

    it('should fail validation if content is not a string', () => {
      const invalidContents = [123, null, undefined, {}];

      invalidContents.forEach(content => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, content });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if created_at is not a valid date', () => {
      const invalidDates = [
        'not-a-date',
        '2023-01-01',
        '2023-01-01T12:00:00',
        '01/01/2023',
        '',
        123,
      ];

      invalidDates.forEach(date => {
        const result = DbCommentSchema.safeParse({ ...validCommentData, created_at: date });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid date format');
        }
      });
    });

    it('should fail validation if required fields are missing', () => {
      const requiredFields = ['id', 'post_id', 'user_id', 'content', 'created_at'] as const;

      requiredFields.forEach((field: keyof typeof validCommentData) => {
        const testData: Partial<typeof validCommentData> = { ...validCommentData };
        delete testData[field];
        const result = DbCommentSchema.safeParse(testData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if extra fields are provided', () => {
      const result = DbCommentSchema.safeParse({
        ...validCommentData,
        extra_field: 'should not be allowed',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });
  });

  describe('error messages', () => {
    it('should provide helpful error messages for UUID validation', () => {
      const result = DbCommentSchema.safeParse({ ...validCommentData, id: 'invalid-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid UUID');
      }
    });

    it('should provide helpful error messages for content validation', () => {
      const result = DbCommentSchema.safeParse({ ...validCommentData, content: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Content cannot be empty');
      }
    });

    it('should provide helpful error messages for date validation', () => {
      const result = DbCommentSchema.safeParse({ ...validCommentData, created_at: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid date format');
      }
    });
  });

  describe('type inference', () => {
    it('should correctly infer the Comment type from schema', () => {
      const testComment: typeof DbCommentSchema._type = {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        post_id: 'b1ffdc88-8d1c-5df9-cc7e-7cc9ce471b22',
        user_id: 'c2ggdd99-9e2d-6ef0-dd8f-8dda9d491c33',
        content: 'This is a comment on the post.',
        created_at: '2023-01-01T12:00:00.000Z',
      };

      const result = DbCommentSchema.safeParse(testComment);
      expect(result.success).toBe(true);
    });
  });
});
