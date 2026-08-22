// Suppress the development-only warning from expo-notifications in Expo Go before any modules load
if (__DEV__) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('expo-notifications: Android Push notifications')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

import '../global.css';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useUserStore } from '../store/useUserStore';
import { notificationService } from '../services/notificationService';
import { InAppNotificationBanner } from '../components/ui/InAppNotificationBanner';

LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
]);

SplashScreen.preventAutoHideAsync().catch(() => {});

import { ErrorBoundary } from '../components/ErrorBoundary';

export { ErrorBoundary };

export default function RootLayout() {
  const router = useRouter();
  const darkMode = useUserStore((s) => s.darkMode);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    notificationService.initialize().catch(() => {});

    // Listen for notification interactions / taps
    const unsubscribe = notificationService.addNotificationResponseListener((response) => {
      const data = response?.notification?.request?.content?.data;
      if (data && data.taskId) {
        router.push(`/task/${data.taskId}` as any);
      } else {
        router.push('/(tabs)/today');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style={darkMode ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: darkMode ? '#0F1117' : '#FFFFFF' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="task/[id]"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="task/add"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="ai/prediction" />
            <Stack.Screen name="ai/confidence" />
            <Stack.Screen name="ai/learning" />
            <Stack.Screen name="ai/reset" />
            <Stack.Screen name="settings/categories" />
            <Stack.Screen name="settings/notifications" />
            <Stack.Screen name="settings/language" />
            <Stack.Screen
              name="settings/premium"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="pricing"
              options={{ presentation: 'card', animation: 'slide_from_right' }}
            />
          </Stack>
          {/* Render InAppNotificationBanner AFTER Stack so it sits squarely on top */}
          <InAppNotificationBanner />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
