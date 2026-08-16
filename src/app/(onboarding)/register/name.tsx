import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { useHaptics } from '../../../hooks/useHaptics';

export default function RegisterNameScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const name = useOnboardingStore((s) => s.name);
  const setName = useOnboardingStore((s) => s.setName);

  const [inputName, setInputName] = useState(name || '');

  const handleContinue = () => {
    haptics.light();
    setName(inputName.trim() || 'Vijay');
    router.push('/(onboarding)/register/lifestyle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'space-between' }}
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
            <Text style={styles.title}>Let's personalize{'\n'}RoutineAI</Text>
            <Text style={styles.subtitle}>This helps us make smarter predictions.</Text>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What's your name?</Text>
              <Input
                placeholder="Enter your preferred name"
                value={inputName}
                onChangeText={setInputName}
                leftIcon={<User size={20} color={colors.secondaryText} />}
                autoFocus
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    marginBottom: 32,
  },
  content: {
    paddingTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 36,
  },
  inputSection: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 12,
  },
  footer: {
    paddingTop: 16,
  },
});
