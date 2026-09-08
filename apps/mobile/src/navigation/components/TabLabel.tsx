import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Theme from '../../app/theme';

interface TabLabelProps {
  active: boolean;
  label: string;
}

export const TabLabel: React.FC<TabLabelProps> = React.memo(({ active, label }) => {
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0.5, { duration: 150 });
    scale.value = withSpring(active ? 1 : 0.95, { damping: 15, stiffness: 120 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.Text style={[styles.text, active && styles.activeText, animatedStyle]}>
      {label}
    </Animated.Text>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(15, 23, 42, 0.4)',
    marginTop: 4,
    textAlign: 'center',
  },
  activeText: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
});

export default TabLabel;
