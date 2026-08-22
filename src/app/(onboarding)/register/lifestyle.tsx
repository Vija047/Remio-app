import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  BookOpen,
  Briefcase,
  Heart,
  Terminal,
  TrendingUp,
  Sun,
  Check,
} from 'lucide-react-native';
import { colors } from '../../../theme/colors';
import { radii } from '../../../theme/radii';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { Button } from '../../../components/ui/Button';
import { useOnboardingStore } from '../../../store/useOnboardingStore';
import { useHaptics } from '../../../hooks/useHaptics';

const AGE_GROUPS = ['18–24', '25–34', '35–44', '45–54', '55+'];

interface LifestyleOption {
  id: string;
  name: string;
  icon: (props: { color: string; size: number }) => React.ReactNode;
}

const LIFESTYLE_OPTIONS: LifestyleOption[] = [
  {
    id: 'student',
    name: 'Student',
    icon: ({ color, size }) => <BookOpen size={size} color={color} />,
  },
  {
    id: 'working_pro',
    name: 'Working Professional',
    icon: ({ color, size }) => <Briefcase size={size} color={color} />,
  },
  {
    id: 'parent',
    name: 'Parent',
    icon: ({ color, size }) => <Heart size={size} color={color} />,
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    icon: ({ color, size }) => <Terminal size={size} color={color} />,
  },
  {
    id: 'business_owner',
    name: 'Business Owner',
    icon: ({ color, size }) => <TrendingUp size={size} color={color} />,
  },
  {
    id: 'retired',
    name: 'Retired',
    icon: ({ color, size }) => <Sun size={size} color={color} />,
  },
];

export default function RegisterLifestyleScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const storedAge = useOnboardingStore((s) => s.ageGroup);
  const storedLifestyle = useOnboardingStore((s) => s.lifestyle);
  const setAgeGroup = useOnboardingStore((s) => s.setAgeGroup);
  const setLifestyle = useOnboardingStore((s) => s.setLifestyle);

  const [selectedAge, setSelectedAge] = useState(storedAge || '25–34');
  const [selectedLifestyle, setSelectedLifestyle] = useState(
    storedLifestyle || 'working_pro'
  );

  const handleContinue = () => {
    haptics.light();
    setAgeGroup(selectedAge);
    setLifestyle(selectedLifestyle);
    router.push('/(onboarding)/register/categories');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
          <Text style={styles.stepText}>Step 2 of 4</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar (50%) */}
        <ProgressBar progress={50} height={6} color={colors.primary} style={styles.progressBar} />

        {/* Content Area */}
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            We use this to personalize your routine suggestions.
          </Text>

          {/* Age Group Section */}
          <Text style={styles.sectionHeading}>Your Age Group</Text>
          <View style={styles.agePillsWrap}>
            {AGE_GROUPS.map((age) => {
              const isSelected = selectedAge === age;
              return (
                <Pressable
                  key={age}
                  onPress={() => {
                    haptics.light();
                    setSelectedAge(age);
                  }}
                  style={[
                    styles.agePill,
                    isSelected ? styles.agePillActive : styles.agePillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.agePillText,
                      isSelected ? styles.ageTextActive : styles.ageTextInactive,
                    ]}
                  >
                    {age}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Current Lifestyle Section (2-Column Grid) */}
          <Text style={styles.sectionHeading}>Current Lifestyle</Text>
          <View style={styles.lifestyleGrid}>
            {LIFESTYLE_OPTIONS.map((item) => {
              const isSelected = selectedLifestyle === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    haptics.light();
                    setSelectedLifestyle(item.id);
                  }}
                  style={[
                    styles.lifestyleCard,
                    isSelected ? styles.lifestyleCardActive : styles.lifestyleCardInactive,
                  ]}
                >
                  {isSelected && (
                    <View style={styles.activeCheckBadge}>
                      <Check size={10} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <View style={styles.iconBox}>
                    {item.icon({
                      color: isSelected ? colors.primary : colors.secondaryText,
                      size: 28,
                    })}
                  </View>
                  <Text
                    style={[
                      styles.lifestyleText,
                      isSelected && styles.lifestyleTextActive,
                    ]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 14,
  },
  agePillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  agePill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radii.full,
    borderWidth: 1.5,
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  agePillInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  agePillText: {
    fontSize: 15,
    fontWeight: '700',
  },
  ageTextActive: {
    color: '#FFFFFF',
  },
  ageTextInactive: {
    color: colors.primaryText,
  },
  lifestyleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  lifestyleCard: {
    width: '48%',
    height: 110,
    borderRadius: radii['2xl'],
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    position: 'relative',
  },
  lifestyleCardActive: {
    backgroundColor: '#F3F4F6',
    borderColor: colors.primary,
  },
  lifestyleCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  activeCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    marginBottom: 8,
  },
  lifestyleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryText,
    textAlign: 'center',
    lineHeight: 17,
  },
  lifestyleTextActive: {
    fontWeight: '700',
  },
  footer: {
    paddingTop: 8,
  },
});
