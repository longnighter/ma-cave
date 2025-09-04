import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Divider, Text } from 'react-native-paper';
import { useWines } from '../../context/WineContext';

export default function WineDetailScreen() {
  // --- SECTION 1: RÉCUPÉRER LES DONNÉES ---
  const { wineId } = useLocalSearchParams<{ wineId: string }>();
  const { wines } = useWines();

  // --- AJOUTEZ CES LIGNES DE DÉBOGAGE ---
    console.log("--- DÉBOGAGE DE L'ÉCRAN DE DÉTAIL ---");
    console.log("ID récupéré de l'URL (wineId) :", wineId);
    console.log("Type de wineId :", typeof wineId);
    console.log("Liste complète des vins (wines) :", wines);
    if (wines.length > 0) {
    console.log("ID du premier vin dans la liste :", wines[0].id);
    console.log("Type de l'ID du premier vin :", typeof wines[0].id);
    }
    console.log("------------------------------------");
    // --- FIN DES LIGNES DE DÉBOGAGE ---

  const wine = wines.find(w => w.id === wineId);

  // --- SECTION 2: GÉRER LE CAS OÙ LE VIN N'EST PAS TROUVÉ ---
  if (!wine) {
    return (
      <View style={styles.container}>
        <Text>Vin non trouvé.</Text>
      </View>
    );
  }

  // --- SECTION 3: AFFICHER LES DÉTAILS DU VIN ---
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: wine.name }} />
      <Text variant="titleLarge"> {wine.name} ({wine.year}) </Text>
      
      <Text variant="bodyMedium"> {wine.region || 'Région non spécifiée'}</Text>
      <Text variant="bodyMedium"> {wine.grape || 'Cépage non spécifié'}</Text>
      
      <Divider style={styles.divider} />

      {wine.bestToDrink && (
        <>
          <Text variant="titleLarge">Apogée</Text>
          <Text variant="bodyMedium">Entre {wine.bestToDrink[0]} et {wine.bestToDrink[1]}</Text>
        </>
      )}

      {wine.tastingNotes && wine.tastingNotes.length > 0 && (
        <>
          <Text variant="bodyMedium"> Notes de Dégustation</Text>
          <View style={styles.chipContainer}>
            {wine.tastingNotes.map((note, index) => (
              <Chip key={index} style={styles.chip}>{note}</Chip>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// --- SECTION 4: LES STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, marginBottom: 10 },
  subtitle: { fontSize: 22, marginTop: 20 },
  paragraph: { fontSize: 16, lineHeight: 24 },
  divider: { marginVertical: 20 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: { margin: 4 }
});