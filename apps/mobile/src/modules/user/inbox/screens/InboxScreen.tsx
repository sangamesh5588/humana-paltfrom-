import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const InboxScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Inbox Chat & Alerts Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
});

export default InboxScreen;
