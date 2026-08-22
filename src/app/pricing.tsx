import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  X,
  Check,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react-native';
import { radii } from '../theme/radii';
import { Button } from '../components/ui/Button';
import { useUserStore } from '../store/useUserStore';
import { useTheme } from '../hooks/useTheme';
import { useHaptics } from '../hooks/useHaptics';

export default function PricingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ status?: string }>();
  const theme = useTheme();
  const haptics = useHaptics();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const createCheckoutSession = useUserStore((s) => s.createCheckoutSession);
  const fetchSubscriptionStatus = useUserStore((s) => s.fetchSubscriptionStatus);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [submittingTier, setSubmittingTier] = useState<string | null>(null);

  const isAnnual = billingCycle === 'annual';

  useEffect(() => {
    if (params?.status === 'success') {
      fetchSubscriptionStatus();
      Alert.alert('Subscription Activated! 🎉', 'Welcome to RoutineAI Pro. All premium features are active on your account.');
    } else if (params?.status === 'cancel') {
      Alert.alert('Checkout Canceled', 'No payment was processed.');
    }
  }, [params?.status]);

  const handleToggleBilling = (cycle: 'monthly' | 'annual') => {
    haptics.light();
    setBillingCycle(cycle);
  };

  const handlePlanSelect = async (planId: string) => {
    haptics.success();

    if (planId === 'free') {
      if (isAuthenticated) {
        router.replace('/(tabs)/today' as any);
      } else {
        router.push('/(onboarding)/register' as any);
      }
      return;
    }

    setSubmittingTier(planId);

    try {
      // Mobile deep link return URLs
      const successUrl = Linking.createURL('pricing', { queryParams: { status: 'success' } });
      const cancelUrl = Linking.createURL('pricing', { queryParams: { status: 'cancel' } });

      const res = await createCheckoutSession({
        tier: planId as 'pro' | 'pro_family',
        interval: isAnnual ? 'yearly' : 'monthly',
        successUrl,
        cancelUrl,
      });

      if (res && res.url) {
        const supported = await WebBrowser.openBrowserAsync(res.url);
        if (supported.type !== 'opened' && supported.type !== 'dismiss') {
          await Linking.openURL(res.url);
        }
      } else {
        Alert.alert('Checkout Error', 'Unable to generate Stripe checkout session. Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Checkout Failed', err.message || 'Unable to connect to Stripe checkout.');
    } finally {
      setSubmittingTier(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.backBtn,
            { backgroundColor: theme.cardMuted },
            pressed && styles.btnPressed,
          ]}
        >
          {router.canGoBack() ? (
            <ArrowLeft size={20} color={theme.text} />
          ) : (
            <X size={20} color={theme.text} />
          )}
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>RoutineAI Pricing</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.desktopScrollContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Subtitle */}
        <View style={styles.heroSection}>
          <View style={[styles.badgePill, { backgroundColor: theme.coralLight }]}>
            <Zap size={14} color={theme.text} />
            <Text style={[styles.badgePillText, { color: theme.text }]}>
              Flexible Plans for Every Routine
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            Simple, Transparent Pricing
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Unlock AI predictive intelligence, consistency analytics, and family sharing.
          </Text>

          {/* Accessible Billing Cycle Toggle */}
          <View
            style={[styles.toggleWrapper, { backgroundColor: theme.cardMuted, borderColor: theme.cardBorder }]}
            accessibilityRole="switch"
            accessibilityState={{ checked: isAnnual }}
            accessibilityLabel={`Billing cycle toggle. Current mode: ${billingCycle}`}
          >
            <Pressable
              onPress={() => handleToggleBilling('monthly')}
              accessible={true}
              accessibilityRole="button"
              accessibilityState={{ selected: !isAnnual }}
              accessibilityLabel="Monthly Billing"
              style={[
                styles.toggleOption,
                !isAnnual && [styles.toggleOptionActive, { backgroundColor: theme.card }],
              ]}
            >
              <Text
                style={[
                  styles.toggleOptionText,
                  { color: !isAnnual ? theme.text : theme.secondaryText },
                ]}
              >
                Monthly Billing
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleToggleBilling('annual')}
              accessible={true}
              accessibilityRole="button"
              accessibilityState={{ selected: isAnnual }}
              accessibilityLabel="Annual Billing, Save 30%"
              style={[
                styles.toggleOption,
                isAnnual && [styles.toggleOptionActive, { backgroundColor: theme.card }],
              ]}
            >
              <Text
                style={[
                  styles.toggleOptionText,
                  { color: isAnnual ? theme.text : theme.secondaryText },
                ]}
              >
                Annual Billing
              </Text>
              <View style={[styles.saveBadge, { backgroundColor: theme.text }]}>
                <Text style={[styles.saveBadgeText, { color: theme.background }]}>
                  Save 30%
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Responsive Pricing Grid */}
        <View style={[styles.plansGrid, isDesktop && styles.desktopGrid]}>
          {/* FREE PLAN */}
          <View
            style={[
              styles.planCard,
              isDesktop && styles.desktopCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.planTitle, { color: theme.text }]}>Free</Text>
              <Text style={[styles.planSubtitle, { color: theme.secondaryText }]}>
                Essential routine tracking for individuals
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
              <Text style={[styles.priceAmount, { color: theme.text }]}>0</Text>
              <View style={styles.pricePeriodContainer}>
                <Text style={[styles.currencyCode, { color: theme.text }]}>USD</Text>
                <Text style={[styles.pricePeriod, { color: theme.secondaryText }]}>/ mo</Text>
              </View>
            </View>

            <View style={styles.ctaWrapper}>
              <Button
                title={isAuthenticated ? 'Current Plan' : 'Get Started Free'}
                onPress={() => handlePlanSelect('free')}
                variant="secondary"
                size="lg"
                fullWidth
              />
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featuresList}>
              <Text style={[styles.featuresListHeading, { color: theme.text }]}>
                Included in Free:
              </Text>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Up to 5 active routines
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Basic AI predictions
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Today & History views
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Standard push notifications
                </Text>
              </View>
            </View>
          </View>

          {/* PRO PLAN (MOST POPULAR) */}
          <View
            style={[
              styles.planCard,
              styles.popularCard,
              isDesktop && styles.desktopCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.text,
              },
            ]}
          >
            {/* Most Popular Badge */}
            <View style={[styles.popularBadge, { backgroundColor: theme.text }]}>
              <Sparkles size={12} color={theme.background} />
              <Text style={[styles.popularBadgeText, { color: theme.background }]}>
                MOST POPULAR
              </Text>
            </View>

            <View style={styles.cardHeader}>
              <Text style={[styles.planTitle, { color: theme.text }]}>Pro</Text>
              <Text style={[styles.planSubtitle, { color: theme.secondaryText }]}>
                For power users seeking full AI prediction & analytics
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
              <Text style={[styles.priceAmount, { color: theme.text }]}>
                {isAnnual ? '3.49' : '4.99'}
              </Text>
              <View style={styles.pricePeriodContainer}>
                <Text style={[styles.currencyCode, { color: theme.text }]}>USD</Text>
                <Text style={[styles.pricePeriod, { color: theme.secondaryText }]}>/ mo</Text>
              </View>
            </View>

            {isAnnual && (
              <Text style={[styles.billedAnnualText, { color: theme.secondaryText }]}>
                Billed annually at $41.88 USD / yr
              </Text>
            )}

            <View style={styles.ctaWrapper}>
              <Button
                title={submittingTier === 'pro' ? 'Connecting Stripe...' : 'Start Pro Access'}
                onPress={() => handlePlanSelect('pro')}
                variant="coral"
                size="lg"
                loading={submittingTier === 'pro'}
                fullWidth
              />
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featuresList}>
              <Text style={[styles.featuresListHeading, { color: theme.text }]}>
                Everything in Free, plus:
              </Text>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureTextBold, { color: theme.text }]}>
                  Unlimited routines & tasks
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Full AI prediction & confidence scores
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Insights & consistency rating
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Priority smart notifications
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Export history (CSV / JSON)
                </Text>
              </View>
            </View>
          </View>

          {/* PRO + FAMILY PLAN */}
          <View
            style={[
              styles.planCard,
              isDesktop && styles.desktopCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.planTitle, { color: theme.text }]}>Pro + Family</Text>
              <Text style={[styles.planSubtitle, { color: theme.secondaryText }]}>
                Complete household routine sharing for up to 5 members
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
              <Text style={[styles.priceAmount, { color: theme.text }]}>
                {isAnnual ? '5.59' : '7.99'}
              </Text>
              <View style={styles.pricePeriodContainer}>
                <Text style={[styles.currencyCode, { color: theme.text }]}>USD</Text>
                <Text style={[styles.pricePeriod, { color: theme.secondaryText }]}>/ mo</Text>
              </View>
            </View>

            {isAnnual && (
              <Text style={[styles.billedAnnualText, { color: theme.secondaryText }]}>
                Billed annually at $67.08 USD / yr
              </Text>
            )}

            <View style={styles.ctaWrapper}>
              <Button
                title={submittingTier === 'pro_family' ? 'Connecting Stripe...' : 'Get Pro + Family'}
                onPress={() => handlePlanSelect('pro_family')}
                variant="outline"
                size="lg"
                loading={submittingTier === 'pro_family'}
                fullWidth
              />
            </View>

            <View style={styles.featureDivider} />

            <View style={styles.featuresList}>
              <Text style={[styles.featuresListHeading, { color: theme.text }]}>
                Everything in Pro, plus:
              </Text>
              <View style={styles.featureItem}>
                <Users size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureTextBold, { color: theme.text }]}>
                  Up to 5 household members
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Shared routines & notifications
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  Family consistency dashboard
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={18} color={theme.text} style={styles.checkIcon} />
                <Text style={[styles.featureText, { color: theme.text }]}>
                  VIP priority customer support
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Guarantee / Security Footer Notice */}
        <View style={[styles.footerNotice, { backgroundColor: theme.cardMuted }]}>
          <ShieldCheck size={20} color={theme.text} />
          <Text style={[styles.footerNoticeText, { color: theme.secondaryText }]}>
            Secure 256-bit Stripe Checkout encryption. Cancel anytime directly in your customer portal.
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
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerRightPlaceholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  desktopScrollContent: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    marginBottom: 12,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 520,
    lineHeight: 22,
    marginBottom: 24,
  },
  toggleWrapper: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 4,
    borderWidth: 1,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radii.full,
    gap: 8,
  },
  toggleOptionActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleOptionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveBadge: {
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  plansGrid: {
    gap: 20,
    flexDirection: 'column',
  },
  desktopGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  planCard: {
    borderRadius: radii['3xl'],
    borderWidth: 2,
    padding: 24,
    position: 'relative',
  },
  desktopCard: {
    flex: 1,
  },
  popularCard: {
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radii.full,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardHeader: {
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    marginRight: 2,
  },
  priceAmount: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  pricePeriodContainer: {
    marginLeft: 6,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  currencyCode: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pricePeriod: {
    fontSize: 13,
    fontWeight: '600',
  },
  billedAnnualText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  ctaWrapper: {
    marginTop: 16,
    marginBottom: 20,
  },
  featureDivider: {
    height: 1,
    backgroundColor: '#E5E5E7',
    marginBottom: 18,
    opacity: 0.6,
  },
  featuresList: {
    gap: 12,
  },
  featuresListHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    marginTop: 1,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  featureTextBold: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  footerNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radii['2xl'],
    padding: 16,
    marginTop: 36,
  },
  footerNoticeText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
