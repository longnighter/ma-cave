import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Snackbar } from 'react-native-paper';
import { AddWineForm } from '../../components/add-wine/AddWineForm'; // Import
import { SuggestionModal } from '../../components/add-wine/SuggestionModal'; // Import
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AddWineForm
        name={name}
        isGenerating={isGenerating}
        onNameChange={setName}
        onSave={handleSave}
        onGenerate={handleGenerateInfo}
      />

      <SuggestionModal
        visible={isModalVisible}
        suggestedWine={suggestedWine}
        name={name}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        scaleAnim={scaleAnim}
        onDismiss={hideModal}
        onUseSuggestion={handleUseSuggestion}
      />

      <Snackbar
        visible={isAddWineSnackVisible}
        onDismiss={() => setIsAddWineSnackVisible(false)}
        duration={3000}
      >
        Vin ajouté à la base de données
      </Snackbar>
    </GestureHandlerRootView>
  );
}

// --- SECTION 4: LES STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 10, textAlign: 'center' },
  iaButton: { alignSelf: 'center', marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingTop: 8, paddingBottom: 8 },
  snackBar:{
    justifyContent: "flex-end",
    alignContent: "center",
    alignItems: "center",
    verticalAlign: "middle",
    top:0,
    paddingLeft:0,
    paddingRight:0
  }
});