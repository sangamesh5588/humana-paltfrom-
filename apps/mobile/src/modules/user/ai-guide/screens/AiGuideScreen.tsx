import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useAiGuide } from '../hooks/useAiGuide';
import MessageBubble from '../components/MessageBubble';
import Theme from '../../../../app/theme';

export const AiGuideScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialGoal = route.params?.initialGoal;

  const {
    messages,
    sessionId,
    loading,
    typing,
    isReadyToRecommend,
    startOrResumeSession,
    sendUserMessage,
  } = useAiGuide();

  const [inputVal, setInputVal] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  // Initialize session on mount
  useEffect(() => {
    startOrResumeSession(initialGoal);
  }, [initialGoal, startOrResumeSession]);

  // Navigate to recommendations screen automatically once matches are ready
  useEffect(() => {
    if (isReadyToRecommend && sessionId) {
      navigation.navigate('AiRecommendations', { sessionId });
    }
  }, [isReadyToRecommend, sessionId, navigation]);

  // Auto-scroll messages list to bottom
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputVal.trim();
    if (!text) return;
    setInputVal('');
    sendUserMessage(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Humana Guide</Text>
          <Text style={styles.headerSubtitle}>AI Professional Matchmaker</Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Main Conversation Feed */}
      {loading && messages.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={Theme.colors.primary || '#0284C7'} />
          <Text style={styles.loadingText}>Initializing Guide...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView 
          style={styles.chatArea} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <MessageBubble message={item} />}
            ListFooterComponent={
              typing ? (
                <View style={styles.typingIndicatorRow}>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color="#64748B" style={styles.typingSpinner} />
                    <Text style={styles.typingText}>Guide is thinking...</Text>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Bottom Chat Input Form */}
          <View style={styles.inputForm}>
            <View style={styles.inputBox}>
              <TextInput
                style={[styles.textInput, { maxHeight: 100 }]}
                placeholder="Type your professional goal..."
                placeholderTextColor="#94A3B8"
                value={inputVal}
                onChangeText={setInputVal}
                multiline
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !inputVal.trim() && styles.sendBtnDisabled]} 
                onPress={handleSend}
                disabled={!inputVal.trim()}
                activeOpacity={0.8}
              >
                {typing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Send size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    height: 56,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  headerRightPlaceholder: {
    width: 30,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  chatArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 24,
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  typingSpinner: {
    transform: [{ scale: 0.8 }],
  },
  typingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  inputForm: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    paddingVertical: 6,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary || '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
});

export default AiGuideScreen;
