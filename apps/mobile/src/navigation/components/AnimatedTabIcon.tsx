import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';

interface AnimatedTabIconProps {
  active: boolean;
  children: React.ReactNode;
}

export const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = React.memo(({ active, children }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(active ? 1.12 : 1, {
      damping: 12,
      stiffness: 110,
    });
    translateY.value = withSpring(active ? -4 : 0, {
      damping: 12,
      stiffness: 110,
    });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
});

export default AnimatedTabIcon;
