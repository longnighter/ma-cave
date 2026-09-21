import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { paperTheme } from '../constants/theme';
import { WineProvider } from '../context/WineContext';

export default function RootLayout() {
  return (
    <WineProvider>
      <PaperProvider
        theme={paperTheme}
        settings={{
          icon: (props) => <MaterialCommunityIcons {...props} />,
        }}
      >
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: paperTheme.colors.surface },
            headerTintColor: paperTheme.colors.onSurface,
            contentStyle: { backgroundColor: paperTheme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PaperProvider>
    </WineProvider>
  );
}
