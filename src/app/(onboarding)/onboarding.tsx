import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Button } from '../../components/ui/Button';
import { useHaptics } from '../../hooks/useHaptics';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  image: any;
  ctaText: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: 'Never forget recurring life maintenance again.',
    subtitle: 'Stay ahead of the recurring tasks you usually forget.',
    image: require('../../../assets/onboarding-images/onboding-01.svg'),
    ctaText: 'Continue →',
  },
  {
    title: 'AI learns your routine.',
    subtitle: 'Remio learns from your habits and recurring tasks.',
    image: require('../../../assets/onboarding-images/onboarding-02.svg'),
    ctaText: 'Continue →',
  },
  {
    title: "Know what's coming next.",
    subtitle: 'Remio predicts when recurring tasks are likely to come back.',
    image: require('../../../assets/onboarding-images/onboarding-03.svg'),
    ctaText: 'Continue →',
  },
  {
    title: 'Everything in one place.',
    subtitle: 'Manage your recurring tasks from a single hub.',
    image: require('../../../assets/onboarding-images/onboarding-04.svg'),
    ctaText: 'Get Started →',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);

  const goToNext = () => {
    haptics.light();
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push('/(onboarding)/login');
    }
  };

  const goToPrev = () => {
    haptics.light();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    haptics.light();
    router.push('/(onboarding)/login');
  };

  // Pan gesture for smooth swipe
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -50 && currentIndex < ONBOARDING_SLIDES.length - 1) {
        runOnJS(goToNext)();
      } else if (e.translationX > 50 && currentIndex > 0) {
        runOnJS(goToPrev)();
      }
      translateX.value = withSpring(0);
    });

  const currentSlide = ONBOARDING_SLIDES[currentIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header Bar */}
      <View style={styles.header}>
        {currentIndex > 0 ? (
          <Pressable
            onPress={goToPrev}
            style={({ pressed }) => [styles.circleBackBtn, pressed && styles.btnPressed]}
          >
            <ChevronLeft size={22} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <Pressable
          onPress={handleSkip}
          style={({ pressed }) => [styles.skipButton, pressed && styles.btnPressed]}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      {/* Swipeable Illustration & Copy */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.carouselArea}>
          {/* Frameless floating illustration */}
          <View style={styles.illustrationWrapper}>
            <Image
              source={currentSlide.image}
              style={styles.slideImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
          </View>
        </View>
      </GestureDetector>

      {/* Footer Area with Morphing Progress Dots and CTA Button */}
      <View style={styles.footerArea}>
        <View style={styles.dotsContainer}>
          {ONBOARDING_SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        <Button
          title={currentSlide.ctaText}
          onPress={goToNext}
          size="lg"
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
  backPlaceholder: {
    width: 44,
  },
  btnPressed: {
    opacity: 0.7,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  carouselArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrapper: {
    width: '100%',
    height: 330,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.primaryText,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 310,
  },
  footerArea: {
    gap: 22,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#D1D5DB',
  },
});
