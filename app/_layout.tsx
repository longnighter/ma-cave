import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { WineProvider } from '../context/WineContext';

export default function RootLayout() {
  return (
    <WineProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </WineProvider> // 2. Ne pas oublier de fermer la balise
  );
}