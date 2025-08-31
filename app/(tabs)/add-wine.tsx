// --- SECTION 1: LES IMPORTATIONS ---
// On importe les outils dont nous avons besoin depuis d'autres bibliothèques.

// Importe la bibliothèque React elle-même. C'est obligatoire dans chaque fichier de composant.
import React from 'react';
// Importe des outils de base de React Native.
import { StyleSheet, View } from 'react-native';
// Importe le composant Text de la bibliothèque React Native Paper.
import { Text } from 'react-native-paper';

// --- SECTION 2: LA DÉFINITION DU COMPOSANT ---
// Ici, on crée notre composant d'écran. Un composant est un morceau d'interface réutilisable.

// "export default" rend notre composant utilisable par d'autres fichiers (notamment le système de navigation).
// "function AddWineScreen()" déclare une fonction qui EST notre composant. Le nom est en PascalCase par convention.
export default function AddWineScreen() { 
  
  // --- SECTION 3: LE RENDU VISUEL (JSX) ---
  // La fonction "return" ce que le composant doit afficher à l'écran. C'est un mélange de HTML et de JavaScript appelé JSX.

  return ( 
    // <View> est le conteneur le plus basique de React Native, l'équivalent d'une <div> en web.
    // "style={styles.container}" applique à ce conteneur les styles définis plus bas sous la clé "container".
    <View style={styles.container}> 
      
      {/* <Text> est un composant fait pour afficher du texte. Celui-ci vient de React Native Paper. 
      "variant" est une propriété de Paper qui nous donne un style de texte prédéfini (taille, graisse) sans effort.*/}
      <Text variant="headlineMedium">Ajouter un nouveau vin</Text>
      
    </View> // On ferme le conteneur principal.
  );
}

// --- SECTION 4: LA FEUILLE DE STYLES ---
// On définit ici l'apparence de nos composants, de manière similaire au CSS en web.

// On crée un objet "styles" qui contiendra toutes nos règles de style.
// "StyleSheet.create" est une fonction de React Native qui optimise ces styles pour de meilleures performances.
const styles = StyleSheet.create({ 
  
  // "container" est le nom de notre première règle de style. Il correspond à ce qu'on a appelé dans le JSX.
  container: { 
    // "flex: 1" est très important. Il dit au conteneur de prendre toute la place disponible sur l'écran.
    flex: 1, 
    // Aligne les enfants (le <Text>) verticalement au centre.
    justifyContent: 'center', 
    // Aligne les enfants (le <Text>) horizontalement au centre.
    alignItems: 'center', 
  },
});