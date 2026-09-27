export interface Wine {
  id: string;
  name: string;
  year: number;
  color: string;
  grape?: string[]; // Le '?' signifie que cette propriété est optionnelle
  region?: string;
  appellation?: string;
  bestToDrink?: [number, number]; // Un tuple de deux nombres (année de début, année de fin)
  tastingNotes?: string[];
  domain?: string;
  winePairing?: string[];   // Un tableau de chaînes de caractères
}
