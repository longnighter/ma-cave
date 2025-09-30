import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text, TextInput } from 'react-native-paper';

// On définit les types des props que le composant va recevoir
type AddWineFormProps = {
  name: string;
  isGenerating: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onGenerate: () => void;
};

export const AddWineForm = ({
  name,
  isGenerating,
  onNameChange,
  onSave,
  onGenerate,
}: AddWineFormProps) => {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Ajouter un nouveau vin
      </Text>

      <TextInput
        label="Nom du vin"
        value={name}
        onChangeText={onNameChange}
        style={styles.input}
      />
      
      {/* On pourrait ajouter les autres champs ici de la même manière */}

      <Button mode="contained" onPress={onSave} style={styles.button}>
        Ajouter à la cave
      </Button>

      <Button
        mode="text"
        onPress={onGenerate}
        loading={isGenerating}
        disabled={isGenerating}
        style={styles.button}
      >
        Générer les infos avec Gemini
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 10, textAlign: 'center' },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingTop: 8, paddingBottom: 8 },
});