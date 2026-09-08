import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const doodle1 = require('../../../assets/onboarding_doodle_1.png');
const doodle2 = require('../../../assets/onboarding_doodle_2.png');
const doodle3 = require('../../../assets/onboarding_doodle_3.png');
const doodle4 = require('../../../assets/onboarding_doodle_4.png');
const doodle5 = require('../../../assets/onboarding_doodle_5.png');

interface OnboardingIllustrationProps {
  slideIndex: number;
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({ slideIndex }) => {
  let source;
  if (slideIndex === 0) {
    source = doodle1;
  } else if (slideIndex === 1) {
    source = doodle2;
  } else if (slideIndex === 2) {
    source = doodle3;
  } else if (slideIndex === 3) {
    source = doodle4;
  } else {
    source = doodle5;
  }

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.illustration} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%',
  },
  illustration: {
    width: width * 0.85,
    height: 280,
  },
});

export default OnboardingIllustration;
