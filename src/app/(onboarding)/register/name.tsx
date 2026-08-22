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
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    const trimmedName = inputName.trim();
    const trimmedEmail = inputEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      newErrors.name = 'Please enter your name';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!inputPassword) {
      newErrors.password = 'Please create a password';
    } else if (inputPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) {
      haptics.error();
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
        photoUrl: '',
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
            <ProgressBar progress={25} height={6} color={colors.primary} style={styles.progressBar} />

            {/* Content Area */}
            <View style={styles.content}>
              <Text style={styles.title}>Let's create your account</Text>
              <Text style={styles.subtitle}>This allows Routine AI to learn and sync your routines.</Text>

              {/* Google Sign-Up Button */}
              <GoogleSignInButton
                title="Sign up with Google"
                onPress={handleGoogleSignUp}
                loading={googleLoading}
                style={{ marginBottom: 22 }}
              />

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with email</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputSection}>
                <Input
                  label="Your Name"
                  placeholder="Enter your name"
                  value={inputName}
                  onChangeText={(val) => {
                    setInputName(val);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  leftIcon={<User size={20} color={colors.secondaryText} />}
                  error={errors.name}
                  autoCapitalize="words"
                />

                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  value={inputEmail}
                  onChangeText={(val) => {
                    setInputEmail(val);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon={<Mail size={20} color={colors.secondaryText} />}
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="Create a password"
                  helperText={!errors.password ? 'Minimum 8 characters' : undefined}
                  value={inputPassword}
                  onChangeText={(val) => {
                    setInputPassword(val);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  isPassword
                  leftIcon={<Lock size={20} color={colors.secondaryText} />}
                  error={errors.password}
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
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
    marginTop: 14,
    marginBottom: 20,
  },
  content: {
    paddingTop: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    lineHeight: 34,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 20,
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
    color: colors.secondaryText,
    fontWeight: '600',
  },
  inputSection: {
    marginTop: 2,
    gap: 4,
  },
  footer: {
    paddingTop: 16,
  },
});
