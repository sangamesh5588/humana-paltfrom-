import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Dimensions, Platform } from 'react-native';
import Theme from '../../../app/theme';

const { width, height } = Dimensions.get('window');

interface DynamicSplashScreenProps {
  onInitializationComplete: () => void;
}

export const DynamicSplashScreen: React.FC<DynamicSplashScreenProps> = ({
  onInitializationComplete,
}) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // 1. Staggered entrance animations
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 12,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Continuous breathing/pulsing background glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Complete splash after timer
    const timer = setTimeout(() => {
      onInitializationComplete();
    }, 2800); // 2.8 seconds display for high-end premium brand feel

    return () => clearTimeout(timer);
  }, []);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background Decorative Mesh Gradients / Soft Glowing Pastel Auras */}
      <Animated.View style={[styles.glowTeal, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.glowIndigo, { opacity: Animated.multiply(pulseAnim, 0.7) }]} />
      
      <View style={styles.content}>
        {/* Animated Custom Premium Logo Mark */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { rotate: spin }],
            },
          ]}
        >
          {/* Overlapping glowing connection nodes */}
          <View style={styles.logoRingOuter}>
            <View style={styles.logoRingInner} />
            <View style={styles.logoCore} />
          </View>
          <View style={[styles.logoNode, styles.nodeTop]} />
          <View style={[styles.logoNode, styles.nodeBottomRight]} />
          <View style={[styles.logoNode, styles.nodeBottomLeft]} />
        </Animated.View>

        {/* Text Details */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>HUMAN</Text>
          <Text style={styles.brandSubtitle}>PLATFORM</Text>
          <View style={styles.lineDivider} />
          <Text style={styles.mottoText}>WALK THE PATH TOGETHER</Text>
        </Animated.View>
      </View>

      {/* Loading Spinner */}
      <ActivityIndicator
        size="small"
        color={Theme.colors.accent}
        style={styles.spinner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean pure white background
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  // Soft pastel glowing aura meshes (perfect for light theme)
  glowTeal: {
    position: 'absolute',
    top: -height * 0.15,
    right: -width * 0.2,
    width: width * 0.95,
    height: width * 0.95,
    borderRadius: (width * 0.95) / 2,
    backgroundColor: 'rgba(13, 148, 136, 0.08)', // Very soft Teal 600
    filter: Platform.OS === 'ios' ? 'blur(80px)' : undefined,
  },
  glowIndigo: {
    position: 'absolute',
    bottom: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: 'rgba(79, 70, 229, 0.06)', // Very soft Indigo 600
    filter: Platform.OS === 'ios' ? 'blur(80px)' : undefined,
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  // Geometric Custom Logo
  logoWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  logoRingOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: 'rgba(13, 148, 136, 0.25)', // Softer border for white bg
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRingInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(79, 70, 229, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCore: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.accent,
    shadowColor: Theme.colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  logoNode: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF', // Blends with white bg
  },
  nodeTop: {
    top: 6,
    alignSelf: 'center',
    backgroundColor: Theme.colors.accent,
    shadowColor: Theme.colors.accent,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  nodeBottomRight: {
    bottom: 12,
    right: 12,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  nodeBottomLeft: {
    bottom: 12,
    left: 12,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  // Typography
  textContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
  },
  brandTitle: {
    color: '#0F172A', // Dark charcoal/slate
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 8,
    lineHeight: 42,
  },
  brandSubtitle: {
    color: Theme.colors.accent,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 10,
    marginTop: 4,
  },
  lineDivider: {
    width: 50,
    height: 3,
    backgroundColor: Theme.colors.accent,
    marginVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
  },
  mottoText: {
    color: 'rgba(15, 23, 42, 0.45)', // Slate with opacity
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  spinner: {
    position: 'absolute',
    bottom: Theme.spacing.xl * 2,
    zIndex: 2,
  },
});

export default DynamicSplashScreen;
