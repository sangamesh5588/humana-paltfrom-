import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '../../../../app/theme';

export const AudioCallScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Audio Connection</Text>
      <Text style={styles.sub}>Speaking live with your matching expert peer.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: '#0F172A', // Dark screen for calls
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default AudioCallScreen;
