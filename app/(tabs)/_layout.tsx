import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // Ce nom fait référence au fichier index.tsx
        options={{
          title: 'Ma Cave',
        }}
      />
    </Tabs>
  );
}