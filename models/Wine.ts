export interface Wine {
  id: string;
  name: string;
  year: number;
  grape?: string; // Le '?' signifie que cette propriété est optionnelle
  region?: string;
  appellation?: string;
  bestToDrink?: [number, number]; // Un tuple de deux nombres (année de début, année de fin)
  tastingNotes?: string[];
  domain?: string;       // Un tableau de chaînes de caractères
}