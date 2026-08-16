import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Hero Visual Area - Large Clean SVG Vector */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroContainer}>
          <Image
            source={require('../../../assets/onboarding-images/saplshscreen.svg')}
            style={styles.splashImage}
            contentFit="contain"
          />
        </View>
      </View>

      {/* Content & Action Area */}
      <View style={styles.contentArea}>
        <Text style={styles.brandTitle}>RoutineAI</Text>
        <Text style={styles.subtitle}>
          The AI that remembers what you usually forget.
        </Text>

        <View style={styles.actionsContainer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(onboarding)/onboarding')}
            size="lg"
            variant="primary"
          />

          <Pressable
            onPress={() => router.push('/(onboarding)/login')}
            style={({ pressed }) => [styles.loginLink, pressed && styles.linkPressed]}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  heroContainer: {
    width: '100%',
    height: '100%',
    minHeight: 420,
    maxHeight: 520,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
  contentArea: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
    marginBottom: 24,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  loginLink: {
    paddingVertical: 6,
  },
  linkPressed: {
    opacity: 0.7,
  },
  loginText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  loginHighlight: {
    color: colors.primaryText,
    fontWeight: '600',
  },
});
