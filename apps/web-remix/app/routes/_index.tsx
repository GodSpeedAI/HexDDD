import { UserSchema } from '../../../../libs/shared/web/src';

const sample = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
};

export default function Index() {
  const parsed = UserSchema.safeParse(sample);
  const content = parsed.success
    ? `Hello, ${parsed.data.name}!`
    : 'Invalid sample user';
  return (
    <main>
      <h1>Web Remix Example</h1>
      <p>{content}</p>
    </main>
  );
}

