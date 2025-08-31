import React, { createContext, ReactNode, useContext, useState } from 'react';
import { mockWines } from '../constants/mockData';
import { Wine } from '../models/Wine';

// 1. Définir la "forme" de notre contexte
interface WineContextType {
  wines: Wine[];
  addWine: (wine: Wine) => void;
}

// 2. Créer le contexte avec une valeur par défaut
const WineContext = createContext<WineContextType | undefined>(undefined);

// 3. Créer le Fournisseur de contexte
export const WineProvider = ({ children }: { children: ReactNode }) => {
  const [wines, setWines] = useState<Wine[]>(mockWines);

  const addWine = (wine: Wine) => {
    setWines(currentWines => [wine, ...currentWines]); // Ajoute le nouveau vin au début de la liste
  };

  return (
    <WineContext.Provider value={{ wines, addWine }}>
      {children}
    </WineContext.Provider>
  );
};

// 4. Créer un "hook" personnalisé pour utiliser facilement notre contexte
export const useWines = () => {
  const context = useContext(WineContext);
  if (context === undefined) {
    throw new Error('useWines must be used within a WineProvider');
  }
  return context;
};