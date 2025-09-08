import { UserSchema } from '../../../../libs/shared/web/src/validators/user';
import { ZodError } from 'zod';

describe('UserSchema', () => {
  const validUserData = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'John Doe',
    email: 'john.doe@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('should validate a correct user object', () => {
    const result = UserSchema.safeParse(validUserData);
    expect(result.success).toBe(true);
  });

  it('should allow null for updated_at', () => {
    const result = UserSchema.safeParse({ ...validUserData, updated_at: null });
    expect(result.success).toBe(true);
  });

  it('should fail validation if id is not a valid UUID', () => {
    const result = UserSchema.safeParse({ ...validUserData, id: 'not-a-uuid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid UUID');
    }
  });

  it('should fail validation if name is empty', () => {
    const result = UserSchema.safeParse({ ...validUserData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name cannot be empty');
    }
  });

  it('should fail validation if email is not a valid email address', () => {
    const result = UserSchema.safeParse({ ...validUserData, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });

  it('should fail validation if created_at is not a valid date', () => {
    const result = UserSchema.safeParse({ ...validUserData, created_at: 'not-a-date' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid date format');
    }
  });

  it('should fail validation if updated_at is not a valid date', () => {
    const result = UserSchema.safeParse({ ...validUserData, updated_at: 'not-a-date' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid date format');
    }
  });
});
