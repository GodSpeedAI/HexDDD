import { UserSchema } from '@shared/web';

const sample = { id: '00000000-0000-0000-0000-000000000000', name: 'Ada Lovelace', email: 'ada@example.com' };

export default function IndexPage() {
  const parsed = UserSchema.safeParse(sample);
  const content = parsed.success ? `Hello, ${parsed.data.name}!` : 'Invalid sample user';

  return (
    <main>
      <h1>Web Next Example</h1>
      <p>{content}</p>
    </main>
  );
}
