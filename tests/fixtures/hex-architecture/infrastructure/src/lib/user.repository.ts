import { User } from '../../../domain/src/lib/user.entity';

export class UserRepository {
  findUser(id: string): User {
    return { id, name: 'Test User', email: 'test@example.com' };
  }
}
