import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { colors } from '../theme/colors';

export default function Index() {
  const router = useRouter();
  const isOnboardingCompleted = useOnboardingStore((s) => s.isOnboardingCompleted);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOnboardingCompleted) {
        router.replace('/today');
      } else {
        router.replace('/(onboarding)/splash');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOnboardingCompleted]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
