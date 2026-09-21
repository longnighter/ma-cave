import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Button, Card, Chip, Divider, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { colors } from '../../constants/theme';
import { useWines } from '../../context/WineContext';
import { Wine } from "../../models/Wine.ts";

const { height: screenHeight } = Dimensions.get('window');

export default function AddWineScreen() {
  const router = useRouter();
  const { addWine } = useWines();

      // Animation refs
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current; // NEW: For backdrop

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

  useEffect(() => {
    if (isModalVisible) {
      // Reset animation values
      slideAnim.setValue(screenHeight);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      backdropAnim.setValue(0); // Reset backdrop


      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isModalVisible]);

    // Animated hide modal function
  const hideModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
    });
  };

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
      hideModal()
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
            buttonColor={colors.wine}
            textColor="#ffffff"
          >
            Ajouter à la cave
          </Button>

          <Button
            mode="text"
            onPress={handleGenerateInfo}
            loading={isGenerating}
            disabled={isGenerating}
            style={styles.button}
            textColor={colors.gold}
          >
            Générer les infos avec Gemini
          </Button>

        </ScrollView>
        {(isModalVisible || isAddWineSnackVisible) && (
          <Portal>
            <GestureHandlerRootView 
            style={StyleSheet.absoluteFill} pointerEvents="box-none"
            >
              <Animated.View style={[styles.animatedBackdrop, { opacity: fadeAnim }]}>
                {/* On utilise un Pressable pour pouvoir fermer le modal en cliquant sur le fond */}
                <Pressable style={{ flex: 1 }} onPress={hideModal} />
              </Animated.View>
              {/* <Modal
                visible={isModalVisible}
                onDismiss={hideModal}
                contentContainerStyle={styles.transparentModalContainer}
              > */}
              <View style={styles.modalPositioner} pointerEvents="box-none">
                <Animated.View
                  style={[
                    styles.modalContainer, // Votre style existant pour le conteneur
                    {
                      // On applique les transformations ici
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                    },
                  ]}
                >
                  {suggestedWine && (
                  // <Animated.View
                  //   style={[
                  //     styles.animatedModalContent,
                  //     {
                  //       opacity: fadeAnim,
                  //       transform: [
                  //         { translateY: slideAnim },
                  //         { scale: scaleAnim }
                  //       ],
                  //     },
                  //   ]}
                  // >
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
                              <Text variant="titleMedium" style={styles.detailLabel}>Appellation</Text>
                              <Text variant="bodyLarge" style={styles.detailValue}>{suggestedWine.appellation}</Text>
                            </View>
                          )}
                          {suggestedWine.region && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Région</Text>
                              <Text variant="bodyLarge" style={styles.detailValue}>{suggestedWine.region}</Text>
                            </View>
                          )}
                          {suggestedWine.year && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Millésime</Text>
                              <Text variant="bodyLarge" style={styles.detailValue}>{suggestedWine.year}</Text>
                            </View>
                          )}
                          {suggestedWine.grape && suggestedWine.grape.length > 0 && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Cépage(s)</Text>
                              <Text variant="bodyLarge" style={styles.detailValue}>{suggestedWine.grape.join(', ')}</Text>
                            </View>
                          )}
                          {suggestedWine.domain && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Domaine</Text>
                              <Text variant="bodyLarge" style={styles.detailValue}>{suggestedWine.domain}</Text>
                            </View>
                          )}

                          {suggestedWine.bestToDrink && suggestedWine.bestToDrink.length === 2 && (
                            <View style={styles.detailRow}>
                              <Text variant="titleMedium" style={styles.detailLabel}>Apogée</Text>
                              <Text variant="bodyLarge" style={styles.detailValue}>{suggestedWine.bestToDrink[0]} - {suggestedWine.bestToDrink[1]}</Text>
                            </View>
                          )}
                        </Card.Content>
                      </Card>

                      <Divider style={styles.divider} />

                      <Card style={styles.infoCard}>
                        <Card.Content>
                          {suggestedWine.tastingNotes && suggestedWine.tastingNotes.length > 0 && (
                            <View style={styles.tastingNotesContainer}>
                              <Text variant="titleMedium" style={styles.sectionLabel}>Notes de dégustation :</Text>
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
                              <Text variant="titleMedium" style={styles.sectionLabel}>Accords Mets & Vins :</Text>
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
                          buttonColor={colors.wine}
                          textColor="#ffffff"
                          labelStyle={styles.modalButtonLabel}
                          onPress={handleUseSuggestion}
                        >
                          Utiliser
                        </Button>
                        <Button
                          mode="outlined"
                          style={[styles.modalButton, styles.annulerModalButton]}
                          textColor={colors.gold}
                          contentStyle={styles.buttonContent}
                          buttonColor={colors.modalBg}
                          labelStyle={styles.modalButtonLabel}
                          onPress={hideModal}
                        >
                          Annuler
                        </Button>
                      </View>
                    </ScrollView>
                  //</Animated.View>
                )}
                {/* </Modal> */}
                </Animated.View>
              </View>
              <Snackbar 
                onDismiss={() => setIsAddWineSnackVisible(false)}
                duration={3000}
                visible={isAddWineSnackVisible}
                wrapperStyle={styles.snackBar}
                style={styles.snackBar}
              >
                Vin ajouté à la base de données
              </Snackbar>
            </GestureHandlerRootView>
          </Portal>
        )}
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.page,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: colors.ink,
    fontWeight: '600',
  },
  input: {
    marginBottom: 15,
    backgroundColor: colors.card,
  },
  button: {
    marginTop: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  animatedBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  modalPositioner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.modalBg,
    borderRadius: 16,
    maxHeight: '95%',
    width: '90%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalSubTitle: {
    textAlign: 'center',
    color: colors.gold,
    marginBottom: 4,
    marginTop: 4,
    fontWeight: '700',
  },
  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: colors.soft,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.soft,
    paddingBottom: 6,
  },
  detailLabel: {
    fontWeight: '700',
    marginRight: 8,
    color: colors.ink,
    width: 100,
  },
  detailValue: {
    flex: 1,
    color: colors.muted,
  },
  sectionLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
  tastingNotesContainer: {
    marginTop: 0,
    paddingTop: 0,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: colors.labelBg,
  },
  chipText: {
    fontSize: 13,
    color: colors.labelText,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.soft,
  },
  modalButton: {
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 6,
    padding: 0,
  },
  annulerModalButton: {
    borderColor: colors.wine,
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  modalButtonLabel: {
    fontSize: 16,
  },
  snackBar: {
    justifyContent: 'flex-end',
    alignContent: 'center',
    alignItems: 'center',
    top: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  infoCard: {
    marginBottom: 6,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
});