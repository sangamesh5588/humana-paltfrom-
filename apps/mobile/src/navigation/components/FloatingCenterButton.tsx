import React, { useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Vibration,
  View
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';

interface FloatingCenterButtonProps {
  active: boolean;
  onPress: () => void;
}

export const FloatingCenterButton: React.FC<FloatingCenterButtonProps> = React.memo(({ 
  active, 
  onPress 
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(active ? 1.08 : 1, {
      damping: 10,
      stiffness: 120,
    });
  }, [active]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.88, { damping: 6, stiffness: 180 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(active ? 1.08 : 1, { damping: 8, stiffness: 120 });
  }, [active]);

  const handlePress = useCallback(() => {
    // Punchy haptic click feedback
    if (Platform.OS === 'android') {
      Vibration.vibrate([0, 15, 8, 15]); // double tap vibration pulse
    } else {
      Vibration.vibrate(10);
    }
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={[
            styles.circle, 
            active ? styles.activeCircle : styles.inactiveCircle
          ]}
        >
          <Zap size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    marginTop: -28, // Floats above the bar height
    zIndex: 10,
  },
  circle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeCircle: {
    backgroundColor: '#10B981', // Glowing emerald green
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: '#10B981',
      }
    })
  },
  inactiveCircle: {
    backgroundColor: '#0F766E', // Brand teal
  },
});

export default FloatingCenterButton;
