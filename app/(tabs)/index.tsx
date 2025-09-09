import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, List, Text } from 'react-native-paper';
import { useWines } from '../../context/WineContext';

export default function HomeScreen() {
  const router = useRouter();
  const { wines, loading } = useWines();
  
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

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
              // 👇 AJOUTEZ CETTE LIGNE 👇
              onPress={() => router.push(`/${item.id}`)}
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