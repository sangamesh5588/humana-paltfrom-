import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AiMessage } from '../api/aiGuide.api';
import Theme from '../../../../app/theme';

interface MessageBubbleProps {
  message: AiMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'USER';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperSystem]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleSystem]}>
        <Text style={[styles.text, isUser ? styles.textUser : styles.textSystem]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperSystem: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: Theme.colors.primary || '#0284C7',
    borderBottomRightRadius: 4,
  },
  bubbleSystem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textSystem: {
    color: '#334155',
    fontWeight: '400',
  },
});

export default MessageBubble;
