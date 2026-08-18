import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { colors } from '../theme/colors';

export default function Index() {
  const router = useRouter();
  const initAuth = useUserStore((s) => s.initAuth);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const isAuth = await initAuth();
      if (!isMounted) return;

      if (isAuth) {
        router.replace('/today');
      } else {
        router.replace('/(onboarding)/splash');
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

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
