import { ZodError } from 'zod';
import { DbUserSchema } from '../../../../libs/shared/web/src/index';

describe('DbUserSchema', () => {
  const validUserData = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'John Doe',
    email: 'john.doe@example.com',
    created_at: '2023-01-01T12:00:00.000Z',
    updated_at: '2023-01-02T12:00:00.000Z',
  };

  describe('valid data', () => {
    it('should validate a correct user object', () => {
      const result = DbUserSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    it('should allow null for updated_at', () => {
      const result = DbUserSchema.safeParse({ ...validUserData, updated_at: null });
      expect(result.success).toBe(true);
    });

    it('should accept various valid UUID formats', () => {
      const validUUIDs = [
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
      ];

      validUUIDs.forEach(uuid => {
        const result = DbUserSchema.safeParse({ ...validUserData, id: uuid });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid email addresses', () => {
      const validEmails = [
        'john.doe@example.com',
        'user+tag@example.org',
        'user.name@domain.co.uk',
        'user123@test123.com',
      ];

      validEmails.forEach(email => {
        const result = DbUserSchema.safeParse({ ...validUserData, email });
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
        const result = DbUserSchema.safeParse({ ...validUserData, created_at: date });
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
        const result = DbUserSchema.safeParse({ ...validUserData, id });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid UUID');
        }
      });
    });

    it('should fail validation if name is empty', () => {
      const result = DbUserSchema.safeParse({ ...validUserData, name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name cannot be empty');
      }
    });

    it('should fail validation if name is not a string', () => {
      const invalidNames = [123, null, undefined, {}];

      invalidNames.forEach(name => {
        const result = DbUserSchema.safeParse({ ...validUserData, name });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if email is not a valid email address', () => {
      const invalidEmails = [
        'not-an-email',
        'invalid@',
        '@domain.com',
        'user@.com',
        'user@domain.',
        'user@domain..com',
        '',
        123,
        null,
        undefined,
      ];

      invalidEmails.forEach(email => {
        const result = DbUserSchema.safeParse({ ...validUserData, email });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email address');
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
        const result = DbUserSchema.safeParse({ ...validUserData, created_at: date });
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
      ];

      invalidDates.forEach(date => {
        console.log('user invalid date', date);
        const result = DbUserSchema.safeParse({ ...validUserData, updated_at: date });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid date format');
        }
      });
    });

    it('should fail validation if required fields are missing', () => {
      const requiredFields = ['id', 'name', 'email', 'created_at'] as const;

      requiredFields.forEach((field: keyof typeof validUserData) => {
        const testData: Partial<typeof validUserData> = { ...validUserData };
        delete testData[field];
        const result = DbUserSchema.safeParse(testData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].code).toBe('invalid_type');
        }
      });
    });

    it('should fail validation if extra fields are provided', () => {
      const result = DbUserSchema.safeParse({
        ...validUserData,
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
      const result = DbUserSchema.safeParse({ ...validUserData, id: 'invalid-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid UUID');
      }
    });

    it('should provide helpful error messages for email validation', () => {
      const result = DbUserSchema.safeParse({ ...validUserData, email: 'invalid-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should provide helpful error messages for date validation', () => {
      const result = DbUserSchema.safeParse({ ...validUserData, created_at: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid date format');
      }
    });

    it('should provide helpful error messages for empty name', () => {
      const result = DbUserSchema.safeParse({ ...validUserData, name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name cannot be empty');
      }
    });
  });

  describe('type inference', () => {
    it('should correctly infer the User type from schema', () => {
      const testUser: typeof DbUserSchema._type = {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        name: 'John Doe',
        email: 'john.doe@example.com',
        created_at: '2023-01-01T12:00:00.000Z',
        updated_at: '2023-01-02T12:00:00.000Z',
      };

      const result = DbUserSchema.safeParse(testUser);
      expect(result.success).toBe(true);
    });
  });
});
