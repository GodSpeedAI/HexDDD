import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { UserSchema, ENV } from '@shared/web';

const sample = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
};

export default function App() {
  const [health, setHealth] = useState<'unknown' | 'ok' | 'error'>('unknown');
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  useEffect(() => {
    const base = (ENV.API_URL || '').replace(/\/$/, '');
    setApiUrl(base || null);
    const isAbs = /^https?:\/\//i.test(base);
    if (!isAbs) {
      setHealth('ok');
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${base}/health`);
        setHealth(res.ok ? 'ok' : 'error');
      } catch {
        setHealth('error');
      }
    })();
  }, []);
  const parsed = UserSchema.safeParse(sample);
  const content = parsed.success
    ? `Hello, ${parsed.data.name}!`
    : 'Invalid sample user';
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Web Expo Example</Text>
        <Text>{content}</Text>
        <Text style={styles.meta}>API: {apiUrl ?? '(relative / local)'}</Text>
        <Text style={styles.meta}>Health: {health}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  meta: { fontSize: 12, color: '#444', marginTop: 4 },
});
