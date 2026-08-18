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
import { radii } from '../../theme/radii';
import { Button } from '../../components/ui/Button';
import { useUserStore } from '../../store/useUserStore';
import { useTheme } from '../../hooks/useTheme';
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
  const theme = useTheme();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const upgradeToPremium = useUserStore((s) => s.upgradeToPremium);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');

  const handleStartTrial = () => {
    haptics.success();
    upgradeToPremium(selectedPlan);
    Alert.alert(
      'Welcome to Routine AI Premium!',
      'You now have full access to unlimited routines, deep AI predictions, and advanced habit analytics.',
      [
        {
          text: 'Continue',
          onPress: () => router.back(),
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
          style={({ pressed }) => [
            styles.closeBtn,
            { backgroundColor: theme.cardMuted },
            pressed && styles.btnPressed,
          ]}
        >
          <X size={20} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerBrand, { color: theme.text }]}>Routine AI</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Hero Preview Card */}
        <View style={styles.heroPreview}>
          <View
            style={[
              styles.heroGlow,
              { backgroundColor: theme.coralLight, borderColor: theme.coral },
            ]}
          >
            <Sparkles size={36} color={theme.coral} />
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineArea}>
          <Text style={[styles.headline, { color: theme.text }]}>
            Upgrade to Routine AI{'\n'}Premium
          </Text>
          <Text style={[styles.subheadline, { color: theme.secondaryText }]}>
            Unlock unlimited routine tracking and predictive intelligence.
          </Text>
        </View>

        {/* Feature Grid */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Premium Features</Text>
        <View style={styles.featureGrid}>
          {PREMIUM_FEATURES.map((item) => (
            <View
              key={item.id}
              style={[
                styles.featureTile,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIconCircle,
                  { backgroundColor: theme.cardMuted },
                ]}
              >
                {item.icon({ size: 20, color: theme.text })}
              </View>
              <Text
                style={[styles.featureTitle, { color: theme.text }]}
                numberOfLines={2}
              >
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
              {
                backgroundColor: theme.card,
                borderColor: selectedPlan === 'monthly' ? theme.coral : theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.planName, { color: theme.text }]}>Monthly</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.planPrice, { color: theme.text }]}>$9.99</Text>
              <Text style={[styles.planPeriod, { color: theme.secondaryText }]}>/mo</Text>
            </View>
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
              {
                backgroundColor: theme.card,
                borderColor: selectedPlan === 'yearly' ? theme.coral : theme.cardBorder,
              },
            ]}
          >
            <View style={[styles.recommendedBadge, { backgroundColor: theme.coral }]}>
              <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
            </View>

            <Text style={[styles.planName, { color: theme.text }]}>Yearly</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.planPrice, { color: theme.text }]}>$79.99</Text>
              <Text style={[styles.planPeriod, { color: theme.secondaryText }]}>/yr</Text>
            </View>
            <Text style={[styles.savingsText, { color: theme.coral }]}>
              Save 33% ($6.66/mo)
            </Text>
          </Pressable>

          {/* Lifetime */}
          <Pressable
            onPress={() => {
              haptics.light();
              setSelectedPlan('lifetime');
            }}
            style={[
              styles.planCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedPlan === 'lifetime' ? theme.coral : theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.planName, { color: theme.text }]}>Lifetime</Text>
            <Text style={[styles.planPrice, { color: theme.text }]}>$249</Text>
            <Text style={[styles.savingsText, { color: theme.secondaryText }]}>
              One-time payment
            </Text>
          </Pressable>
        </View>

        {/* Start Free Trial CTA */}
        <View style={styles.ctaArea}>
          <Button
            title="Activate Premium Access"
            onPress={handleStartTrial}
            variant="coral"
            size="lg"
          />

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.continueFreeBtn, pressed && styles.btnPressed]}
          >
            <Text style={[styles.continueFreeText, { color: theme.secondaryText }]}>
              Continue with Free Plan
            </Text>
          </Pressable>
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  heroPreview: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  headlineArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
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
    height: 100,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  featureIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  plansContainer: {
    gap: 14,
    marginBottom: 28,
  },
  planCard: {
    borderRadius: radii['3xl'],
    borderWidth: 2,
    padding: 18,
    position: 'relative',
  },
  recommendedCard: {
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontSize: 14,
    fontWeight: '600',
  },
  savingsText: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
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
  },
});
