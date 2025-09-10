import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Button, Card, Chip, Divider, Modal, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
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
  const [grape, setGrape] = useState([""]);
  const [tastingNotes, setTastingNotes] = useState([""]);
  const [bestToDrink, setBestToDrink] = useState(defaultTuple);
  const [domain, setDomain] = useState('');
  const [winePairing, setWinePairing] = useState([""]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestedWine, setSuggestedWine] = useState<Wine | null>(null);
  const [isAddWineSnackVisible, setIsAddWineSnackVisible] = useState(false)

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

  const handleUseSuggestion = async () => {
    if (suggestedWine) {
    
      setName(suggestedWine.name)
      setYear(suggestedWine.year)
      setRegion(suggestedWine.region || "")
      setAppellation(suggestedWine.appellation || "")
      setGrape(suggestedWine.grape || [])
      setBestToDrink(suggestedWine.bestToDrink || defaultTuple);
      setTastingNotes(suggestedWine.tastingNotes || [""])
      setDomain(suggestedWine.domain || "")
      setWinePairing(suggestedWine.winePairing || [""])


      const confirmAddWine = await addWine(suggestedWine);
      if (confirmAddWine) {setIsAddWineSnackVisible(true)}
      setIsModalVisible(false)
      router.navigate("/")
    }
  };

  // --- SECTION 3: LE RENDU VISUEL (JSX) ---
  return (
    <>
      <GestureHandlerRootView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
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
        {(isModalVisible || isAddWineSnackVisible) && (
          <Portal>
            <GestureHandlerRootView 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <Modal
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                contentContainerStyle={styles.modalContainer}
              >
                {suggestedWine && (
                    <ScrollView contentContainerStyle={styles.modalContent}>

                      <Card style={styles.infoCard}>
                        <Card.Content>
                          <Text variant="titleLarge" style={styles.modalSubTitle}>
                          {suggestedWine.name || name}
                        </Text>
                        </Card.Content>
                      </Card>

                      <Divider style={styles.divider} />

                      <Card style={styles.infoCard}>
                        <Card.Content>
                          {suggestedWine.appellation && (
                            <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Appellation :</Text>
                              <Text variant="bodyLarge" >{suggestedWine.appellation}</Text>
                            </View>
                          )}
                          {suggestedWine.region && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Région :</Text>
                              <Text variant="bodyLarge">{suggestedWine.region}</Text>
                            </View>
                          )}
                          {suggestedWine.year && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Millésime :</Text>
                              <Text variant="bodyLarge">{suggestedWine.year}</Text>
                            </View>
                          )}
                          {suggestedWine.grape && suggestedWine.grape.length > 0 && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Cépages :</Text>
                              <Text variant="bodyLarge">{suggestedWine.grape.join(', ')}</Text>
                            </View>
                          )}
                          {suggestedWine.domain && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Domaine :</Text>
                              <Text variant="bodyLarge">{suggestedWine.domain}</Text>
                            </View>
                          )}

                          {suggestedWine.bestToDrink && suggestedWine.bestToDrink.length === 2 && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Apogée :</Text>
                              <Text variant="bodyLarge">{suggestedWine.bestToDrink[0]} - {suggestedWine.bestToDrink[1]}</Text>
                            </View>
                          )}
                        </Card.Content>
                      </Card>

                      <Divider style={styles.divider} />
                      <Card style={styles.infoCard}>
                        <Card.Content>
                          {suggestedWine.tastingNotes && suggestedWine.tastingNotes.length > 0 && (
                            <View style={styles.tastingNotesContainer}>
                              <Text variant="titleMedium" >Notes de dégustation :</Text>
                              <View style={styles.chipsContainer}>
                                {suggestedWine.tastingNotes.map((note, index) => (
                                  <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                                    {note}
                                  </Chip>
                                ))}
                              </View>
                            </View>
                          )}
                        </Card.Content>
                      </Card>
                      <Card style={styles.infoCard}>
                        <Card.Content>
                          {suggestedWine.winePairing && suggestedWine.winePairing.length > 0 && (
                            <View style={styles.tastingNotesContainer}>
                              <Text variant="titleMedium" >Accords Mets & Vins :</Text>
                              <View style={styles.chipsContainer}>
                                {suggestedWine.winePairing.map((note, index) => (
                                  <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                                    {note}
                                  </Chip>
                                ))}
                              </View>
                            </View>
                          )}
                        </Card.Content>
                      </Card>
                      

                      <View style={styles.modalButtonContainer} >
                        <Button 
                        style={[styles.modalButton]}
                        mode="contained"
                        contentStyle={styles.buttonContent}
                        buttonColor='#6e0909ff'
                        textColor='white'
                        labelStyle={styles.modalButtonLabel}
                        onPress={handleUseSuggestion} >
                          Utiliser ces infos
                        </Button>
                        <Button 
                        mode="outlined"
                        style={[styles.modalButton, styles.annulerModalButton]} 
                        textColor="darkred" 
                        contentStyle={styles.buttonContent}
                        buttonColor='#d9d7d7ff'
                        
                        labelStyle={styles.modalButtonLabel}
                        onPress={() => setIsModalVisible(false)}>
                          Annuler
                        </Button>
                      </View>
                    </ScrollView>
                )}
              </Modal>
              <Snackbar 
                onDismiss={() => setIsAddWineSnackVisible(false)}
                duration={3000}
                visible={isAddWineSnackVisible}
                wrapperStyle={styles.snackBar}
                style={styles.snackBar}
              >
                Vin ajouté à la base de donnée
              </Snackbar>
            </GestureHandlerRootView>
          </Portal>
        )}
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
    backgroundColor: '#d9d7d7ff',
    marginHorizontal: 20,
    borderRadius: 16, // Bords plus arrondis
    maxHeight: '95%',
    overflow: 'hidden'
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  modalTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubTitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
    verticalAlign:"middle"
  },
  divider: {
    marginVertical: 16,
    height: 1.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // Aligne les labels et les valeurs
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#111',
    //fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    color: '#444',
  },
  tastingNotesContainer: {
    marginTop: 5,
    //marginBottom: 10,
    //flexDirection: 'row', // Pour aligner les chips
    //lexWrap: 'wrap',     // Permet aux chips de passer à la ligne
    //alignItems: 'center',
  },
    chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#6e09092a', // Couleur de fond du chip
  },
  chipText: {
    fontSize: 13,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribue l'espace entre les boutons
    marginTop: 15,
    paddingTop: 20,
    borderTopWidth: 1, // Une petite bordure pour séparer les boutons du contenu
    borderTopColor: '#eee',
  },
  modalButton:{
    borderRadius:15,
    flex:1,
    marginHorizontal: 10,
    padding:0
  },
  annulerModalButton: {
    marginHorizontal: 5,
    borderColor: '#6e0909ff',
    borderWidth: 2.5,
  },
  buttonContent:{
    paddingVertical: 5
  },
  modalButtonLabel:{
    fontSize:20
  },
  snackBar:{
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    top:0,
    paddingLeft:30,
    paddingRight:30
  },
  infoCard: {
    marginBottom: 10, // Espace entre les cartes
    marginTop:5,
    borderRadius: 12,
    elevation: 3, // Ombre légère pour effet de bulle
  }
});