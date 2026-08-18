import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Lock } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { radii } from '../../../theme/radii';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { GoogleSignInButton } from '../../../components/ui/GoogleSignInButton';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { useUserStore } from '../../../store/useUserStore';
import { useTaskStore } from '../../../store/useTaskStore';
import { useHaptics } from '../../../hooks/useHaptics';

export default function RegisterNameScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const name = useOnboardingStore((s) => s.name);
  const email = useOnboardingStore((s) => s.email);
  const password = useOnboardingStore((s) => s.password);
  const setName = useOnboardingStore((s) => s.setName);
  const setEmail = useOnboardingStore((s) => s.setEmail);
  const setPassword = useOnboardingStore((s) => s.setPassword);

  const googleLogin = useUserStore((s) => s.googleLogin);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const fetchHistory = useTaskStore((s) => s.fetchHistory);

  const [inputName, setInputName] = useState(name || '');
  const [inputEmail, setInputEmail] = useState(email || '');
  const [inputPassword, setInputPassword] = useState(password || '');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleContinue = () => {
    if (!inputName.trim()) {
      haptics.error();
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }
    if (!inputEmail.trim()) {
      haptics.error();
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }
    if (!inputPassword.trim() || inputPassword.length < 6) {
      haptics.error();
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    haptics.light();
    setName(inputName.trim());
    setEmail(inputEmail.trim().toLowerCase());
    setPassword(inputPassword);
    router.push('/(onboarding)/register/lifestyle');
  };

  const handleGoogleSignUp = async () => {
    haptics.light();
    Alert.prompt
      ? Alert.prompt(
          'Google Sign-Up',
          'Enter your Google account email:',
          async (googleEmail) => {
            if (!googleEmail || !googleEmail.trim()) return;
            await executeGoogleAuth(googleEmail.trim());
          },
          'plain-text',
          'new.user@gmail.com'
        )
      : await executeGoogleAuth('google.user@routineai.com');
  };

  const executeGoogleAuth = async (googleEmail: string) => {
    try {
      setGoogleLoading(true);
      const extractedName = googleEmail.split('@')[0].replace('.', ' ');
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

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
      Alert.alert('Google Sign-Up Error', err.message || 'Could not authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
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
          <View>
            {/* Header Navigation */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.circleBackBtn, pressed && styles.btnPressed]}
              >
                <ChevronLeft size={22} color={colors.primary} />
              </Pressable>
              <Text style={styles.stepText}>Step 1 of 4</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Progress Bar (25%) */}
            <ProgressBar progress={25} height={4} color={colors.primary} style={styles.progressBar} />

            {/* Content Area */}
            <View style={styles.content}>
              <Text style={styles.title}>Let's create your{'\n'}account</Text>
              <Text style={styles.subtitle}>This allows Routine AI to learn and sync your routines.</Text>

              {/* Google Sign-Up Button */}
              <GoogleSignInButton
                title="Sign up with Google"
                onPress={handleGoogleSignUp}
                loading={googleLoading}
                style={{ marginBottom: 16 }}
              />

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with email</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Your Name</Text>
                <Input
                  placeholder="Enter your name"
                  value={inputName}
                  onChangeText={setInputName}
                  leftIcon={<User size={20} color={colors.secondaryText} />}
                />

                <Text style={styles.inputLabel}>Email Address</Text>
                <Input
                  placeholder="name@example.com"
                  value={inputEmail}
                  onChangeText={setInputEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Mail size={20} color={colors.secondaryText} />}
                />

                <Text style={styles.inputLabel}>Password</Text>
                <Input
                  placeholder="Create a password (min 6 chars)"
                  value={inputPassword}
                  onChangeText={setInputPassword}
                  isPassword
                  leftIcon={<Lock size={20} color={colors.secondaryText} />}
                />
              </View>
            </View>
          </View>

          {/* Bottom CTA Button */}
          <View style={styles.footer}>
            <Button
              title="Continue →"
              onPress={handleContinue}
              size="lg"
              variant="primary"
            />
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
    paddingBottom: 24,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  circleBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#F0F0F2',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.7,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  placeholder: {
    width: 44,
  },
  progressBar: {
    marginTop: 16,
    marginBottom: 20,
  },
  content: {
    paddingTop: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
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
  inputSection: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 8,
    marginTop: 4,
  },
  footer: {
    paddingTop: 20,
  },
});
