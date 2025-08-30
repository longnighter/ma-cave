export interface Wine {
  id: string;
  name: string;
  year: number;
  grape?: string; // Le '?' signifie que cette propriété est optionnelle
  region?: string;
  bestToDrink?: [number, number]; // Un tuple de deux nombres (année de début, année de fin)
  tastingNotes?: string[];       // Un tableau de chaînes de caractères
}