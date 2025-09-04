import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // On importe notre client Supabase
import { Wine } from '../models/Wine';

interface WineContextType {
  wines: Wine[];
  addWine: (wine: Omit<Wine, 'id'>) => Promise<void>; // La fonction est maintenant asynchrone
  loading: boolean;
}

const WineContext = createContext<WineContextType | undefined>(undefined);

export const WineProvider = ({ children }: { children: ReactNode }) => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .order('created_at', { ascending: false }); // Pour avoir les plus récents en premier

      if (error) {
        console.error("Erreur lors de la récupération des vins", error);
      } else if (data) {
        // Transformation des données de la BDD vers notre interface
        const formattedWines = data.map(wine => ({
          ...wine,
          bestToDrink: [wine.drink_from, wine.drink_to],
          tastingNotes: wine.tasting_notes,
        }));
        setWines(formattedWines);
      }
      setLoading(false);
    };

    fetchWines();
  }, []);

  const addWine = async (wineToAdd: Wine) => {
    const { data, error } = await supabase
      .from('wines')
      .insert({ 
        id: wineToAdd.id, 
        name: wineToAdd.name,
        year: wineToAdd.year,
        region: wineToAdd.region,
        grape: wineToAdd.grape,
        drink_from: wineToAdd.bestToDrink?.[0],
        drink_to: wineToAdd.bestToDrink?.[1],
        tasting_notes: wineToAdd.tastingNotes,
       })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du vin", error);
    } 
    else if (data) {
      const newWineFormatted = {
        ...data,
        bestToDrink: [data.drink_from, data.drink_to],
        tastingNotes: data.tasting_notes,
      };
      setWines(currentWines => [newWineFormatted, ...currentWines]);
    }
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