import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import uuid from "react-native-uuid";
import { useWines } from '../../context/WineContext';

export default function AddWineScreen() {
  const router = useRouter();
  const { addWine } = useWines();

  // --- SECTION 1: L'ÉTAT (STATE) ---
  // On crée des "boîtes" pour mémoriser la saisie de l'utilisateur pour chaque champ.
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [region, setRegion] = useState('');
  const [appellation, setAppellation] = useState('');
  const [grape, setGrape] = useState('');
  const [tastingNotes, setTastingNotes] = useState([]);
  const [bestToDrink, setBestToDrink] = useState();
  const [domain, setDomain] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // --- SECTION 2: LA LOGIQUE DE SAUVEGARDE ---
  const handleSave = () => {
    // Validation simple pour s'assurer que les champs principaux ne sont pas vides
    if (!name || !year) {
      alert('Veuillez renseigner au moins le nom et l\'année.');
      return; // On arrête la fonction ici si la validation échoue
    }

    // On crée notre nouvel objet vin avec les données de l'état
    const newWine = {
      id: uuid.v4() as string, // On génère un ID unique basé sur la date actuelle
      name: name,
      year: parseInt(year,10), // On convertit l'année (texte) en nombre
      region: region, 
      appellation: appellation,
      grape: grape,
      tastingNotes: tastingNotes,
      bestToDrink: bestToDrink,
      domain: domain

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

      setName(data.name)
      setYear(data.year)
      setRegion(data.region)
      setAppellation(data.appellation)
      setGrape(data.grape)
      setBestToDrink(data.bestToDrink)
      setTastingNotes(data.tastingNotes)
      setDomain(data.domain)
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

  // --- SECTION 3: LE RENDU VISUEL (JSX) ---
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Ajouter un nouveau vin</Text>
      
      <TextInput
        label="Nom du vin"
        value={name}
        onChangeText={setName} // Chaque frappe met à jour l'état "name"
        style={styles.input}
      />
    
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

    </View>
  );
}

// --- SECTION 4: LES STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});