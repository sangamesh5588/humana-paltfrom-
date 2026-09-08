import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, ActivityIndicator } from 'react-native';
import Theme from '../../../../app/theme';
import ApiClient from '../../../../core/api/client';

const { width, height } = Dimensions.get('window');
const completionDoodle = require('../../../../assets/onboarding_doodle_5.png');

interface Step8_CompletionScreenProps {
  onComplete: () => void;
}

interface ConfettiProps {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  shape: 'circle' | 'square';
}

const CONFETTI_COLORS = ['#22C55E', '#0D9488', '#4F46E5', '#F59E0B', '#EF4444', '#EC4899', '#3B82F6'];

export const Step8_CompletionScreen: React.FC<Step8_CompletionScreenProps> = ({ onComplete }) => {
  const [isSaving, setIsSaving] = useState(false);
  const badgeScale = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(25)).current;

  const handleExplore = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await ApiClient.put('/profile', {
        onboardingDone: true,
      });
      onComplete();
    } catch (err) {
      console.warn('Failed to mark onboarding as done:', err);
      // Fallback: let the user proceed anyway
      onComplete();
    } finally {
      setIsSaving(false);
    }
  };

  // 45 particles bursting from corners
  const confettiArray = useRef<ConfettiProps[]>(
    Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0.4 + Math.random() * 0.7),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: i % 2 === 0 ? 'circle' : 'square',
    }))
  ).current;

  useEffect(() => {
    // 1. Fade in background watermark illustration
    Animated.timing(imageOpacity, {
      toValue: 0.15,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 2. Spring-in Success Badge & Checkmark
    Animated.sequence([
      Animated.spring(badgeScale, {
        toValue: 1,
        tension: 25,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Fade in text content
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 900,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 900,
        delay: 300,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Confetti Cannon Burst
    const animations = confettiArray.map((p, i) => {
      const isLeftCannon = i % 2 === 0;
      
      const startX = isLeftCannon ? -width / 2 + 30 : width / 2 - 30;
      const startY = height / 2 - 100;
      p.x.setValue(startX);
      p.y.setValue(startY);

      const angle = isLeftCannon 
        ? -Math.PI / 4 - (Math.random() * Math.PI / 6) // -45 deg +/- 15 deg
        : -3 * Math.PI / 4 + (Math.random() * Math.PI / 6); // -135 deg +/- 15 deg

      const velocity = 250 + Math.random() * 200;
      const targetX = startX + Math.cos(angle) * velocity;
      const targetY = startY + Math.sin(angle) * velocity;

      return Animated.sequence([
        Animated.delay(Math.random() * 250),
        Animated.parallel([
          Animated.timing(p.x, {
            toValue: targetX,
            duration: 1000 + Math.random() * 500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.y, {
              toValue: targetY,
              duration: 600 + Math.random() * 300,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(p.y, {
              toValue: height - 100,
              duration: 1800 + Math.random() * 800,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(p.rotate, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(1800),
            Animated.parallel([
              Animated.timing(p.scale, {
                toValue: 0.1,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(p.opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      ]);
    });

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Watermark Doodle Illustration */}
      <View style={styles.backgroundIllustrationContainer} pointerEvents="none">
        <Animated.Image
          source={completionDoodle}
          style={[styles.backgroundIllustration, { opacity: imageOpacity }]}
          resizeMode="contain"
        />
      </View>

      {/* Confetti Cannon Particles overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {confettiArray.map((p) => {
          const rotation = p.rotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${720 + Math.random() * 360}deg`],
          });

          return (
            <Animated.View
              key={p.id}
              style={[
                styles.confettiParticle,
                {
                  backgroundColor: p.color,
                  borderRadius: p.shape === 'circle' ? 6 : 2,
                  opacity: p.opacity,
                  transform: [
                    { translateX: p.x },
                    { translateY: p.y },
                    { scale: p.scale },
                    { rotate: rotation },
                  ],
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.content}>
        {/* Single Ring Premium Green Success Badge */}
        <Animated.View style={[styles.successBadge, { transform: [{ scale: badgeScale }] }]}>
          <Animated.Text style={[styles.checkmark, { transform: [{ scale: checkmarkScale }] }]}>
            ✓
          </Animated.Text>
        </Animated.View>

        {/* Text Section */}
        <Animated.View
          style={[
            styles.textCard,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>Welcome Aboard!</Text>
          <Text style={styles.subtitle}>
            Your profile setup is complete. You are now ready to share knowledge, explore career fields, and connect with relevant peers in your niche.
          </Text>
        </Animated.View>
      </View>

      {/* Footer Button */}
      <Animated.View style={[styles.footer, { opacity: textOpacity }]}>
        <TouchableOpacity style={styles.exploreButton} onPress={handleExplore} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.exploreButtonText}>Explore Dashboard</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Pure light backdrop
    position: 'relative',
    overflow: 'hidden',
  },
  // Background watermark styling
  backgroundIllustrationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backgroundIllustration: {
    width: width * 0.9,
    height: width * 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  // Confetti Particle
  confettiParticle: {
    position: 'absolute',
    left: width / 2,
    width: 12,
    height: 10,
  },
  // Single Ring Success Badge (Solid WhatsApp-style green success mark)
  successBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10B981', // Premium Emerald Green (distinct from illustration)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl * 1.5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF', // Clean border overlay
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: 'bold',
    lineHeight: 48,
  },
  // Typography Card
  textCard: {
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: Theme.spacing.md,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 25,
    maxWidth: '92%',
  },
  // Footer
  footer: {
    width: '100%',
    paddingBottom: Theme.spacing.md,
    zIndex: 3,
  },
  exploreButton: {
    width: '100%',
    height: 52,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default Step8_CompletionScreen;
