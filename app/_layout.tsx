import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { I18nextProvider } from 'react-i18next';
import 'react-native-reanimated';
import i18n from '@/i18n';
import { UserDataProvider, useUserData } from '@/store/UserDataContext';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

function OnboardingGate() {
  const { ready, data } = useUserData();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const first = segments[0];
    const onOnboarding = first === 'onboarding';
    if (!data && !onOnboarding) {
      router.replace('/onboarding');
    } else if (data && onOnboarding) {
      router.replace('/(tabs)');
    }
  }, [ready, data, segments, router]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <I18nextProvider i18n={i18n}>
        <UserDataProvider>
          <OnboardingGate />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
          </Stack>
          <StatusBar style="dark" />
        </UserDataProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}
