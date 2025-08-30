import { Stack } from 'expo-router';
import 'react-native-gesture-handler'; // Correctif du bug, doit être la toute première ligne.
import { Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}