import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStackParamList } from './types';
import Theme from '../app/theme';

// Onboarding Screen Imports
import Step1_OriginScreen from '../modules/user/onboarding/screens/Step1_OriginScreen';
import Step2_EducationScreen from '../modules/user/onboarding/screens/Step2_EducationScreen';
import Step3_ExperienceScreen from '../modules/user/onboarding/screens/Step3_ExperienceScreen';
import Step4_CurrentLocationScreen from '../modules/user/onboarding/screens/Step4_CurrentLocationScreen';
import Step5_InterestsScreen from '../modules/user/onboarding/screens/Step5_InterestsScreen';
import Step6_SkillsScreen from '../modules/user/onboarding/screens/Step6_SkillsScreen';
import Step7_GoalsScreen from '../modules/user/onboarding/screens/Step7_GoalsScreen';
import Step8_CompletionScreen from '../modules/user/onboarding/screens/Step8_CompletionScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

const Step1Wrapper = () => {
  const navigation = useNavigation<any>();
  return <Step1_OriginScreen onNext={() => navigation.navigate('Step2_Education')} />;
};

const Step2Wrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <Step2_EducationScreen 
      onNext={() => navigation.navigate('Step3_Experience')} 
      onBack={() => navigation.goBack()} 
    />
  );
};

const Step3Wrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <Step3_ExperienceScreen 
      onNext={() => navigation.navigate('Step4_CurrentLocation')} 
      onBack={() => navigation.goBack()} 
    />
  );
};

const Step4Wrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <Step4_CurrentLocationScreen 
      onNext={() => navigation.navigate('Step5_Interests')} 
      onBack={() => navigation.goBack()} 
    />
  );
};

const Step5Wrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <Step5_InterestsScreen 
      onNext={() => navigation.navigate('Step6_Skills')} 
      onBack={() => navigation.goBack()} 
    />
  );
};

const Step6Wrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <Step6_SkillsScreen 
      onNext={() => navigation.navigate('Step7_Goals')} 
      onBack={() => navigation.goBack()} 
    />
  );
};

const Step7Wrapper = () => {
  const navigation = useNavigation<any>();
  return (
    <Step7_GoalsScreen 
      onNext={() => navigation.navigate('Step8_Completion')} 
      onBack={() => navigation.goBack()} 
    />
  );
};

export const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onComplete }) => {
  const Step8Wrapper = () => {
    return <Step8_CompletionScreen onComplete={onComplete} />;
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="Step1_Origin" component={Step1Wrapper} />
      <Stack.Screen name="Step2_Education" component={Step2Wrapper} />
      <Stack.Screen name="Step3_Experience" component={Step3Wrapper} />
      <Stack.Screen name="Step4_CurrentLocation" component={Step4Wrapper} />
      <Stack.Screen name="Step5_Interests" component={Step5Wrapper} />
      <Stack.Screen name="Step6_Skills" component={Step6Wrapper} />
      <Stack.Screen name="Step7_Goals" component={Step7Wrapper} />
      <Stack.Screen name="Step8_Completion" component={Step8Wrapper} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
