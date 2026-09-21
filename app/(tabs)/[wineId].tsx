import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { colors } from '../../constants/theme';
import { useWines } from '../../context/WineContext';

export default function WineDetailScreen() {
  const { wineId } = useLocalSearchParams<{ wineId: string }>();
  const { wines } = useWines();
  const wine = wines.find((w) => w.id === wineId);

  if (!wine) {
    return (
      <View style={styles.container}>
        <Text style={styles.body}>Vin non trouvé.</Text>
      </View>
    );
  }

  const grapes = Array.isArray(wine.grape) ? wine.grape.join(', ') : wine.grape;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        {wine.name} ({wine.year})
      </Text>
      <Text style={styles.muted}>{wine.region || 'Région non spécifiée'}</Text>
      <Text style={styles.muted}>{grapes || 'Cépage non spécifié'}</Text>

      <View style={styles.divider} />

      {wine.bestToDrink && (
        <>
          <Text style={styles.section}>Apogée</Text>
          <Text style={styles.body}>
            Entre {wine.bestToDrink[0]} et {wine.bestToDrink[1]}
          </Text>
        </>
      )}

      {wine.tastingNotes && wine.tastingNotes.length > 0 && (
        <>
          <Text style={[styles.section, styles.sectionSpaced]}>Notes de dégustation</Text>
          <View style={styles.chipContainer}>
            {wine.tastingNotes.map((note, index) => (
              <Chip
                key={index}
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {note}
              </Chip>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 8,
  },
  section: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  sectionSpaced: {
    marginTop: 20,
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.soft,
    marginVertical: 18,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: colors.wineSoft,
  },
  chipText: {
    color: colors.gold,
    fontSize: 13,
  },
});
