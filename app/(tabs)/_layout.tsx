import { Tabs } from 'expo-router';
import React from 'react';
import { useWines } from '../../context/WineContext';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // Ce nom fait référence au fichier index.tsx
        options={{
          title: `Ma Cave - ${useWines().wines.length} vins`,
        }}
      />
      <Tabs.Screen
        name="add-wine"
        options={{
          title: `Ajouter un vin`
        }}
      />
      <Tabs.Screen
        name="[wineId]"
        options={{
          title: `Détails`
        }}
      />
    </Tabs>
  );
}