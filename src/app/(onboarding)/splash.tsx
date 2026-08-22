import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { GoogleSignInButton } from '../../components/ui/GoogleSignInButton';
import { useUserStore } from '../../store/useUserStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function SplashScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const googleLogin = useUserStore((s) => s.googleLogin);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchHistory = useTaskStore((s) => s.fetchHistory);

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    haptics.light();
    Alert.prompt
      ? Alert.prompt(
          'Google Sign-In',
          'Enter your Google account email:',
          async (googleEmail) => {
            if (!googleEmail || !googleEmail.trim()) return;
            await executeGoogleAuth(googleEmail.trim());
          },
          'plain-text',
          'user@gmail.com'
        )
      : await executeGoogleAuth('google.user@routineai.com');
  };

  const executeGoogleAuth = async (googleEmail: string) => {
    try {
      setGoogleLoading(true);
      const name = googleEmail.split('@')[0].replace('.', ' ');
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

      await googleLogin({
        email: googleEmail.toLowerCase(),
        name: formattedName || 'Google User',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      });

      await Promise.all([fetchTasks(), fetchHistory()]).catch(() => {});
      haptics.success();
      router.replace('/today');
    } catch (err: any) {
      haptics.error();
      Alert.alert('Google Sign-In Error', err.message || 'Could not authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

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
        <Text style={styles.brandTitle}>Remio</Text>
        <Text style={styles.subtitle}>
          The adaptive habit manager that remembers what you usually forget.
        </Text>

        <View style={styles.actionsContainer}>
          {/* Continue with Google */}
          <GoogleSignInButton
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            loading={googleLoading}
          />

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
    minHeight: 400,
    maxHeight: 500,
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
    marginBottom: 20,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
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
