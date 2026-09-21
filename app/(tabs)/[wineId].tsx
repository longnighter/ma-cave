import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
        <Text style={styles.value}>Vin non trouvé.</Text>
      </View>
    );
  }

  const grapes = Array.isArray(wine.grape) ? wine.grape.join(', ') : wine.grape;
  const title = wine.appellation || wine.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.idCard}>
        {wine.domain ? (
          <View style={styles.domainRow}>
            <MaterialCommunityIcons name="home-city-outline" size={14} color={colors.accent} />
            <Text style={styles.domain}>{wine.domain}</Text>
          </View>
        ) : null}

        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {wine.year ? (
            <View style={styles.yearBadge}>
              <Text style={styles.yearText}>{wine.year}</Text>
            </View>
          ) : null}
        </View>

        {(wine.region || grapes) && (
          <View style={styles.metaLine}>
            {wine.region ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.accent} />
                <Text style={styles.metaText}>{wine.region}</Text>
              </View>
            ) : null}
            {wine.region && grapes ? <View style={styles.metaDot} /> : null}
            {grapes ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="grape" size={14} color={colors.accent} />
                <Text style={styles.metaText}>{grapes}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {wine.bestToDrink && (
        <View style={styles.block}>
          <Text style={styles.section}>Apogée</Text>
          <Text style={styles.value}>
            Entre {wine.bestToDrink[0]} et {wine.bestToDrink[1]}
          </Text>
        </View>
      )}

      {wine.tastingNotes && wine.tastingNotes.length > 0 && (
        <View style={styles.block}>
          <Text style={styles.section}>Notes de dégustation</Text>
          <View style={styles.chipContainer}>
            {wine.tastingNotes.map((note, index) => (
              <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                {note}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {wine.winePairing && wine.winePairing.length > 0 && (
        <View style={styles.block}>
          <Text style={styles.section}>Accords mets & vins</Text>
          <View style={styles.chipContainer}>
            {wine.winePairing.map((pair, index) => (
              <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                {pair}
              </Chip>
            ))}
          </View>
        </View>
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
  idCard: {
    backgroundColor: colors.cardGlass,
    borderColor: colors.cardGlassBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  domain: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  yearBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  yearText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  metaLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.soft,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '100%',
  },
  metaText: {
    color: colors.valueText,
    fontSize: 13,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: colors.soft,
    marginVertical: 18,
  },
  block: {
    marginBottom: 18,
  },
  section: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    color: colors.valueText,
    fontSize: 15,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: colors.labelBg,
  },
  chipText: {
    color: colors.labelText,
    fontSize: 13,
  },
});
