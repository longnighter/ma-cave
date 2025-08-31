import { Wine } from "../models/Wine";

export const mockWines: Wine[] = [
  {
    id: '1',
    name: 'Château Margaux',
    year: 1982,
    region: 'Bordeaux',
    bestToDrink: [2010, 2040],
    tastingNotes: ['Cèdre', 'Cassis', 'Tabac blond']
  },
  {
    id: '2',
    name: 'Domaine de la Romanée-Conti',
    year: 2005,
    region: 'Bourgogne',
    bestToDrink: [2025, 2060],
    tastingNotes: ['Fruits rouges', 'Sous-bois', 'Rose fanée']
  },
  {
    id: '3',
    name: 'Clos Rougeard',
    year: 2010,
    region: 'Loire',
    tastingNotes: ['Framboise', 'Poivron', 'Graphite']
  },
];