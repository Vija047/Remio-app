import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { radii } from '../../../theme/radii';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Button } from '../../../components/ui/Button';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { useHaptics } from '../../../hooks/useHaptics';

const CATEGORY_TAGS = [
  { id: 'haircuts', name: 'Haircuts' },
  { id: 'medicines', name: 'Medicines' },
  { id: 'car_service', name: 'Car Service' },
  { id: 'water_filters', name: 'Water Filters' },
  { id: 'bills', name: 'Bills' },
  { id: 'plant_watering', name: 'Plant Watering' },
  { id: 'pet_care', name: 'Pet Care' },
  { id: 'exercise', name: 'Exercise' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'documents', name: 'Documents' },
  { id: 'home_maintenance', name: 'Home Maintenance' },
  { id: 'dental_checkups', name: 'Dental Checkups' },
];

export default function RegisterCategoriesScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const selectedCategories = useOnboardingStore((s) => s.selectedCategories);
  const toggleCategory = useOnboardingStore((s) => s.toggleCategory);

  const handleContinue = () => {
    haptics.light();
    router.push('/(onboarding)/register/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Navigation */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.circleBackBtn, pressed && styles.btnPressed]}
          >
            <ChevronLeft size={22} color={colors.primary} />
          </Pressable>
          <Text style={styles.stepText}>Step 3 of 4</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar (75%) */}
        <ProgressBar progress={75} height={6} color={colors.primary} style={styles.progressBar} />

        {/* Content Area */}
        <View style={styles.content}>
          <Text style={styles.title}>What do you want help{'\n'}remembering?</Text>
          <Text style={styles.subtitle}>
            Select all that apply to personalize your routine.
          </Text>

          {/* Tag Pills Grid */}
          <View style={styles.tagsContainer}>
            {CATEGORY_TAGS.map((tag) => {
              const isSelected = selectedCategories.includes(tag.id);
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => {
                    haptics.light();
                    toggleCategory(tag.id);
                  }}
                  style={[
                    styles.tagPill,
                    isSelected ? styles.tagPillSelected : styles.tagPillUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected ? styles.tagTextSelected : styles.tagTextUnselected,
                    ]}
                  >
                    {tag.name}
                  </Text>
                  {isSelected && (
                    <Check
                      size={16}
                      color={colors.primary}
                      strokeWidth={2.5}
                      style={styles.checkIcon}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Bottom CTA Button */}
        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            size="lg"
            variant="primary"
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
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 28,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 32,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: radii.full,
    borderWidth: 1.5,
  },
  tagPillSelected: {
    backgroundColor: '#F3F4F6',
    borderColor: colors.primary,
  },
  tagPillUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  tagText: {
    fontSize: 15,
    fontWeight: '700',
  },
  tagTextSelected: {
    color: colors.primaryText,
  },
  tagTextUnselected: {
    color: colors.secondaryText,
  },
  checkIcon: {
    marginLeft: 6,
  },
  footer: {
    paddingTop: 24,
  },
});
