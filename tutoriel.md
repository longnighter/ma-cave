# Guide de Développement : Créez votre Sommelier Numérique

*Un tutoriel pour construire une application de gestion de cave à vin avec React Native, Supabase et Gemini.*

**Version : 0.7**
**Dernière mise à jour :** 30 août 2025

---

## Introduction : Le Projet

L'objectif de ce projet est de développer une application mobile multiplateforme (iOS et Android) pour gérer une cave à vin personnelle. Cette application, que nous appellerons "ma-cave", a pour but de :
1.  **Cataloguer ses vins :** Garder une base de données de tous les vins en sa possession.
2.  **Obtenir des fiches de dégustation :** Utiliser l'API de l'IA Gemini pour générer des informations détaillées.
3.  **Gérer les stocks :** Suivre le nombre de bouteilles restantes pour chaque vin.
4.  **Scanner les étiquettes :** (Fonctionnalité avancée) Ajouter un vin en scannant son étiquette.
5.  **Interagir avec un sommelier IA :** Poser des questions en langage naturel sur le vin.

Ce guide documentera chaque étape du processus, des choix technologiques à la mise en production.

---

## Chapitre 1 : Les Fondations - Choix Technologiques et Environnement

### 1.1. La Philosophie "Backend-as-a-Service"

Nous adoptons une architecture moderne et efficace :
* **Frontend (Application Mobile) :** **React Native** avec **Expo**.
* **Backend & Base de Données :** **Supabase**. Cette plateforme nous fournira une base de données PostgreSQL, une API auto-générée, un système d'authentification et du stockage de fichiers.

### 1.2. Prérequis Logiciels (Votre "Terroir" Numérique)

Pour commencer ce projet sur votre **MacBook Pro M1**, vous devrez installer :
1.  **Visual Studio Code (VS Code)**
2.  **Node.js** (qui inclut npm et npx)
3.  **Android Studio** (pour le SDK Android et l'émulateur)
4.  **Git**
5.  **Un compte GitHub**

### 1.3. La Structure des Fichiers de l'Application

Voici la structure de dossiers que nous adopterons :
```
ma-cave/
|-- assets/
|-- components/
|-- constants/
|-- models/
|-- navigation/
|-- screens/
|-- services/
|-- utils/
|-- App.js
```
---

## Chapitre 2 : Installation de l'Environnement de Développement

### Étape 1 : Installer Homebrew
Ouvrez le **Terminal** et exécutez :
```bash
/bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh))"
```

### Étape 2 : Installer Node.js et Git
Dans une nouvelle fenêtre de Terminal :
```bash
brew install node
brew install git
```

### Étape 3 : Installer Visual Studio Code
Téléchargez la version **"Apple Silicon"** depuis le [site officiel de VS Code](https://code.visualstudio.com/).

### Étape 4 : Installer Android Studio et configurer l'émulateur
1.  **Téléchargement :** Prenez la version **"Mac with Apple chip"** sur le [site d'Android Studio](https://developer.android.com/studio).
2.  **Installation :** Lancez l'application et choisissez l'installation **"Standard"**.
3.  **Création d'un émulateur :** Via **More Actions > Virtual Device Manager**, créez un nouvel appareil virtuel (ex: Pixel 7 Pro).

### 2.1. Note du Sommelier : Émulateur vs. Téléphone Réel
* **L'émulateur** est votre outil de travail principal pour des tests rapides et de compatibilité.
* **L'application Expo Go sur votre téléphone** est indispensable pour valider les performances réelles et les fonctionnalités matérielles (caméra, etc.).
La meilleure pratique est d'utiliser les deux.

---
## Chapitre 3 : Création du Projet et Versionnage avec Git

### Note du Sommelier : La Fin de `expo-cli` et l'Avènement de `npx`
Nous utilisons `npx` (Node Package Execute) pour lancer les commandes Expo. Cela permet d'utiliser la version des outils qui est installée localement dans le projet, ce qui est plus stable et moderne.

### Étape 1 : Créer l'application
1.  Ouvrez le **Terminal** et naviguez vers votre dossier de travail (ex: `cd ~/Projets`).
2.  Lancez la commande de création :
    ```bash
    npx create-expo-app ma-cave
    ```
3.  Une fois l'installation terminée, naviguez dans le dossier du projet :
    ```bash
    cd ma-cave
    ```
4.  Ouvrez le projet dans VS Code :
    ```bash
    code .
    ```

### Étape 2 : Mettre le projet sur Git et GitHub
1.  **Initialisez Git en local** (dans le terminal de VS Code) :
    ```bash
    git init
    ```
2.  **Créez un dépôt vierge sur GitHub.com** nommé `ma-cave`. N'initialisez pas avec un README ou d'autres fichiers.
3.  **Connectez votre projet local à GitHub :**
    ```bash
    git remote add origin [https://github.com/VOTRE_NOM_UTILISATEUR/ma-cave.git](https://github.com/VOTRE_NOM_UTILISATEUR/ma-cave.git)
    git branch -M main
    ```
4.  **Envoyez vos fichiers sur GitHub (premier "push") :**
    ```bash
    git add .
    git commit -m "Initial commit: projet 'ma-cave' créé avec Expo"
    git push -u origin main
    ```

### Le Moment Magique : Lancer l'Application
Dans le terminal de VS Code, tapez :
```bash
npx expo start
```
Scannez le QR code avec l'application **Expo Go** sur votre téléphone, ou appuyez sur `a` dans le terminal pour lancer l'émulateur Android.