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
import {
  X,
  Infinity as InfinityIcon,
  Brain,
  Users,
  Cloud,
  TrendingUp,
  LayoutGrid,
  Headphones,
  History,
  Sparkles,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { Button } from '../../components/ui/Button';
import { SUBSCRIPTION_PLANS } from '../../data/mock';
import { useUserStore } from '../../store/useUserStore';
import { useHaptics } from '../../hooks/useHaptics';

const PREMIUM_FEATURES = [
  { id: '1', title: 'Unlimited Tasks', icon: (props: any) => <InfinityIcon {...props} /> },
  { id: '2', title: 'AI Smart Predictions', icon: (props: any) => <Brain {...props} /> },
  { id: '3', title: 'Family Sharing', icon: (props: any) => <Users {...props} /> },
  { id: '4', title: 'Cloud Sync', icon: (props: any) => <Cloud {...props} /> },
  { id: '5', title: 'Advanced Insights', icon: (props: any) => <TrendingUp {...props} /> },
  { id: '6', title: 'Widgets', icon: (props: any) => <LayoutGrid {...props} /> },
  { id: '7', title: 'Priority Support', icon: (props: any) => <Headphones {...props} /> },
  { id: '8', title: 'Prediction History', icon: (props: any) => <History {...props} /> },
];

export default function PremiumUpgradeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const upgradeToPremium = useUserStore((s) => s.upgradeToPremium);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  const handleStartTrial = () => {
    haptics.success();
    upgradeToPremium(selectedPlan);
    Alert.alert(
      'Welcome to RoutineAI Premium! ✨',
      'You now have full access to unlimited tasks, AI smart predictions, and advanced insights.',
      [
        {
          text: 'Continue',
          onPress: () => router.back(),
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
          style={({ pressed }) => [styles.closeBtn, pressed && styles.btnPressed]}
        >
          <X size={20} color={colors.primaryText} />
        </Pressable>
        <Text style={styles.headerBrand}>RoutineAI</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Hero Preview Card */}
        <View style={styles.heroPreview}>
          <View style={styles.heroGlow}>
            <Sparkles size={36} color="#FF5A36" />
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineArea}>
          <Text style={styles.headline}>
            Upgrade to RoutineAI{'\n'}Premium
          </Text>
          <Text style={styles.subheadline}>
            Unlock the full power of AI Life Maintenance.
          </Text>
        </View>

        {/* Feature Grid (2x4) */}
        <Text style={styles.sectionTitle}>Premium Features</Text>
        <View style={styles.featureGrid}>
          {PREMIUM_FEATURES.map((item) => (
            <View key={item.id} style={styles.featureTile}>
              <View style={styles.featureIconCircle}>
                {item.icon({ size: 20, color: colors.primaryText })}
              </View>
              <Text style={styles.featureTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Subscription Plan Tiers */}
        <View style={styles.plansContainer}>
          {/* Monthly */}
          <Pressable
            onPress={() => {
              haptics.light();
              setSelectedPlan('monthly');
            }}
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardSelected,
            ]}
          >
            <Text style={styles.planName}>Monthly</Text>
            <View style={styles.priceRow}>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>/mo</Text>
            </View>
            <Pressable
              onPress={() => {
                haptics.light();
                setSelectedPlan('monthly');
              }}
              style={[
                styles.selectPlanBtn,
                selectedPlan === 'monthly' && styles.selectPlanBtnDark,
              ]}
            >
              <Text
                style={[
                  styles.selectBtnText,
                  selectedPlan === 'monthly' && styles.selectBtnTextDark,
                ]}
              >
                Select Monthly
              </Text>
            </Pressable>
          </Pressable>

          {/* Yearly (RECOMMENDED) */}
          <Pressable
            onPress={() => {
              haptics.light();
              setSelectedPlan('yearly');
            }}
            style={[
              styles.planCard,
              styles.recommendedCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
            ]}
          >
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
            </View>

            <Text style={styles.planName}>Yearly</Text>
            <View style={styles.priceRow}>
              <Text style={styles.planPrice}>$79.99</Text>
              <Text style={styles.planPeriod}>/yr</Text>
            </View>
            <Text style={styles.savingsText}>Save 33% ($6.66/mo)</Text>

            <Pressable
              onPress={() => {
                haptics.light();
                setSelectedPlan('yearly');
              }}
              style={[
                styles.selectPlanBtn,
                selectedPlan === 'yearly' && styles.selectPlanBtnDark,
              ]}
            >
              <Text
                style={[
                  styles.selectBtnText,
                  selectedPlan === 'yearly' && styles.selectBtnTextDark,
                ]}
              >
                Select Yearly
              </Text>
            </Pressable>
          </Pressable>

          {/* Lifetime */}
          <Pressable
            onPress={() => {
              haptics.light();
              setSelectedPlan('lifetime');
            }}
            style={[
              styles.planCard,
              selectedPlan === 'lifetime' && styles.planCardSelected,
            ]}
          >
            <Text style={styles.planName}>Lifetime</Text>
            <Text style={styles.planPrice}>$249</Text>
            <Text style={styles.savingsText}>One-time payment</Text>

            <Pressable
              onPress={() => {
                haptics.light();
                setSelectedPlan('lifetime');
              }}
              style={[
                styles.selectPlanBtn,
                selectedPlan === 'lifetime' && styles.selectPlanBtnDark,
              ]}
            >
              <Text
                style={[
                  styles.selectBtnText,
                  selectedPlan === 'lifetime' && styles.selectBtnTextDark,
                ]}
              >
                Select Lifetime
              </Text>
            </Pressable>
          </Pressable>
        </View>

        {/* Start Free Trial CTA */}
        <View style={styles.ctaArea}>
          <Button
            title="Start Free Trial"
            onPress={handleStartTrial}
            variant="primary"
            size="lg"
          />

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.continueFreeBtn, pressed && styles.btnPressed]}
          >
            <Text style={styles.continueFreeText}>Continue Free</Text>
          </Pressable>

          <Text style={styles.legalSubtext}>
            Cancel Anytime. Powered by RevenueCat
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: '800',
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
  heroPreview: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroGlow: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD7CD',
  },
  headlineArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  featureTile: {
    width: '48%',
    height: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryText,
    textAlign: 'center',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 28,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii['3xl'],
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 20,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FAFAFA',
  },
  recommendedCard: {
    borderColor: colors.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  planName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontSize: 15,
    color: colors.secondaryText,
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 2,
    marginBottom: 14,
  },
  selectPlanBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: radii.full,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectPlanBtnDark: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryText,
  },
  selectBtnTextDark: {
    color: '#FFFFFF',
  },
  ctaArea: {
    alignItems: 'center',
    gap: 14,
  },
  continueFreeBtn: {
    paddingVertical: 6,
  },
  continueFreeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
  },
  legalSubtext: {
    fontSize: 12,
    color: colors.mutedText,
    marginTop: 4,
  },
});
