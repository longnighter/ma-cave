import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, FAB } from 'react-native-paper';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useWines } from '../../context/WineContext';

export default function HomeScreen() {
  const router = useRouter();
  const { wines } = useWines();

  return (
    <View style={styles.container}>
      {wines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall">Votre cave est vide.</Text>
        </View>
      ) : (
        <FlatList
          data={wines}
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