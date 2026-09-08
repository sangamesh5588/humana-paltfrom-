import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Theme from '../../../app/theme';
import OnboardingIllustration from '../components/OnboardingIllustration';

const { width } = Dimensions.get('window');

interface OnboardingSlidesProps {
  onSkip: () => void;
  onStart: () => void;
}

const SLIDES = [
  {
    title: 'Someone Has Already Been There.',
    subtitle: "You don't have to figure everything out alone.",
  },
  {
    title: 'Learn From Experience, Not Just Information.',
    subtitle: 'Real people. Real stories. Real insights.',
  },
  {
    title: 'One Conversation Can Change Everything.',
    subtitle: 'Get answers, avoid mistakes, and move forward with confidence.',
  },
  {
    title: 'Connect 1-on-1, Globally.',
    subtitle: "Talk to someone who has faced your exact challenge, upgraded their life, and can help you grow.",
  },
  {
    title: 'Built on Trust. Powered by People.',
    subtitle: 'Verified people helping others through real experiences.',
  },
];

export const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({ onSkip, onStart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < 4) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      onStart();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Right Skip Button */}
      <TouchableOpacity style={styles.topSkipBtn} onPress={onSkip}>
        <Text style={styles.topSkipText}>Skip</Text>
      </TouchableOpacity>

      {/* Horizontal Swipe Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            {/* Larger Custom Doodle Illustration */}
            <OnboardingIllustration slideIndex={index} />

            {/* Content text */}
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Centered Bottom Navigation Footer */}
      <View style={styles.footer}>
        {/* Page Dots Indicator (above button) */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : null,
              ]}
            />
          ))}
        </View>

        {/* Large Pill Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
          <Text style={styles.actionBtnText}>
            {currentIndex === 4 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  topSkipBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  topSkipText: {
    color: Theme.colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: 40, 
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
  },
  title: {
    color: Theme.colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.lg * 1.2,
    paddingBottom: Theme.spacing.xl * 1.5,
    backgroundColor: '#FFFFFF',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 18, 
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.accent, 
  },
  actionBtn: {
    backgroundColor: Theme.colors.primary, 
    borderRadius: 28,
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingSlides;
