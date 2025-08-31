import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, List, Text } from 'react-native-paper';
import { Wine } from '../../models/Wine'; // Importons notre interface mise à jour

// Nos données factices. Elles respectent le nouveau contrat de l'interface Wine.
const mockWines: Wine[] = [
  {
    id: '1',
    name: 'Château Margaux',
    year: 1982,
    region: 'Bordeaux',
    bestToDrink: [2010, 2040],
    tastingNotes: ['Cèdre', 'Cassis', 'Tabac blond']
  },
  {
    id: '2',
    name: 'Domaine de la Romanée-Conti',
    year: 2005,
    region: 'Bourgogne',
    bestToDrink: [2025, 2060],
    tastingNotes: ['Fruits rouges', 'Sous-bois', 'Rose fanée']
  },
  {
    id: '3',
    name: 'Clos Rougeard',
    year: 2010,
    region: 'Loire',
    tastingNotes: ['Framboise', 'Poivron', 'Graphite']
  },
];

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {mockWines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall">Votre cave est vide.</Text>
        </View>
      ) : (
        <FlatList
          data={mockWines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={`${item.name} (${item.year})`}
              description={item.region}
              left={props => <List.Icon {...props} icon="bottle-wine" />}
            />
          )}
          style={styles.list}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)/add-wine')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});