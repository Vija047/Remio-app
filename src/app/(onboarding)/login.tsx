import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Sparkles } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GoogleSignInButton } from '../../components/ui/GoogleSignInButton';
import { useUserStore } from '../../store/useUserStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function LoginScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const login = useUserStore((s) => s.login);
  const googleLogin = useUserStore((s) => s.googleLogin);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchHistory = useTaskStore((s) => s.fetchHistory);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      haptics.error();
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
      await Promise.all([fetchTasks(), fetchHistory()]).catch(() => {});
      haptics.success();
      router.replace('/today');
    } catch (err: any) {
      haptics.error();
      Alert.alert('Sign In Failed', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateDemoUser = () => {
    setEmail('demo@routineai.com');
    setPassword('Routine123!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title Area */}
          <View style={styles.headerArea}>
            <View style={styles.brandBadge}>
              <Sparkles size={16} color={colors.coral} />
              <Text style={styles.brandBadgeText}>Routine AI</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to access your predicted routines.</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formArea}>
            {/* Google Sign In Button */}
            <GoogleSignInButton
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              disabled={loading}
              style={{ marginBottom: 20 }}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign in with email</Text>
              <View style={styles.dividerLine} />
            </View>

            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.secondaryText} />}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={<Lock size={20} color={colors.secondaryText} />}
            />

            <View style={styles.optionsRow}>
              <Pressable
                onPress={handleCreateDemoUser}
                style={({ pressed }) => [styles.demoBtn, pressed && styles.btnPressed]}
              >
                <Text style={styles.demoBtnText}>Fill Demo Credentials</Text>
              </Pressable>
            </View>

            <Button
              title={loading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              size="lg"
              variant="primary"
              disabled={loading || googleLoading}
              style={styles.signInButton}
            />
          </View>

          {/* Footer Register Link */}
          <View style={styles.footerArea}>
            <Pressable
              onPress={() => router.push('/(onboarding)/register/name')}
              style={({ pressed }) => [styles.registerLink, pressed && styles.btnPressed]}
            >
              <Text style={styles.footerText}>
                Don't have an account? <Text style={styles.footerHighlight}>Create One</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF0ED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    marginBottom: 16,
  },
  brandBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.coral,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  formArea: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: colors.mutedText,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  demoBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  demoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.coral,
  },
  signInButton: {
    marginBottom: 16,
  },
  footerArea: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 8,
  },
  registerLink: {
    paddingVertical: 8,
  },
  btnPressed: {
    opacity: 0.7,
  },
  footerText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  footerHighlight: {
    color: colors.primaryText,
    fontWeight: '700',
  },
});
