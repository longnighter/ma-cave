import { MD3DarkTheme } from 'react-native-paper';

/** Shared palette — keep label / accent tokens in sync with designs/ma-cave Option D */
export const colors = {
  page: '#0d0908',
  pageElevated: '#1a1210',
  card: '#2a1814',
  /** Flat translucent card (detail header) */
  cardGlass: 'rgba(255, 255, 255, 0.08)',
  cardGlassBorder: 'rgba(255, 255, 255, 0.14)',
  wine: '#6e0909',
  /** Chip / label background */
  wineSoft: 'rgba(110, 9, 9, 0.28)',
  labelBg: 'rgba(110, 9, 9, 0.28)',
  /** Soft accent (domaine, section titles, year badge, icons) */
  gold: '#c9b48c',
  accent: '#c9b48c',
  ink: '#f4ece4',
  /** Body values + chip label text (région, cépages, apogée, notes) */
  muted: '#d5c4b5',
  labelText: '#d5c4b5',
  valueText: '#d5c4b5',
  soft: 'rgba(255,255,255,0.08)',
  border: 'rgba(201, 180, 140, 0.32)',
  modalBg: '#241816',
};

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.wine,
    secondary: colors.accent,
    background: colors.page,
    surface: colors.pageElevated,
    surfaceVariant: colors.card,
    onPrimary: '#ffffff',
    onSecondary: colors.page,
    onBackground: colors.ink,
    onSurface: colors.ink,
    onSurfaceVariant: colors.muted,
    outline: colors.border,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: colors.page,
      level1: colors.pageElevated,
      level2: colors.card,
      level3: colors.card,
      level4: colors.card,
      level5: colors.card,
    },
  },
};
