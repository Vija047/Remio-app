import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Avatar } from '../../components/ui/Avatar';
import { ConfidenceLevel } from '../../types';
import { useAIStore } from '../../store/useAIStore';
import { useUserStore } from '../../store/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';

interface ConfidenceOption {
  id: ConfidenceLevel;
  title: string;
  desc: string;
}

const CONFIDENCE_OPTIONS: ConfidenceOption[] = [
  {
    id: 'precise',
    title: 'Precise (98%+)',
    desc: 'Only notifies when the prediction is near-certain.',
  },
  {
    id: 'high',
    title: 'High (90%+)',
    desc: 'The perfect balance of accuracy and foresight.',
  },
  {
    id: 'balanced',
    title: 'Balanced (75%+)',
    desc: 'More frequent suggestions with slightly lower accuracy.',
  },
  {
    id: 'experimental',
    title: 'Experimental (50%+)',
    desc: 'Get early-stage predictions as the AI learns.',
  },
];

export default function PredictionConfidenceScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const confidenceLevel = useAIStore((s) => s.confidenceLevel);
  const setConfidenceLevel = useAIStore((s) => s.setConfidenceLevel);

  const handleSelect = (level: ConfidenceLevel) => {
    haptics.light();
    setConfidenceLevel(level);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerBrand}>RoutineAI</Text>
        <Avatar url={user.avatarUrl} size={36} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Prediction Confidence</Text>
          <Text style={styles.subtitle}>
            Adjust how certain RoutineAI must be before sending a smart notification.
          </Text>
        </View>

        {/* Current Level Card */}
        <View style={styles.currentLevelCard}>
          <View style={styles.currentLeft}>
            <Text style={styles.microLabel}>CURRENT LEVEL</Text>
            <Text style={styles.currentValueTitle}>
              {confidenceLevel === 'precise'
                ? 'Precise (98%+)'
                : confidenceLevel === 'balanced'
                ? 'Balanced (75%+)'
                : confidenceLevel === 'experimental'
                ? 'Experimental (50%+)'
                : 'High (90%+)'}
            </Text>
            <Text style={styles.currentSubtitle}>
              Recommended balance of accuracy and foresight.
            </Text>
          </View>

          <View style={styles.sparkleCircle}>
            <Sparkles size={20} color={colors.primary} />
          </View>
        </View>

        {/* Radio Options List Card */}
        <View style={styles.optionsCard}>
          {CONFIDENCE_OPTIONS.map((opt, index) => {
            const isSelected = confidenceLevel === opt.id;
            return (
              <React.Fragment key={opt.id}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  onPress={() => handleSelect(opt.id)}
                  style={styles.optionRow}
                >
                  {/* Radio Indicator */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{opt.title}</Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>

        {/* Info Disclaimer Card */}
        <View style={styles.infoCard}>
          <Info size={20} color={colors.primaryText} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Higher confidence levels may result in fewer notifications but ensure higher reliability. Adjust this setting if you feel you are receiving too many incorrect suggestions or missing out on potential insights.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    padding: 6,
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
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    lineHeight: 22,
  },
  currentLevelCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['4xl'],
    padding: 22,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  currentLeft: {
    flex: 1,
    marginRight: 12,
  },
  microLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  currentValueTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  currentSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  sparkleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 16,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['3xl'],
    padding: 20,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: '#F0F0F2',
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 20,
  },
});
