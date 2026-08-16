import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Apple, Globe } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useHaptics } from '../../hooks/useHaptics';

export default function LoginScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    haptics.success();
    router.replace('/today');
  };

  const handleSocialLogin = () => {
    haptics.light();
    router.replace('/today');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your routine.</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formArea}>
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

            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [styles.forgotPasswordBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>

            <Button
              title="Sign In"
              onPress={handleSignIn}
              size="lg"
              variant="primary"
              style={styles.signInButton}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialArea}>
              <Button
                title="Continue with Google"
                onPress={handleSocialLogin}
                variant="outline"
                size="lg"
                icon={<Globe size={20} color={colors.primary} />}
              />

              <Button
                title="Continue with Apple"
                onPress={handleSocialLogin}
                variant="primary"
                size="lg"
                icon={<Apple size={20} color="#FFFFFF" />}
              />
            </View>
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
    marginTop: 40,
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  formArea: {
    width: '100%',
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 28,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryText,
  },
  signInButton: {
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.mutedText,
  },
  socialArea: {
    gap: 14,
  },
  footerArea: {
    alignItems: 'center',
    marginTop: 32,
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
