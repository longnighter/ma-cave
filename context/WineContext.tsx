import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // On importe notre client Supabase
import { Wine } from '../models/Wine';

interface WineContextType {
  wines: Wine[];
  addWine: (wine: Omit<Wine, "id">) => Promise<boolean>; // La fonction est maintenant asynchrone
  deleteWines: (ids: string[]) => Promise<boolean>;
  loading: boolean;
}

const WineContext = createContext<WineContextType | undefined>(undefined);

/** Map a Supabase wines row (snake_case) to the app Wine shape (camelCase). */
const formatWine = (row: any): Wine => ({
  ...row,
  bestToDrink: [row.drink_from, row.drink_to],
  tastingNotes: row.tasting_notes,
  winePairing: row.wine_pairing,
});

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
        setWines(data.map(formatWine));
      }
      setLoading(false);
    };

    fetchWines();
  }, []);

  const addWine = async (wineToAdd: Omit< Wine, "id">) => {
    const { data, error } = await supabase
      .from('wines')
      .insert({
        name: wineToAdd.name,
        year: wineToAdd.year,
        region: wineToAdd.region,
        grape: wineToAdd.grape,
        drink_from: wineToAdd.bestToDrink?.[0],
        drink_to: wineToAdd.bestToDrink?.[1],
        tasting_notes: wineToAdd.tastingNotes,
        appellation: wineToAdd.appellation,
        wine_pairing: wineToAdd.winePairing,
        domain: wineToAdd.domain
       })
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du vin", error);
      return false
    }
    else if (data) {
      setWines((currentWines) => [formatWine(data), ...currentWines]);
      return true
    }
    return false
  };
  const deleteWines = async (ids: string[]) => {
    if (ids.length === 0) return false;

    const { error } = await supabase
      .from('wines')
      .delete()
      .in('id', ids);

    if (error) {
      console.error("Erreur lors de la suppression", error);
      return false;
    }

    setWines((current) => current.filter((w) => !ids.includes(w.id)));
    return true;
  }

  return (
    <WineContext.Provider value={{ wines, addWine, loading, deleteWines }}>
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
