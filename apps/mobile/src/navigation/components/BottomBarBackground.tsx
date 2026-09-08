import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Theme from '../../app/theme';

interface BottomBarBackgroundProps {
  children: React.ReactNode;
}

export const BottomBarBackground: React.FC<BottomBarBackgroundProps> = React.memo(({ children }) => {
  return (
    <View style={styles.bar}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
});

export default BottomBarBackground;
