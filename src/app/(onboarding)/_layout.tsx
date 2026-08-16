import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register/name" />
      <Stack.Screen name="register/lifestyle" />
      <Stack.Screen name="register/categories" />
      <Stack.Screen name="register/notifications" />
    </Stack>
  );
}
