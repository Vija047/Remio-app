import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Trash2,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { useAIStore } from '../../store/useAIStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useUserStore } from '../../store/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function ResetAIHistoryScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const resetAIData = useAIStore((s) => s.resetAIData);
  const clearHistory = useTaskStore((s) => s.clearHistory);

  const [resetPatterns, setResetPatterns] = useState(true);
  const [resetConfidence, setResetConfidence] = useState(true);
  const [clearHistoryLog, setClearHistoryLog] = useState(true);

  const shakeOffset = useSharedValue(0);

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleResetConfirm = () => {
    triggerShake();
    haptics.heavy();

    Alert.alert(
      'Confirm Permanent Reset',
      'Are you absolutely sure? All selected AI models and history logs will be wiped.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            haptics.error();
            resetAIData({
              resetPatterns,
              resetConfidence,
              clearHistory: clearHistoryLog,
            });
            if (clearHistoryLog) {
              clearHistory();
            }
            Alert.alert('AI Reset Complete', 'Your AI intelligence is now set to factory fresh state.');
            router.back();
          },
        },
      ]
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <Avatar url={user.avatarUrl} size={36} />
        </Pressable>
        <Text style={styles.headerBrand}>RoutineAI</Text>
        <Sparkles size={22} color={colors.primary} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Reset AI History</Text>
          <Text style={styles.subtitle}>
            Clear your prediction data and start fresh.
          </Text>
        </View>

        {/* Warning Alert Box */}
        <View style={styles.warningBox}>
          <AlertTriangle size={24} color={colors.primaryText} style={styles.warningIcon} />
          <Text style={styles.warningText}>
            This action cannot be undone. All learned patterns, confidence levels, and prediction windows for your tasks will be permanently deleted.
          </Text>
        </View>

        {/* Checkbox Options Card */}
        <View style={styles.checkboxCard}>
          {/* Option 1: Reset All Task Patterns */}
          <Pressable
            onPress={() => {
              haptics.light();
              setResetPatterns(!resetPatterns);
            }}
            style={styles.checkboxRow}
          >
            <Text style={styles.checkboxLabel}>Reset All Task Patterns</Text>
            <Checkbox
              checked={resetPatterns}
              onToggle={() => setResetPatterns(!resetPatterns)}
              size={24}
            />
          </Pressable>

          <View style={styles.divider} />

          {/* Option 2: Reset Global Confidence Model */}
          <Pressable
            onPress={() => {
              haptics.light();
              setResetConfidence(!resetConfidence);
            }}
            style={styles.checkboxRow}
          >
            <Text style={styles.checkboxLabel}>Reset Global Confidence Model</Text>
            <Checkbox
              checked={resetConfidence}
              onToggle={() => setResetConfidence(!resetConfidence)}
              size={24}
            />
          </Pressable>

          <View style={styles.divider} />

          {/* Option 3: Clear History Log */}
          <Pressable
            onPress={() => {
              haptics.light();
              setClearHistoryLog(!clearHistoryLog);
            }}
            style={styles.checkboxRow}
          >
            <Text style={styles.checkboxLabel}>Clear History Log</Text>
            <Checkbox
              checked={clearHistoryLog}
              onToggle={() => setClearHistoryLog(!clearHistoryLog)}
              size={24}
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* Action Footer with Animated Shake Button */}
      <View style={styles.footerArea}>
        <Animated.View style={[{ width: '100%' }, shakeStyle]}>
          <Button
            title="Reset AI Data"
            onPress={handleResetConfirm}
            variant="primary"
            size="lg"
            icon={<Trash2 size={20} color="#FFFFFF" />}
          />
        </Animated.View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
        >
          <Text style={styles.cancelText}>Cancel</Text>
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
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    padding: 2,
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
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
    lineHeight: 22,
  },
  warningBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryText,
    lineHeight: 22,
    fontWeight: '500',
  },
  checkboxCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  footerArea: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    alignItems: 'center',
    gap: 14,
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondaryText,
  },
});
