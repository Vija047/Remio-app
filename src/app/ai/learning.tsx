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
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Switch } from '../../components/ui/Switch';
import { Slider } from '../../components/ui/Slider';
import { Button } from '../../components/ui/Button';
import { useAIStore } from '../../store/useAIStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function LearningModeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const learningSettings = useAIStore((s) => s.learningSettings);
  const updateLearningSettings = useAIStore((s) => s.updateLearningSettings);

  const handleResetProgress = () => {
    haptics.error();
    Alert.alert(
      'Reset Learning Progress',
      'This will reset your trained weights for task interval prediction.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.btnPressed]}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Learning Mode</Text>
          <Text style={styles.subtitle}>
            Configure how the AI analyzes your behavior to predict your routine.
          </Text>
        </View>

        {/* Continuous Learning Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.sparkleCircle}>
            <Sparkles size={20} color={colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Continuous Learning</Text>
            <Text style={styles.infoDesc}>
              Learning Mode improves over time as you log more tasks. The more consistent you are, the better the predictions.
            </Text>
          </View>
        </View>

        {/* Learning Config Card */}
        <View style={styles.configCard}>
          {/* Active Learning Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextCol}>
              <Text style={styles.configTitle}>Active Learning</Text>
              <Text style={styles.configSubtext}>
                Allow AI to analyze completion patterns
              </Text>
            </View>
            <Switch
              value={learningSettings.activeLearning}
              onValueChange={(val) => updateLearningSettings({ activeLearning: val })}
            />
          </View>

          <View style={styles.cardDivider} />

          {/* Pattern Recognition Depth Slider */}
          <View style={styles.sliderSection}>
            <Text style={styles.configTitle}>Pattern Recognition Depth</Text>
            <View style={styles.sliderWrapper}>
              <Slider
                value={learningSettings.patternDepth}
                onValueChange={(val) => updateLearningSettings({ patternDepth: val })}
              />
            </View>
            <View style={styles.sliderLabelsRow}>
              <Text style={styles.sliderLabel}>Shallow</Text>
              <Text style={styles.sliderLabel}>Deep</Text>
            </View>
          </View>
        </View>

        {/* Data Sources Section */}
        <Text style={styles.sectionHeader}>Data Sources</Text>
        <View style={styles.dataSourcesCard}>
          {/* Manual Completions */}
          <View style={styles.sourceItem}>
            <View style={styles.sourceLeft}>
              <ListFilter size={20} color={colors.primaryText} />
              <View>
                <Text style={styles.sourceTitle}>Manual Completions</Text>
                <Text style={styles.sourceSubtext}>Always on</Text>
              </View>
            </View>
            <Switch
              value={learningSettings.manualCompletions}
              onValueChange={(val) => updateLearningSettings({ manualCompletions: val })}
            />
          </View>

          <View style={styles.itemDivider} />

          {/* Calendar Sync */}
          <View style={styles.sourceItem}>
            <View style={styles.sourceLeft}>
              <Calendar size={20} color={colors.primaryText} />
              <View>
                <Text style={styles.sourceTitle}>Calendar Sync</Text>
                <Text style={styles.sourceSubtext}>Contextual scheduling</Text>
              </View>
            </View>
            <Switch
              value={learningSettings.calendarSync}
              onValueChange={(val) => updateLearningSettings({ calendarSync: val })}
            />
          </View>

          <View style={styles.itemDivider} />

          {/* Location Habits */}
          <View style={styles.sourceItem}>
            <View style={styles.sourceLeft}>
              <MapPin size={20} color={colors.primaryText} />
              <View>
                <Text style={styles.sourceTitle}>Location Habits</Text>
                <Text style={styles.sourceSubtext}>Geofenced triggers</Text>
              </View>
            </View>
            <Switch
              value={learningSettings.locationHabits}
              onValueChange={(val) => updateLearningSettings({ locationHabits: val })}
            />
          </View>
        </View>

        {/* Reset Learning Progress Button */}
        <View style={styles.resetButtonWrapper}>
          <Button
            title="Reset Learning Progress"
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
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
    fontSize: 30,
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
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: radii['4xl'],
    padding: 22,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#F0F0F2',
    marginBottom: 20,
  },
  sparkleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primaryText,
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: colors.primaryText,
    marginBottom: 4,
  },
  configSubtext: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
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
    color: colors.secondaryText,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 12,
    marginLeft: 4,
  },
  dataSourcesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
  },
  sourceSubtext: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 52,
  },
  resetButtonWrapper: {
    marginTop: 4,
  },
});
