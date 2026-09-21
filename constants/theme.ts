import { MD3DarkTheme } from 'react-native-paper';

export const colors = {
  page: '#0d0908',
  pageElevated: '#1a1210',
  card: '#2a1814',
  wine: '#6e0909',
  wineSoft: 'rgba(110, 9, 9, 0.28)',
  gold: '#c4a574',
  ink: '#f4ece4',
  muted: '#d5c4b5',
  soft: 'rgba(255,255,255,0.08)',
  border: 'rgba(196, 165, 116, 0.28)',
  modalBg: '#241816',
};

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.wine,
    secondary: colors.gold,
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
