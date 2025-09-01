import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ExpoRouter, useLocalSearchParams } from 'expo-router';

export default function WineDetailScreen() {
    return(
        <View style={styles.emptyContainer}>
          <Text variant="headlineSmall">Détails du vin</Text>
        </View>
    )
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

export const useRouter = () => {
  const context = useRouter(id);
  if (context === undefined) {
    throw new Error('some error');
  }
  return context;
};