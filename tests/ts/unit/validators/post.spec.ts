import { ZodError } from 'zod';
import { DbPostSchema } from '../../../../libs/shared/web/src/index';

describe('DbPostSchema', () => {
  const validPostData = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    user_id: 'b1ffdc88-8d1c-5df9-cc7e-7cc9ce471b22',
    title: 'Sample Post Title',
    content: 'This is the content of the post.',
    published: true,
    created_at: '2023-01-01T12:00:00.000Z',
    updated_at: '2023-01-02T12:00:00.000Z',
  };

  describe('valid data', () => {
    it('should validate a correct post object', () => {
      const result = DbPostSchema.safeParse(validPostData);
      expect(result.success).toBe(true);
    });

    it('should allow null for content', () => {
      const result = DbPostSchema.safeParse({ ...validPostData, content: null });
      expect(result.success).toBe(true);
    });

    it('should allow null for updated_at', () => {
      const result = DbPostSchema.safeParse({ ...validPostData, updated_at: null });
      expect(result.success).toBe(true);
    });

    it('should accept false for published', () => {
      const result = DbPostSchema.safeParse({ ...validPostData, published: false });
      expect(result.success).toBe(true);
    });

    it('should accept various valid UUID formats for id and user_id', () => {
      const validUUIDs = [
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      ];

      validUUIDs.forEach(uuid => {
        const result = DbPostSchema.safeParse({ ...validPostData, id: uuid, user_id: uuid });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid non-empty titles', () => {
      const validTitles = [
        'A',
        'Sample Post Title',
        'Post with 123 numbers and symbols! @#$%',
        '   ',
      ];

      validTitles.forEach(title => {
        const result = DbPostSchema.safeParse({ ...validPostData, title });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid content strings or null', () => {
      const validContents = [
        'This is the content of the post.',
        '',
        '   ',
        'Post with special characters! @#$%^&*()',
        null,
      ];

      validContents.forEach(content => {
        const result = DbPostSchema.safeParse({ ...validPostData, content });
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
        const result = DbPostSchema.safeParse({ ...validPostData, created_at: date });
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
        const result = DbPostSchema.safeParse({ ...validPostData, id });
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
        'b1ffdc88-8d1c-5df9-cc7e-7cc9ce471b22-extra',
        'b1ffdc88-8d1c-5df9-cc7e',
        '',
        123,
        null,
        undefined,
      ];

      invalidUserIds.forEach(userId => {
        const result = DbPostSchema.safeParse({ ...validPostData, user_id: userId });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid UUID');
        }
      });
    });

    it('should fail validation if title is empty', () => {
      const result = DbPostSchema.safeParse({ ...validPostData, title: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title cannot be empty');
      }
    });

    it('should fail validation if title is not a string', () => {
      const invalidTitles = [123, null, undefined, {}];

      invalidTitles.forEach(title => {
        const result = DbPostSchema.safeParse({ ...validPostData, title });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if content is not a string or null', () => {
      const invalidContents = [123, {}, []];

      invalidContents.forEach(content => {
        const result = DbPostSchema.safeParse({ ...validPostData, content });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if published is not a boolean', () => {
      const invalidPublishedValues = [1, 0, 'true', 'false', null, undefined, {}];

      invalidPublishedValues.forEach(published => {
        const result = DbPostSchema.safeParse({ ...validPostData, published });
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
        null,
        undefined,
      ];

      invalidDates.forEach(date => {
        const result = DbPostSchema.safeParse({ ...validPostData, created_at: date });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid date format');
        }
      });
    });

    it('should fail validation if updated_at is not a valid date when provided', () => {
      const invalidDates = [
        'not-a-date',
        '2023-01-01',
        '2023-01-01T12:00:00',
        '01/01/2023',
        '',
        123,
        null,
        undefined,
      ];

      invalidDates.forEach(date => {
        const result = DbPostSchema.safeParse({ ...validPostData, updated_at: date });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid date format');
        }
      });
    });

    it('should fail validation if required fields are missing', () => {
      const requiredFields = ['id', 'user_id', 'title', 'published', 'created_at'] as const;

      requiredFields.forEach((field: keyof typeof validPostData) => {
        const testData: Partial<typeof validPostData> = { ...validPostData };
        delete (testData as any)[field];
        const result = DbPostSchema.safeParse(testData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if extra fields are provided', () => {
      const result = DbPostSchema.safeParse({
        ...validPostData,
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
      const result = DbPostSchema.safeParse({ ...validPostData, id: 'invalid-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid UUID');
      }
    });

    it('should provide helpful error messages for title validation', () => {
      const result = DbPostSchema.safeParse({ ...validPostData, title: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title cannot be empty');
      }
    });

    it('should provide helpful error messages for date validation', () => {
      const result = DbPostSchema.safeParse({ ...validPostData, created_at: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid date format');
      }
    });
  });

  describe('type inference', () => {
    it('should correctly infer the Post type from schema', () => {
      const testPost: typeof DbPostSchema._type = {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        user_id: 'b1ffdc88-8d1c-5df9-cc7e-7cc9ce471b22',
        title: 'Sample Post Title',
        content: 'This is the content of the post.',
        published: true,
        created_at: '2023-01-01T12:00:00.000Z',
        updated_at: '2023-01-02T12:00:00.000Z',
      };

      const result = DbPostSchema.safeParse(testPost);
      expect(result.success).toBe(true);
    });
  });
});
