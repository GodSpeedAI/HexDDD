import { User } from '@fixture/fixture-domain';

export class UserRepository {
  findUser(id: string): User {
    return { id, name: 'Test User', email: 'test@example.com' };
  }
}
