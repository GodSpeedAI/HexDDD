import { User } from '@fixture/fixture-domain';

export class UserService {
  getUser(id: string): User {
    return { id, name: 'John Doe', email: 'john@example.com' };
  }
}
