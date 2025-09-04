// This should trigger a lint error - domain importing infrastructure
import { UserRepository } from '../../../infrastructure/src/lib/user.repository';

export function invalidImport() {
  const repo = new UserRepository();
  return repo.findUser('123');
}
