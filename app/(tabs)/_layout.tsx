import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '../../constants/theme';
import { useWines } from '../../context/WineContext';

export default function TabLayout() {
  const count = useWines().wines.length;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.pageElevated },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.pageElevated,
          borderTopColor: colors.soft,
          height: 64,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
        },
        // Hide MissingIcon placeholder — text-only tabs, like the HTML board
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none', width: 0, height: 0 },
        sceneStyle: { backgroundColor: colors.page },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: `Ma Cave — ${count} vin${count === 1 ? '' : 's'}`,
          tabBarLabel: 'Ma Cave',
        }}
      />
      <Tabs.Screen
        name="add-wine"
        options={{
          title: 'Ajouter un vin',
          href: null,
        }}
      />
      <Tabs.Screen
        name="[wineId]"
        options={{
          href: null,
          title: 'Détail',
        }}
      />
    </Tabs>
  );
}
