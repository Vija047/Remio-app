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
import { ArrowLeft, Sparkles, Info } from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { ConfidenceLevel } from '../../types';
import { useAIStore } from '../../store/useAIStore';
import { useTheme } from '../../hooks/useTheme';
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
    desc: 'Only alerts when predictive accuracy is near certain.',
  },
  {
    id: 'high',
    title: 'High (90%+)',
    desc: 'The optimal balance of accuracy and foresight.',
  },
  {
    id: 'balanced',
    title: 'Balanced (75%+)',
    desc: 'More frequent proactive suggestions.',
  },
  {
    id: 'experimental',
    title: 'Experimental (50%+)',
    desc: 'Early-stage suggestions as the model trains on your completions.',
  },
];

export default function PredictionConfidenceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const confidenceLevel = useAIStore((s) => s.confidenceLevel);
  const setConfidenceLevel = useAIStore((s) => s.setConfidenceLevel);

  const handleSelect = (level: ConfidenceLevel) => {
    haptics.light();
    setConfidenceLevel(level);
  };

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
        <Text style={[styles.headerBrand, { color: theme.text }]}>Confidence</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Prediction Confidence</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Adjust how certain Routine AI must be before triggering smart reminders.
          </Text>
        </View>

        {/* Current Level Card */}
        <View
          style={[
            styles.currentLevelCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.currentLeft}>
            <Text style={[styles.microLabel, { color: theme.mutedText }]}>
              CURRENT LEVEL
            </Text>
            <Text style={[styles.currentValueTitle, { color: theme.text }]}>
              {confidenceLevel === 'precise'
                ? 'Precise (98%+)'
                : confidenceLevel === 'balanced'
                ? 'Balanced (75%+)'
                : confidenceLevel === 'experimental'
                ? 'Experimental (50%+)'
                : 'High (90%+)'}
            </Text>
            <Text style={[styles.currentSubtitle, { color: theme.secondaryText }]}>
              Adaptive confidence threshold applied to routine dates.
            </Text>
          </View>

          <View style={[styles.sparkleCircle, { backgroundColor: theme.coralLight }]}>
            <Sparkles size={20} color={theme.coral} />
          </View>
        </View>

        {/* Radio Options List Card */}
        <View
          style={[
            styles.optionsCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {CONFIDENCE_OPTIONS.map((opt, index) => {
            const isSelected = confidenceLevel === opt.id;
            return (
              <React.Fragment key={opt.id}>
                {index > 0 && (
                  <View style={[styles.divider, { backgroundColor: theme.divider }]} />
                )}
                <Pressable
                  onPress={() => handleSelect(opt.id)}
                  style={styles.optionRow}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: isSelected ? theme.coral : theme.border },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: theme.coral },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: theme.text }]}>
                      {opt.title}
                    </Text>
                    <Text style={[styles.optionDesc, { color: theme.secondaryText }]}>
                      {opt.desc}
                    </Text>
                  </View>
                </Pressable>
              </React.Fragment>
            );
          })}
        </View>

        {/* Info Disclaimer Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Info size={20} color={theme.coral} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: theme.secondaryText }]}>
            Higher confidence levels require more task completions to train the model, ensuring rock-solid precision before sending alerts.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  placeholder: {
    width: 36,
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
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  currentLevelCard: {
    borderRadius: radii['4xl'],
    padding: 22,
    borderWidth: 1,
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
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  currentValueTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  currentSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sparkleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
  },
  infoCard: {
    borderRadius: radii['3xl'],
    padding: 20,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});
