import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
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
  CheckCircle2,
} from 'lucide-react-native';
import { radii } from '../../theme/radii';
import { Button } from '../../components/ui/Button';
import { useUserStore } from '../../store/useUserStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { api } from '../../services/api';

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
  const params = useLocalSearchParams<{ status?: string }>();
  const theme = useTheme();
  const haptics = useHaptics();
  const user = useUserStore((s) => s.user);
  const createCheckoutSession = useUserStore((s) => s.createCheckoutSession);
  const fetchSubscriptionStatus = useUserStore((s) => s.fetchSubscriptionStatus);

  const [selectedTier, setSelectedTier] = useState<'pro' | 'pro_family'>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingConfig, setLoadingConfig] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [pricingConfig, setPricingConfig] = useState<any>(null);

  useEffect(() => {
    if (params?.status === 'success') {
      fetchSubscriptionStatus();
      Alert.alert('Subscription Activated! 🎉', 'Welcome to RoutineAI Pro. All premium features are active on your account.');
    } else if (params?.status === 'cancel') {
      Alert.alert('Checkout Canceled', 'No payment was processed.');
    }
  }, [params?.status]);

  useEffect(() => {
    let isMounted = true;
    api
      .getSubscriptionConfig()
      .then((config) => {
        if (isMounted) {
          setPricingConfig(config);
          setLoadingConfig(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingConfig(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCheckout = async () => {
    haptics.success();
    setSubmitting(true);

    try {
      let targetPriceId: string | undefined;
      if (pricingConfig) {
        const tierConfig = pricingConfig[selectedTier];
        if (tierConfig) {
          targetPriceId =
            billingCycle === 'yearly'
              ? tierConfig.yearlyPriceId
              : tierConfig.monthlyPriceId;
        }
      }

      // Mobile deep link return URLs
      const successUrl = Linking.createURL('settings/premium', { queryParams: { status: 'success' } });
      const cancelUrl = Linking.createURL('settings/premium', { queryParams: { status: 'cancel' } });

      const res = await createCheckoutSession({
        priceId: targetPriceId,
        tier: selectedTier,
        interval: billingCycle,
        successUrl,
        cancelUrl,
      });

      if (res && res.url) {
        // Open Stripe hosted checkout page
        const supported = await WebBrowser.openBrowserAsync(res.url);
        if (supported.type !== 'opened' && supported.type !== 'dismiss') {
          await Linking.openURL(res.url);
        }
      } else {
        Alert.alert('Error', 'Unable to initiate Stripe checkout. Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Checkout Error', err.message || 'Failed to start Stripe Checkout');
    } finally {
      setSubmitting(false);
    }
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
        <Text style={[styles.headerBrand, { color: theme.text }]}>RoutineAI Pro</Text>
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
            Upgrade Your Routine Intelligence
          </Text>
          <Text style={[styles.subheadline, { color: theme.secondaryText }]}>
            Choose a plan to unlock unlimited routines, insights, and family sharing.
          </Text>
        </View>

        {/* Billing Cycle Toggle (Monthly vs Yearly) */}
        <View style={[styles.toggleContainer, { backgroundColor: theme.cardMuted }]}>
          <Pressable
            onPress={() => {
              haptics.light();
              setBillingCycle('monthly');
            }}
            style={[
              styles.toggleBtn,
              billingCycle === 'monthly' && { backgroundColor: theme.card },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: billingCycle === 'monthly' ? theme.text : theme.secondaryText },
              ]}
            >
              Monthly Billing
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              haptics.light();
              setBillingCycle('yearly');
            }}
            style={[
              styles.toggleBtn,
              billingCycle === 'yearly' && { backgroundColor: theme.card },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                { color: billingCycle === 'yearly' ? theme.text : theme.secondaryText },
              ]}
            >
              Yearly (Save 20%)
            </Text>
          </Pressable>
        </View>

        {/* Subscription Plan Tiers (Pro vs Pro + Family) */}
        <View style={styles.plansContainer}>
          {/* Pro Tier */}
          <Pressable
            onPress={() => {
              haptics.light();
              setSelectedTier('pro');
            }}
            style={[
              styles.planCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedTier === 'pro' ? theme.coral : theme.cardBorder,
              },
            ]}
          >
            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: theme.text }]}>Pro Tier</Text>
              {selectedTier === 'pro' && <CheckCircle2 size={22} color={theme.coral} />}
            </View>
            <Text style={[styles.planSub, { color: theme.secondaryText }]}>
              For individual power users
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.planPrice, { color: theme.text }]}>
                {billingCycle === 'yearly' ? '$7.99' : '$9.99'}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.secondaryText }]}>
                /{billingCycle === 'yearly' ? 'mo (billed annually)' : 'month'}
              </Text>
            </View>
          </Pressable>

          {/* Pro + Family Tier */}
          <Pressable
            onPress={() => {
              haptics.light();
              setSelectedTier('pro_family');
            }}
            style={[
              styles.planCard,
              styles.recommendedCard,
              {
                backgroundColor: theme.card,
                borderColor: selectedTier === 'pro_family' ? theme.coral : theme.cardBorder,
              },
            ]}
          >
            <View style={[styles.recommendedBadge, { backgroundColor: theme.coral }]}>
              <Text style={styles.recommendedBadgeText}>FAMILY VALUE</Text>
            </View>

            <View style={styles.planHeader}>
              <Text style={[styles.planName, { color: theme.text }]}>Pro + Family Tier</Text>
              {selectedTier === 'pro_family' && <CheckCircle2 size={22} color={theme.coral} />}
            </View>
            <Text style={[styles.planSub, { color: theme.secondaryText }]}>
              Include up to 5 family members
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.planPrice, { color: theme.text }]}>
                {billingCycle === 'yearly' ? '$14.99' : '$19.99'}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.secondaryText }]}>
                /{billingCycle === 'yearly' ? 'mo (billed annually)' : 'month'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Feature Grid */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Included Features</Text>
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

        {/* Start Checkout CTA */}
        <View style={styles.ctaArea}>
          <Button
            title={
              submitting
                ? 'Redirecting to Stripe...'
                : `Subscribe to ${selectedTier === 'pro_family' ? 'Pro + Family' : 'Pro'}`
            }
            onPress={handleCheckout}
            variant="coral"
            size="lg"
            disabled={submitting}
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
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  headlineArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 6,
  },
  subheadline: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.full,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    borderRadius: radii['2xl'],
    borderWidth: 2,
    padding: 16,
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
    paddingVertical: 3,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  planName: {
    fontSize: 17,
    fontWeight: '800',
  },
  planSub: {
    fontSize: 13,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
  },
  planPeriod: {
    fontSize: 13,
    fontWeight: '600',
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
    height: 90,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  featureIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
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
