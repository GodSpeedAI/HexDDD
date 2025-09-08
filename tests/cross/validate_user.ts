import { UserSchema } from '../../libs/shared/web/src/validators/user';
import * as fs from 'fs';

function main() {
  try {
    const input = fs.readFileSync(0, 'utf-8');
    const data = JSON.parse(input);
    const result = UserSchema.safeParse(data);
    console.log(result.success);
  } catch (error) {
    console.log(false);
  }
}

main();
