import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { radii } from '../../../theme/radii';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Button } from '../../../components/ui/Button';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { useHaptics } from '../../../hooks/useHaptics';

export default function RegisterNotificationsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const setNotificationsEnabled = useOnboardingStore((s) => s.setNotificationsEnabled);
  const completeRegistration = useOnboardingStore((s) => s.completeRegistration);

  const [loading, setLoading] = useState(false);

  const handleFinish = async (enabled: boolean) => {
    try {
      setLoading(true);
      setNotificationsEnabled(enabled);
      await completeRegistration();
      haptics.success();
      router.replace('/today');
    } catch (err: any) {
      haptics.error();
      const msg = err.message || 'Could not complete registration. Please check your backend connection.';
      const isConflict = msg.toLowerCase().includes('already registered');

      Alert.alert(
        'Registration Notice',
        msg,
        isConflict
          ? [
              {
                text: 'Sign In',
                onPress: () => router.replace('/(onboarding)/login'),
              },
              { text: 'Cancel', style: 'cancel' },
            ]
          : [
              {
                text: 'Proceed to Dashboard',
                onPress: () => router.replace('/today'),
              },
              { text: 'Try Again', style: 'cancel' },
            ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header & Progress */}
      <View>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.circleBackBtn, pressed && styles.btnPressed]}
          >
            <ChevronLeft size={22} color={colors.primary} />
          </Pressable>
          <Text style={styles.stepText}>Step 4 of 4</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar (100%) */}
        <ProgressBar progress={100} height={6} color={colors.primary} style={styles.progressBar} />
      </View>

      {/* Middle Content with Mock Notification Card */}
      <View style={styles.content}>
        {/* iOS-Style Mock Notification Card */}
        <View style={styles.mockNotificationCard}>
          <View style={styles.notifHeaderRow}>
            <View style={styles.notifBrand}>
              <View style={styles.notifIconCircle}>
                <Bell size={15} color="#FFFFFF" />
              </View>
              <Text style={styles.notifAppName}>Remio</Text>
            </View>
            <Text style={styles.notifTime}>now</Text>
          </View>

          <Text style={styles.notifTitle}>Time for a Haircut? 💇</Text>
          <Text style={styles.notifBody}>
            It has been 4 weeks since your last visit. We suggest scheduling one this weekend.
          </Text>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Never miss an important{'\n'}task.</Text>
          <Text style={styles.subtitle}>
            Get proactive predictions before tasks become overdue.
          </Text>
        </View>
      </View>

      {/* Bottom CTA Buttons */}
      <View style={styles.footer}>
        <Button
          title={loading ? 'Setting up routines...' : 'Enable Notifications'}
          onPress={() => handleFinish(true)}
          size="lg"
          variant="primary"
          disabled={loading}
        />

        <Pressable
          onPress={() => !loading && handleFinish(false)}
          style={({ pressed }) => [styles.maybeLaterBtn, pressed && styles.btnPressed]}
          disabled={loading}
        >
          <Text style={styles.maybeLaterText}>Maybe Later</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockNotificationCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 44,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  notifBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifAppName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
  },
  notifTime: {
    fontSize: 13,
    color: colors.mutedText,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 6,
  },
  notifBody: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },
  footer: {
    gap: 16,
    alignItems: 'center',
  },
  maybeLaterBtn: {
    paddingVertical: 8,
  },
  maybeLaterText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondaryText,
  },
});
