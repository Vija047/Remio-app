import React from 'react';
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
import {
  ArrowLeft,
  Sparkles,
  ListFilter,
  Calendar,
  MapPin,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Switch } from '../../components/ui/Switch';
import { Slider } from '../../components/ui/Slider';
import { Button } from '../../components/ui/Button';
import { useAIStore } from '../../store/useAIStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';

export default function LearningModeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const haptics = useHaptics();
  const learningSettings = useAIStore((s) => s.learningSettings);
  const updateLearningSettings = useAIStore((s) => s.updateLearningSettings);

  const handleResetProgress = () => {
    haptics.error();
    Alert.alert(
      'Reset Learning Weights',
      'This will reset your trained weights for task interval prediction to default heuristics.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Defaults',
          style: 'destructive',
          onPress: () => {
            updateLearningSettings({ patternDepth: 0.5 });
            Alert.alert('Success', 'Learning progress has been reset to defaults.');
          },
        },
      ]
    );
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Learning Parameters</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Configure how Routine AI analyzes completions to predict recurring dates.
          </Text>
        </View>

        {/* Continuous Learning Info Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.cardMuted,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={[styles.sparkleCircle, { backgroundColor: theme.coralLight }]}>
            <Sparkles size={20} color={theme.coral} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Adaptive Interval Regression
            </Text>
            <Text style={[styles.infoDesc, { color: theme.secondaryText }]}>
              Routine AI learns from every completion timestamp. As you record more activity, interval variance shrinks and prediction windows tighten.
            </Text>
          </View>
        </View>

        {/* Learning Config Card */}
        <View
          style={[
            styles.configCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Active Learning Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.configTitle, { color: theme.text }]}>
                Continuous Model Retraining
              </Text>
              <Text style={[styles.configSubtext, { color: theme.secondaryText }]}>
                Recalculate predictions immediately upon each completion
              </Text>
            </View>
            <Switch
              value={learningSettings.activeLearning}
              onValueChange={(val) => {
                haptics.light();
                updateLearningSettings({ activeLearning: val });
              }}
              showCheckmark
            />
          </View>

          <View style={[styles.cardDivider, { backgroundColor: theme.divider }]} />

          {/* Pattern Recognition Depth Slider */}
          <View style={styles.sliderSection}>
            <Text style={[styles.configTitle, { color: theme.text }]}>
              Pattern Recognition Depth
            </Text>
            <View style={styles.sliderWrapper}>
              <Slider
                value={learningSettings.patternDepth}
                onValueChange={(val) => updateLearningSettings({ patternDepth: val })}
              />
            </View>
            <View style={styles.sliderLabelsRow}>
              <Text style={[styles.sliderLabel, { color: theme.mutedText }]}>Fast Adapting</Text>
              <Text style={[styles.sliderLabel, { color: theme.mutedText }]}>Deep Long-Term</Text>
            </View>
          </View>
        </View>

        {/* Data Sources Section */}
        <Text style={[styles.sectionHeader, { color: theme.secondaryText }]}>
          Data Inputs
        </Text>
        <View
          style={[
            styles.dataSourcesCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          {/* Manual Completions */}
          <View style={styles.sourceItem}>
            <View style={styles.sourceLeft}>
              <ListFilter size={20} color={theme.text} />
              <View>
                <Text style={[styles.sourceTitle, { color: theme.text }]}>
                  Manual Completions
                </Text>
                <Text style={[styles.sourceSubtext, { color: theme.secondaryText }]}>
                  Direct in-app task checks (Active)
                </Text>
              </View>
            </View>
            <Switch
              value={learningSettings.manualCompletions}
              onValueChange={(val) => {
                haptics.light();
                updateLearningSettings({ manualCompletions: val });
              }}
              showCheckmark
            />
          </View>

          <View style={[styles.itemDivider, { backgroundColor: theme.divider }]} />

          {/* Calendar Sync */}
          <View style={styles.sourceItem}>
            <View style={styles.sourceLeft}>
              <Calendar size={20} color={theme.text} />
              <View>
                <Text style={[styles.sourceTitle, { color: theme.text }]}>
                  Schedule Optimization
                </Text>
                <Text style={[styles.sourceSubtext, { color: theme.secondaryText }]}>
                  Avoid scheduling during high load days
                </Text>
              </View>
            </View>
            <Switch
              value={learningSettings.calendarSync}
              onValueChange={(val) => {
                haptics.light();
                updateLearningSettings({ calendarSync: val });
              }}
              showCheckmark
            />
          </View>
        </View>

        {/* Reset Learning Progress Button */}
        <View style={styles.resetButtonWrapper}>
          <Button
            title="Reset Learning Weights"
            onPress={handleResetProgress}
            variant="secondary"
            size="lg"
          />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: radii['4xl'],
    padding: 22,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sparkleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  configCard: {
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 16,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  configSubtext: {
    fontSize: 13,
  },
  cardDivider: {
    height: 1,
    marginVertical: 18,
  },
  sliderSection: {},
  sliderWrapper: {
    marginVertical: 12,
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  dataSourcesCard: {
    borderRadius: radii['3xl'],
    borderWidth: 1,
    paddingVertical: 6,
    marginBottom: 28,
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  sourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    marginRight: 12,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sourceSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    marginLeft: 52,
  },
  resetButtonWrapper: {
    marginTop: 4,
  },
});
