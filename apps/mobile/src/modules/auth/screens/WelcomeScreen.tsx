import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Theme from '../../../app/theme';

const { width } = Dimensions.get('window');
const onboardingIllustration = require('../../../assets/onboarding_guidance.png');

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext, onSkip }) => {
  return (
    <View style={styles.container}>
      {/* Premium Onboarding Graphic Scene */}
      <View style={styles.graphicContainer}>
        <Image
          source={onboardingIllustration}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Copywriting & Action Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.brandTitle}>
          Talk to someone who's been there.
        </Text>

        <Text style={styles.subtitle}>
          Learn from the real experiences of verified people.
        </Text>

        <TouchableOpacity style={styles.startBtn} onPress={onNext}>
          <Text style={styles.startBtnText}>Begin Journey</Text>
        </TouchableOpacity>

        {onSkip && (
          <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
            <Text style={styles.skipBtnText}>Browse as Guest</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  graphicContainer: {
    height: '58%', // Larger size to fill central whitespace
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: Theme.spacing.xl * 1.5,
  },
  illustration: {
    width: width * 0.9,
    height: width * 0.9,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg * 1.2,
    paddingBottom: Theme.spacing.lg,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.xl * 1.2, // Clean separation before button
  },
  startBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 28,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: Theme.spacing.xs,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipBtn: {
    paddingVertical: Theme.spacing.sm,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  skipBtnText: {
    color: Theme.colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.7,
  },
});

export default WelcomeScreen;
