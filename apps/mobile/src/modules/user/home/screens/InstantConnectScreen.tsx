import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InstantConnectScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Instant 1-on-1 AI Connect Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InstantConnectScreen;
