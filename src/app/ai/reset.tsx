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
import { radii } from '../../theme/radii';
import { Checkbox } from '../../components/ui/Checkbox';
import { Button } from '../../components/ui/Button';
import { useAIStore } from '../../store/useAIStore';
import { useTaskStore } from '../../store/useTaskStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function ResetAIHistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
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
      'Confirm Model Reset',
      'Are you sure? This will wipe trained AI predictive models and clear recent history logs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset AI Data',
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
            Alert.alert('AI Reset Complete', 'Your AI intelligence models have been refreshed.');
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerBrand, { color: theme.text }]}>Reset AI</Text>
        <Sparkles size={22} color={theme.coral} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Reset Prediction Data</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Clear trained models and start fresh with default heuristics.
          </Text>
        </View>

        {/* Warning Alert Box */}
        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.border,
            },
          ]}
        >
          <AlertTriangle size={24} color={theme.coral} style={styles.warningIcon} />
          <Text style={[styles.warningText, { color: theme.text }]}>
            All learned intervals and confidence models for your tasks will be reset to factory default heuristics.
          </Text>
        </View>

        {/* Checkbox Options Card */}
        <View
          style={[
            styles.checkboxCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Option 1: Reset All Task Patterns */}
          <Pressable
            onPress={() => {
              haptics.light();
              setResetPatterns(!resetPatterns);
            }}
            style={styles.checkboxRow}
          >
            <Text style={[styles.checkboxLabel, { color: theme.text }]}>
              Reset Task Pattern Weights
            </Text>
            <Checkbox
              checked={resetPatterns}
              onToggle={() => setResetPatterns(!resetPatterns)}
              size={24}
            />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Option 2: Reset Global Confidence Model */}
          <Pressable
            onPress={() => {
              haptics.light();
              setResetConfidence(!resetConfidence);
            }}
            style={styles.checkboxRow}
          >
            <Text style={[styles.checkboxLabel, { color: theme.text }]}>
              Reset Confidence Thresholds
            </Text>
            <Checkbox
              checked={resetConfidence}
              onToggle={() => setResetConfidence(!resetConfidence)}
              size={24}
            />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Option 3: Clear History Log */}
          <Pressable
            onPress={() => {
              haptics.light();
              setClearHistoryLog(!clearHistoryLog);
            }}
            style={styles.checkboxRow}
          >
            <Text style={[styles.checkboxLabel, { color: theme.text }]}>
              Clear Local Completion Logs
            </Text>
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
            title="Reset AI Models"
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
          <Text style={[styles.cancelText, { color: theme.secondaryText }]}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  warningBox: {
    borderWidth: 1.5,
    padding: 18,
    borderRadius: radii['2xl'],
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
    lineHeight: 22,
    fontWeight: '500',
  },
  checkboxCard: {
    borderRadius: radii['2xl'],
    borderWidth: 1,
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
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
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
  },
});
