import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '../../../../app/theme';

export const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversation Chats</Text>
      <Text style={styles.sub}>Direct messages with your peer matches.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default ChatScreen;
