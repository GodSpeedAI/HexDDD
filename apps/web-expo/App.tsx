import React from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { UserSchema } from '../../libs/shared/web/src';

const sample = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
};

export default function App() {
  const parsed = UserSchema.safeParse(sample);
  const content = parsed.success
    ? `Hello, ${parsed.data.name}!`
    : 'Invalid sample user';
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Web Expo Example</Text>
        <Text>{content}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
});

