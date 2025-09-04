import { User } from '../../../domain/src/lib/user.entity';

export class UserService {
  getUser(id: string): User {
    return { id, name: 'John Doe', email: 'john@example.com' };
  }
}
