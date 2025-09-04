// This should trigger a lint error - domain importing infrastructure
import { UserRepository } from '@fixture/fixture-infrastructure';

export function invalidImport() {
  const repo = new UserRepository();
  return repo.findUser('123');
}
