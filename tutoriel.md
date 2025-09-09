# Guide de Développement : Créez votre Sommelier Numérique (v3.0)

*Un tutoriel pour construire une application de gestion de cave à vin de A à Z avec React Native, Expo, Supabase et l'API Gemini.*

**Dernière mise à jour :** 6 septembre 2025

---

## Introduction : Le Projet

L'objectif de ce projet est de développer une application mobile multiplateforme (iOS et Android) pour gérer une cave à vin personnelle. Cette application, "ma-cave", a pour but de :
1.  **Cataloguer ses vins :** Garder une base de données persistante de tous les vins.
2.  **Obtenir des fiches de dégustation :** Utiliser l'API de l'IA Gemini pour générer des informations détaillées.
3.  **Gérer les stocks :** Suivre le nombre de bouteilles restantes pour chaque vin.
4.  **Consulter, Ajouter, Modifier, Supprimer** les vins de sa cave.

---

## Chapitre 1 : Les Fondations

* **Frontend :** React Native avec Expo.
* **Backend & Base de Données :** Supabase (Base de données PostgreSQL, Edge Functions pour la logique serveur).
* **Langage :** TypeScript (`.tsx`).
* **Navigation :** Expo Router (basé sur le système de fichiers).
* **Bibliothèque UI :** React Native Paper (pour des composants Material Design).

---

## Chapitre 2 : Installation de l'Environnement

Assurez-vous que tous les outils suivants sont installés sur votre Mac.

1.  **Homebrew (Gestionnaire de paquets) :**
    ```bash
    /bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh))"
    ```

2.  **Outils de développement (Node.js, Git, Deno) :**
    ```bash
    brew install node
    brew install git
    brew install deno
    ```

3.  **Supabase CLI :**
    ```bash
    brew install supabase/tap/supabase
    ```

4.  **Visual Studio Code :** À télécharger depuis le site officiel (version Apple Silicon).

5.  **Android Studio :** À télécharger depuis le site officiel (version Mac with Apple chip). Après installation, lancez-le une fois, choisissez "Standard installation", puis allez dans `More Actions > Virtual Device Manager` pour créer un émulateur (ex: Pixel 7).

---

## Chapitre 3 : Création et Versionnage du Projet

1.  **Créez le projet Expo :** Ouvrez votre Terminal, naviguez vers un dossier local **non synchronisé par un service cloud** (ex: `cd ~/Projets`) et lancez :
    ```bash
    npx create-expo-app ma-cave
    ```

2.  **Ouvrez le projet dans VS Code :**
    ```bash
    cd ma-cave
    code .
    ```

3.  **Initialisez Git et liez à GitHub :**
    * Dans le terminal de VS Code, lancez `git init`.
    * Allez sur GitHub.com et créez un nouveau dépôt **vierge** nommé `ma-cave`.
    * Connectez et envoyez le projet initial :
    ```bash
    git remote add origin [https://github.com/VOTRE_NOM_UTILISATEUR/ma-cave.git](https://github.com/VOTRE_NOM_UTILISATEUR/ma-cave.git)
    git branch -M main
    git add .
    git commit -m "Initial commit: projet 'ma-cave' créé avec Expo"
    git push -u origin main
    ```

---

## Chapitre 4 : Structure de l'Application et UI

1.  **Installez les bibliothèques nécessaires :**
    ```bash
    npx expo install react-native-paper
    npx expo install react-native-vector-icons
    npx expo install react-native-gesture-handler
    ```

2.  **Créez la structure de navigation :**
    * Dans le dossier `app`, créez un sous-dossier `(tabs)`.
    * Déplacez le fichier `app/index.tsx` (s'il existe) vers `app/(tabs)/index.tsx`.
    * Supprimez les autres fichiers d'écrans d'exemple (ex: `app/(tabs)/two.tsx`).

3.  **Configurez le layout principal (`app/_layout.tsx`) :**
    ```typescript
    import 'react-native-gesture-handler';
    import { Stack } from 'expo-router';
    import { Provider as PaperProvider } from 'react-native-paper';
    
    export default function RootLayout() {
      return (
        <PaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      );
    }
    ```

4.  **Configurez le layout des onglets (`app/(tabs)/_layout.tsx`) :**
    ```typescript
    import { Tabs } from 'expo-router';
    import React from 'react';
    
    export default function TabLayout() {
      return (
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Ma Cave',
            }}
          />
        </Tabs>
      );
    }
    ```

---
## Chapitre 5 : Modèle de Données et État Global

1.  **Créez le modèle de données (`models/Wine.ts`) :**
    ```typescript
    export interface Wine {
      id: string;
      name: string;
      year: number;
      appellation?: string;
      grape?: string;
      region?: string;
      bestToDrink?: [number, number];
      tastingNotes?: string[];
    }
    ```

2.  **Créez le Contexte (`context/WineContext.tsx`) :** C'est notre "source de vérité" pour les données.
    *(Note : Ce code sera mis à jour au chapitre 10 pour utiliser Supabase).*
    ```typescript
    import React, { createContext, useState, useContext, ReactNode } from 'react';
    import { Wine } from '../models/Wine';
    
    interface WineContextType {
      wines: Wine[];
      addWine: (wine: Wine) => void;
      loading: boolean;
    }
    
    const WineContext = createContext<WineContextType | undefined>(undefined);
    
    export const WineProvider = ({ children }: { children: ReactNode }) => {
      const [wines, setWines] = useState<Wine[]>([]);
      const [loading, setLoading] = useState(true);
    
      const addWine = (wine: Wine) => {
        setWines(currentWines => [wine, ...currentWines]);
      };
    
      return (
        <WineContext.Provider value={{ wines, addWine, loading }}>
          {children}
        </WineContext.Provider>
      );
    };
    
    export const useWines = () => {
      const context = useContext(WineContext);
      if (context === undefined) {
        throw new Error('useWines must be used within a WineProvider');
      }
      return context;
    };
    ```

3.  **Ajoutez le `WineProvider` au layout principal (`app/_layout.tsx`) :**
    ```typescript
    import 'react-native-gesture-handler';
    import { Stack } from 'expo-router';
    import { Provider as PaperProvider } from 'react-native-paper';
    import { WineProvider } from '../context/WineContext'; // Importer
    
    export default function RootLayout() {
      return (
        <WineProvider> {/* Envelopper l'application */}
          <PaperProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </WineProvider>
      );
    }
    ```

---
## Chapitre 6 : Écran Principal et Navigation

1.  **Construisez l'écran d'accueil (`app/(tabs)/index.tsx`) :**
    ```typescript
    import React from 'react';
    import { View, StyleSheet } from 'react-native';
    import { Text, List, FAB, ActivityIndicator } from 'react-native-paper';
    import { FlatList } from 'react-native';
    import { useRouter } from 'expo-router';
    import { useWines } from '../../context/WineContext';
    
    export default function HomeScreen() {
      const router = useRouter();
      const { wines, loading } = useWines();
    
      if (loading) {
        return (
          <View style={styles.emptyContainer}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        );
      }
    
      return (
        <View style={styles.container}>
          {wines.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="headlineSmall">Votre cave est vide.</Text>
            </View>
          ) : (
            <FlatList
              data={wines}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={`${item.name} (${item.year})`}
                  description={item.region}
                  left={props => <List.Icon {...props} icon="bottle-wine" />}
                  onPress={() => router.push(`/${item.id}`)}
                />
              )}
              style={styles.list}
            />
          )}
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => router.push('/add-wine')}
          />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: { flex: 1 },
      emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
      list: { width: '100%' },
      fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
    });
    ```
*(Note : Nous avons modifié le chemin de navigation pour le FAB et les List.Item pour qu'ils soient plus simples, car Expo Router les résoudra correctement à l'intérieur du groupe `(tabs)`)*.

---
## Chapitre 7 : Formulaire d'Ajout

1.  **Créez le fichier de l'écran d'ajout (`app/(tabs)/add-wine.tsx`) :**
    ```typescript
    // Ce code sera mis à jour au chapitre 11 avec la logique Gemini
    import React, { useState } from 'react';
    import { View, StyleSheet, ScrollView } from 'react-native';
    import { TextInput, Button, Text } from 'react-native-paper';
    import { useRouter } from 'expo-router';
    import { useWines } from '../../context/WineContext';
    import uuid from 'react-native-uuid';
    
    export default function AddWineScreen() {
      const router = useRouter();
      const { addWine } = useWines();
      const [name, setName] = useState('');
      const [year, setYear] = useState('');
      const [region, setRegion] = useState('');
      // ... autres états ...
    
      const handleSave = () => {
        // ... logique de sauvegarde ...
        const newWine = {
          id: uuid.v4() as string,
          name,
          year: parseInt(year),
          region
        };
        addWine(newWine);
        router.back();
      };
    
      return (
        <ScrollView style={styles.container}>
          {/* ... Champs TextInput et Button ... */}
        </ScrollView>
      );
    }
    // ... styles ...
    ```

---
## Chapitre 8 : Écran de Détail

1.  **Créez le fichier de la route dynamique (`app/(tabs)/[wineId].tsx`) :**
    ```typescript
    import React from 'react';
    import { View, StyleSheet, ScrollView } from 'react-native';
    import { Text, Title, Paragraph, Chip, Divider } from 'react-native-paper';
    import { useLocalSearchParams, Stack } from 'expo-router';
    import { useWines } from '../../context/WineContext';
    
    export default function WineDetailScreen() {
      const { wineId } = useLocalSearchParams<{ wineId: string }>();
      const { wines } = useWines();
      const wine = wines.find(w => w.id === wineId);
    
      if (!wine) {
        return <View><Text>Vin non trouvé.</Text></View>;
      }
    
      return (
        <ScrollView style={styles.container}>
          <Stack.Screen options={{ title: wine.name }} />
          {/* ... Affichage des détails du vin ... */}
        </ScrollView>
      );
    }
    // ... styles ...
    ```

---
## Chapitre 9 : Mise en place du Backend Supabase

1.  **Sur Supabase.com :** Créez un projet, générez et sauvegardez un mot de passe.
2.  **Créez la table `wines` :**
    * Nom : `wines`
    * Décochez "Enable Row Level Security (RLS)".
    * **Colonnes :**
        * `id` : `uuid` (définir comme Primary Key)
        * `created_at` : `timestamptz`
        * `name` : `text`
        * `year` : `int4`
        * `appellation` : `text` (Is Nullable)
        * `grape` : `text` (Is Nullable)
        * `region` : `text` (Is Nullable)
        * `drink_from` : `int4` (Is Nullable)
        * `drink_to` : `int4` (Is Nullable)
        * `tasting_notes` : `text[]` (Type `text`, cocher "Is Array", Is Nullable)

3.  **Récupérez les clés d'API** (`URL` et `anon` `public`) dans `Project Settings > API`.

---
## Chapitre 10 : L'Edge Function Gemini

1.  **Liez le projet local :** `supabase login`, `supabase link --project-ref ...`, `supabase init`.
2.  **Gérez les secrets :**
    * **Cloud :** Ajoutez `GEMINI_API_KEY` dans les "Secrets" du projet sur le tableau de bord.
    * **Local :** Créez `supabase/.env.local` et ajoutez `GEMINI_API_KEY=VOTRE_CLE`.
3.  **Configurez Deno :**
    * Créez `supabase/deno.json`.
    * Créez `supabase/functions/import_map.json`.
    * Créez `supabase/tsconfig.json`.
4.  **Créez la fonction :** `supabase functions new geminiGetWineInfo`.
5.  **Créez le fichier `supabase/functions/_shared/cors.ts`.**
6.  **Code de la fonction (`supabase/functions/geminiGetWineInfo/index.ts`) :**
    *(Contient la logique `fetch` vers l'API Gemini, la construction du prompt, le schema et le parsing de la réponse).*
7.  **Déployez :** `supabase functions deploy geminiGetWineInfo --no-verify-jwt`.
8.  **Testez :** `supabase functions serve --env-file ./supabase/.env.local geminiGetWineInfo --no-verify-jwt`

---
## Chapitre 11 : Connexion Finale de l'Application

1.  **Configurez le client Supabase dans l'app :**
    * Créez le fichier `.env` à la racine de `ma-cave`.
    * Ajoutez `.env` au `.gitignore`.
    * Créez le fichier `lib/supabase.ts`.

2.  **Mettez à jour `context/WineContext.tsx` :** Remplacez la logique `useState` par des appels `async` à Supabase (`useEffect` pour charger, `addWine` pour insérer).

3.  **Mettez à jour `app/(tabs)/add-wine.tsx` :**
    * Ajoutez le bouton "Générer les infos par IA".
    * Créez la fonction `handleGenerateInfo` qui appelle l'Edge Function avec `supabase.functions.invoke(...)`.

---
## Chapitre 12 : Améliorer l'UX avec un Popup et un Snackbar

Pour améliorer l'expérience utilisateur, au lieu de remplir automatiquement le formulaire, nous allons afficher les suggestions de l'IA dans un popup (un "Modal"). L'utilisateur pourra alors choisir d'accepter ces suggestions ou de les ignorer. De plus, un message de confirmation discret (un "Snackbar") apparaîtra après l'ajout réussi d'un vin.

#### Étape 1 : Mettre à jour `WineContext` pour signaler le succès

Pour que notre écran sache quand afficher le message de confirmation, notre fonction `addWine` doit nous dire si l'opération a réussi. Nous la modifions pour qu'elle retourne `true` en cas de succès et `false` en cas d'échec.

**Fichier : `context/WineContext.tsx`**
```typescript
// Mettez à jour la signature dans l'interface
interface WineContextType {
  wines: Wine[];
  addWine: (wine: Omit<Wine, 'id'>) => Promise<boolean>; // Changer le retour en Promise<boolean>
  loading: boolean;
}

// Mettez à jour l'implémentation de la fonction
const addWine = async (wineToAdd: Omit<Wine, 'id'>): Promise<boolean> => {
  const { data, error } = await supabase
    .from('wines')
    .insert({ /* ...colonnes... */ })
    .select()
    .single();

  if (error) {
    console.error("Erreur lors de l'ajout du vin", error);
    return false; // On retourne false en cas d'échec
  } 
  else if (data) {
    const newWineFormatted = {
      ...data,
      bestToDrink: [data.drink_from, data.drink_to],
      tastingNotes: data.tasting_notes,
    };
    setWines(currentWines => [newWineFormatted, ...currentWines]);
    return true; // On retourne true en cas de succès
  }
  return false; // Cas par défaut
};
```

#### Étape 2 : Préparer l'état dans l'écran d'ajout

Nous avons besoin de trois nouveaux états dans notre fichier `app/(tabs)/add-wine.tsx` :
1.  Un pour contrôler la visibilité du popup.
2.  Un pour stocker temporairement les données reçues de Gemini.
3.  Un pour contrôler la visibilité du message de confirmation.

```typescript
// Dans app/(tabs)/add-wine.tsx, à l'intérieur du composant AddWineScreen
import { Wine } from '@/models/Wine'; // Assurez-vous que l'import est correct

// ...
const [isModalVisible, setIsModalVisible] = useState(false);
const [suggestedWine, setSuggestedWine] = useState<Partial<Wine> | null>(null);
const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
```

#### Étape 3 : Mettre à jour les fonctions de l'écran

Nous adaptons nos fonctions `handleGenerateInfo`, `handleUseSuggestion`, et `handleSave` pour utiliser notre nouvelle logique de popup et de snackbar.

**Fichier : `app/(tabs)/add-wine.tsx`**

```typescript
// Met à jour l'état avec les suggestions de l'IA et ouvre le modal
const handleGenerateInfo = async () => {
  // ...
  try {
    const { data, error } = await supabase.functions.invoke('geminiGetWineInfo', { /*...*/ });
    if (error) throw error;
    
    setSuggestedWine(data);
    setIsModalVisible(true);
  } catch (error: any) {
    // ...
  } finally {
    // ...
  }
};

// Logique du bouton "Utiliser" dans le popup : remplit le formulaire principal
const handleUseSuggestion = () => {
  if (suggestedWine) {
    setName(suggestedWine.name || name);
    setYear(suggestedWine.year?.toString() || year);
    setAppellation(suggestedWine.appellation || '');
    setRegion(suggestedWine.region || '');
    setDomain(suggestedWine.domain || '');
    setGrape(suggestedWine.grape?.join(', ') || '');
    setTastingNotes(suggestedWine.tastingNotes?.join(', ') || '');
    setBestToDrink(suggestedWine.bestToDrink?.join(' - ') || '');

    // On ferme le modal
    setIsModalVisible(false);
  }
};

// Met à jour handleSave pour utiliser le retour de addWine et afficher le Snackbar
const handleSave = async () => {
  if (!name || !year) {
    alert("Veuillez renseigner au moins le nom et l'année.");
    return;
  }
  
  const newWine = { /* ...création de l'objet vin sans id... */ };
  
  const success = await addWine(newWine);
  
  if (success) {
    setIsSnackbarVisible(true); // Affiche le message de succès
    // On attend un court instant pour que l'utilisateur voie le message avant de revenir en arrière
    setTimeout(() => {
      router.back();
    }, 1500);
  } else {
    alert("Erreur lors de la sauvegarde du vin.");
  }
};
```

#### Étape 4 : Ajouter le JSX du Modal et du Snackbar

Nous ajoutons le code visuel pour nos popups dans le `return` du composant `AddWineScreen`.

**Fichier : `app/(tabs)/add-wine.tsx`**
```typescript
return (
  <>
    <ScrollView>
      {/* ... Votre formulaire ... */}
    </ScrollView>

    {/* Le Popup Modal */}
    <Portal>
      <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.modalContainer}>
        {suggestedWine && (
          <View>
            <Text variant="headlineSmall">Suggestions de l'IA</Text>
            {/* ... Affichage des données de suggestedWine ... */}
            <View style={styles.modalButtonContainer}>
              <Button onPress={handleUseSuggestion}>Utiliser</Button>
              <Button onPress={() => setIsModalVisible(false)}>Annuler</Button>
            </View>
          </View>
        )}
      </Modal>
    </Portal>

    {/* Le message de confirmation Snackbar */}
    <Snackbar
      visible={isSnackbarVisible}
      onDismiss={() => setIsSnackbarVisible(false)}
      duration={1500} // Durée avant de disparaître automatiquement
    >
      Vin ajouté à la cave !
    </Snackbar>
  </>
);
```

#### Étape 5 : Ajouter les styles pour les popups

Ajoutez ces nouvelles règles à votre objet `styles` à la fin de votre fichier `add-wine.tsx`.

```typescript
const styles = StyleSheet.create({
  // ... vos styles existants ...
  
  // Nouveaux styles pour le modal et le snackbar
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});
```
---

## Annexe A : Guide de Dépannage

* **`code .` ne fonctionne pas :** Utiliser la Palette de Commandes (`Shift+Cmd+P`) > `Shell Command: Install 'code' command in PATH`.
* **`ETIMEDOUT` lors d'une installation `npm` :** Problème réseau. Vérifier la connexion/proxy.
* **`expo start` se bloque sans erreur :** Le projet est dans un dossier synchronisé par un service cloud. Déplacez-le.
* **`TypeError: Manager is not a constructor` :** `import 'react-native-gesture-handler';` doit être la première ligne de `app/_layout.tsx`.
* **`Cannot find module 'shared/...'` dans VS Code :** Conflit Deno/TypeScript. Créer un `tsconfig.json` dédié dans le dossier `supabase`.
* **La fonction locale ne trouve pas les secrets (`undefined`) :** Créer `supabase/.env.local` et redémarrer le serveur, ou utiliser le flag `--env-file`.
* **`Invalid JWT` lors du test de la fonction :** Redéployez avec le flag `--no-verify-jwt`.
* **`supabase start` échoue avec des erreurs Docker :** Vérifier que Docker Desktop est lancé, vérifier l'espace disque, utiliser `docker system prune -a` pour nettoyer.

## Annexe B : Guide du Workflow Git : Fusionner une Branche (Merge)

Ce guide décrit la procédure standard et professionnelle pour intégrer le travail d'une branche de fonctionnalité (par exemple, `feature/gemini-popup`) dans votre branche principale (`main`) une fois que la fonctionnalité est terminée et testée.

### Le Principe

La fusion se fait toujours en se plaçant sur la branche qui **reçoit** les modifications. On se place sur `main` et on lui demande de "tirer" les commits de la branche de fonctionnalité.

---

### Étape 1 : Préparer votre branche de fonctionnalité

Avant de fusionner, assurez-vous que tout votre travail sur la branche de fonctionnalité est sauvegardé.

1.  **Vérifiez le statut de vos fichiers :**
    ```bash
    git status
    ```
    *(Cette commande vous montrera s'il y a des fichiers modifiés non sauvegardés).*

2.  **Sauvegardez vos changements :** Si vous avez des modifications, créez un commit.
    ```bash
    # Prépare tous les fichiers modifiés
    git add .

    # Crée un "instantané" de votre travail avec un message clair
    git commit -m "Feat: Finalisation de la fonctionnalité X"
    ```

3.  **Poussez votre branche sur GitHub :** C'est une bonne pratique pour avoir une sauvegarde en ligne avant la fusion.
    ```bash
    git push origin feature/gemini-popup
    ```

### Étape 2 : Préparer la branche `main`

Vous devez maintenant vous assurer que votre branche `main` locale est à jour avec la version sur GitHub.

1.  **Passez sur la branche `main` :**
    ```bash
    git checkout main
    ```

2.  **Récupérez les dernières modifications de `main` depuis GitHub :**
    *(Cette étape est cruciale si plusieurs personnes travaillent sur le projet pour éviter les conflits).*
    ```bash
    git pull origin main
    ```

### Étape 3 : Fusionner (Merge)

C'est l'opération principale. Vous êtes sur `main`, et vous allez y intégrer les commits de votre branche de fonctionnalité.

1.  **Lancez la commande de fusion :**
    ```bash
    git merge feature/gemini-popup
    ```
    *Le terminal affichera la liste des fichiers qui ont été mis à jour.*

### Étape 4 : Finaliser

Votre branche `main` locale est maintenant à jour. La dernière étape est de synchroniser ce changement avec GitHub.

1.  **Poussez la branche `main` fusionnée :**
    ```bash
    git push origin main
    ```

### Étape 5 : Nettoyer (Optionnel mais recommandé)

Maintenant que votre fonctionnalité est intégrée à `main`, la branche `feature/gemini-popup` n'est plus nécessaire. Vous pouvez la supprimer pour garder votre projet propre.

1.  **Supprimez la branche locale :**
    ```bash
    git branch -d feature/gemini-popup
    ```
    *(Le `-d` est une suppression "sûre" qui ne fonctionnera que si la branche a bien été fusionnée. Utilisez `-D` pour forcer la suppression).*

2.  **Supprimez la branche distante (sur GitHub) :**
    ```bash
    git push origin --delete feature/gemini-popup
    ```

Votre fonctionnalité est maintenant proprement intégrée et votre espace de travail est nettoyé.