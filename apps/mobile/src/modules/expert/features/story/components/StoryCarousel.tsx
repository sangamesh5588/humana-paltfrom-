import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Dimensions, ScrollView } from 'react-native';
import { ChevronRight, ArrowRight, GraduationCap, Briefcase, Rocket, Stethoscope, Calendar, Video, MessageSquare, Star, DollarSign, Clock, TrendingUp, Award } from 'lucide-react-native';
import Theme from '../../../../../app/theme';
import { ExpertStorySlide } from '../../../shared/types/expert.types';

const { width } = Dimensions.get('window');

const doodle1 = require('../../../../../assets/expert_doodle_1.png');
const doodle2 = require('../../../../../assets/expert_doodle_2.png');
const doodle3 = require('../../../../../assets/expert_doodle_3.png');

interface StoryCarouselProps {
  slides: ExpertStorySlide[];
  onApply: () => void;
  onSkip?: () => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({ slides, onApply, onSkip }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  if (!slides || slides.length === 0) return null;

  const isLast = activeIndex === slides.length - 1;

  const getDoodleSource = (idx: number) => {
    switch (idx) {
      case 1:
        return doodle2;
      case 2:
        return doodle3;
      default:
        return doodle1;
    }
  };

  const renderIconPills = (idx: number) => {
    switch (idx) {
      case 1:
        return [
          { icon: <Calendar size={14} color="#059669" />, label: 'Bookings' },
          { icon: <Video size={14} color="#059669" />, label: 'Video Call' },
          { icon: <MessageSquare size={14} color="#059669" />, label: 'Guidance' },
          { icon: <Star size={14} color="#059669" />, label: 'Reviews' },
        ];
      case 2:
        return [
          { icon: <DollarSign size={14} color="#7C3AED" />, label: 'Earnings' },
          { icon: <Clock size={14} color="#7C3AED" />, label: 'Flexible Hours' },
          { icon: <TrendingUp size={14} color="#7C3AED" />, label: 'Growth' },
          { icon: <Award size={14} color="#7C3AED" />, label: 'Reputation' },
        ];
      default:
        return [
          { icon: <GraduationCap size={14} color={Theme.colors.primary} />, label: 'Education' },
          { icon: <Briefcase size={14} color={Theme.colors.primary} />, label: 'Career' },
          { icon: <Rocket size={14} color={Theme.colors.primary} />, label: 'Founder' },
          { icon: <Stethoscope size={14} color={Theme.colors.primary} />, label: 'Healthcare' },
        ];
    }
  };

  const handleNext = () => {
    if (isLast) {
      onApply();
    } else {
      const nextIdx = activeIndex + 1;
      setActiveIndex(nextIdx);
      scrollViewRef.current?.scrollTo({ x: nextIdx * width, animated: true });
    }
  };

  const scrollToSlide = (idx: number) => {
    setActiveIndex(idx);
    scrollViewRef.current?.scrollTo({ x: idx * width, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <Text style={styles.brandTitle}>Expert Network</Text>
          {onSkip && (
            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Swipeable Horizontal ScrollView (Paging Enabled for Swipe Back/Forward) */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
            if (newIdx !== activeIndex && newIdx >= 0 && newIdx < slides.length) {
              setActiveIndex(newIdx);
            }
          }}
          scrollEventThrottle={16}
          style={styles.scrollCanvas}
        >
          {slides.map((slide, idx) => {
            const pills = renderIconPills(idx);
            return (
              <View key={slide.id || idx} style={styles.slidePage}>
                {/* 2D Line-Art Doodle Illustration */}
                <View style={styles.illustrationContainer}>
                  <Image source={getDoodleSource(idx)} style={styles.doodleImage} resizeMode="contain" />
                </View>

                {/* Subtle Icon Row */}
                <View style={styles.iconRow}>
                  {pills.map((pill, i) => (
                    <View key={i} style={styles.iconPill}>
                      {pill.icon}
                      <Text style={styles.iconPillLabel}>{pill.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Title & Description Body */}
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{slide.title}</Text>
                  <Text style={styles.subtitle}>{slide.subtitle}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Navigation Controls */}
        <View style={styles.bottomControls}>
          {/* Progress Indicator Dots (Tap to scroll) */}
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => scrollToSlide(i)}
                style={[styles.dot, activeIndex === i && styles.activeDot]}
              />
            ))}
          </View>

          {/* Solid Primary CTA Button */}
          <TouchableOpacity style={styles.ctaButton} onPress={handleNext} activeOpacity={0.9}>
            <Text style={styles.ctaText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
            {isLast ? <ArrowRight size={18} color="#FFFFFF" /> : <ChevronRight size={18} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  skipButton: {
    padding: 6,
  },
  skipText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollCanvas: {
    flex: 1,
  },
  slidePage: {
    width: width,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
    marginVertical: 4,
  },
  doodleImage: {
    width: width * 0.85,
    height: 240,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 10,
  },
  iconPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  iconPillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomControls: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  activeDot: {
    width: 24,
    backgroundColor: Theme.colors.primary,
  },
  ctaButton: {
    backgroundColor: Theme.colors.primary,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default StoryCarousel;
