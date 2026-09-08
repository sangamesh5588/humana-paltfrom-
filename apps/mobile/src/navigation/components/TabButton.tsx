import React, { useCallback } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  Vibration,
  GestureResponderEvent
} from 'react-native';

interface TabButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = React.memo(({ 
  onPress, 
  onLongPress, 
  children 
}) => {
  
  const handlePress = useCallback((event: GestureResponderEvent) => {
    // Tactile haptic click vibration feedback
    if (Platform.OS === 'android') {
      Vibration.vibrate(12);
    } else {
      Vibration.vibrate(8);
    }
    
    if (onPress) {
      onPress(event);
    }
  }, [onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.button}
    >
      {children}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
});

export default TabButton;
