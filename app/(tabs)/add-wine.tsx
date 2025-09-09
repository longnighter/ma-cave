import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useWines } from '../../context/WineContext';
import { Wine } from "../../models/Wine.ts";

export default function AddWineScreen() {
  const router = useRouter();
  const { addWine } = useWines();

  // --- SECTION 1: L'ÉTAT (STATE) ---
  // On crée des "boîtes" pour mémoriser la saisie de l'utilisateur pour chaque champ.
  const defaultTuple: [number, number] = [0,0];
  const [name, setName] = useState('');
  const [year, setYear] = useState(Number);
  const [region, setRegion] = useState('');
  const [appellation, setAppellation] = useState(String);
  const [grape, setGrape] = useState('');
  const [tastingNotes, setTastingNotes] = useState([""]);
  const [bestToDrink, setBestToDrink] = useState(defaultTuple);
  const [domain, setDomain] = useState('');
  const [winePairing, setWinePairing] = useState([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestedWine, setSuggestedWine] = useState<Wine | null>(null);

  // --- SECTION 2: LA LOGIQUE DE SAUVEGARDE ---
  const handleSave = () => {
    // Validation simple pour s'assurer que les champs principaux ne sont pas vides
    if (!name) {
      alert('Veuillez renseigner le nom');
      return; // On arrête la fonction ici si la validation échoue
    }

    // On crée notre nouvel objet vin avec les données de l'état
    const newWine = {
      name: name,
      year: year, // On convertit l'année (texte) en nombre
      region: region, 
      appellation: appellation,
      grape: grape,
      tastingNotes: tastingNotes,
      bestToDrink: bestToDrink,
      domain: domain,
      winePairing: winePairing
    };

    // Pour l'instant, on affiche le résultat dans la console du terminal
    console.log('Nouveau vin sauvegardé:', newWine);
    addWine(newWine);

    // Finalement, on retourne à l'écran précédent (la liste)
    router.back();
  };

  const handleGenerateInfo = async () => {
    if (!name) {
      alert('Veuillez renseigner le nom');
      return;
    }
    setIsGenerating(true)
    try{
      const { data, error } = await supabase.functions.invoke("geminiGetWineInfo",{"body":{"name":name}})
      console.log(data)
      if (error) throw error;

      setIsModalVisible(true)
      setSuggestedWine(data)
    }
    catch (error: any){
      alert(`Something went wrong. Error :${error.message}`)
      console.error(error)
      return;
    }
    finally{
      setIsGenerating(false)
    }
  }

  const handleUseSuggestion = () => {
    if (suggestedWine) {
    
      setName(suggestedWine.name)
      setYear(suggestedWine.year)
      setRegion(suggestedWine.region || "")
      setAppellation(suggestedWine.appellation || "")
      setGrape(suggestedWine.grape || "")
      setBestToDrink(suggestedWine.bestToDrink || defaultTuple);
      setTastingNotes(suggestedWine.tastingNotes || [""])
      setDomain(suggestedWine.domain || "")
      setWinePairing(suggestedWine.winePairing || [""])


      addWine(suggestedWine);
      setIsModalVisible(false)
      router.navigate("/")
    }
  };

  // --- SECTION 3: LE RENDU VISUEL (JSX) ---
  return (
    <>
      <GestureHandlerRootView>
        <ScrollView style={styles.container}>
          <Text variant="headlineMedium" style={styles.title}>Ajouter un nouveau vin</Text>
          
          <TextInput
            label="Nom du vin"
            value={name}
            onChangeText={setName} // Chaque frappe met à jour l'état "name"
            style={styles.input}
          />
          {/*
          <TextInput
            label="Millésime (année)"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric" // Affiche un clavier numérique
            style={styles.input}
          />

          <TextInput
            label="Région"
            value={region}
            onChangeText={setRegion}
            style={styles.input}
          />
          */}
          <Button 
            mode="contained" 
            onPress={handleSave} 
            style={styles.button}
          >
            Ajouter à la cave
          </Button>

          <Button 
            mode="text" 
            onPress={handleGenerateInfo}
            loading={isGenerating}
            disabled={isGenerating}
            style={styles.button}
          >
            Générer les infos avec Gemini
          </Button>

        </ScrollView>
        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            {suggestedWine && (
              <View>
                <Text variant="headlineSmall" style={styles.modalTitle}>Vin trouvé</Text>
                <Text variant="bodyMedium">Nom</Text>
                <Text>{suggestedWine.name}</Text>
                <Text>Appellation: {suggestedWine.appellation}</Text>
                <Text>Région: {suggestedWine.region}</Text>
                <Text>Millésime: {suggestedWine.year}  </Text>
                <Text>Cépage(s): {suggestedWine.grape} </Text>
                <Text>Domaine: {suggestedWine.domain} </Text>
                <Text>Apogée: de {suggestedWine.bestToDrink[0]} à {suggestedWine.bestToDrink[1]} </Text>
                <Text>Notes arômatiques: {suggestedWine.tastingNotes} </Text>

                <View style={styles.modalButtonContainer} >
                  <Button onPress={handleUseSuggestion}>
                    Utiliser ces infos
                  </Button>
                  <Button onPress={() => setIsModalVisible(false)}>
                    Annuler
                  </Button>
                </View>
              </View>
            )}
          </Modal>
        </Portal>
      </GestureHandlerRootView>
    </>
  );
}

// --- SECTION 4: LES STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 10, textAlign: 'center' },
  iaButton: { alignSelf: 'center', marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingTop: 8, paddingBottom: 8 },
  // Nouveaux styles pour le modal
  modalContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10, // Crée un espace autour du modal
    borderRadius: 9, // Arrondit les coins
  },
  modalTitle: {
    marginBottom: 40,
    paddingBlock: 30
  },
  modalText: {
    fontSize: 20,
    marginBottom: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligne les boutons à droite
    marginTop: 20,
  },
});