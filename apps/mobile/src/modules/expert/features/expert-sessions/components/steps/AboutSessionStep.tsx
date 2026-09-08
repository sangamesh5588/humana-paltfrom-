import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Plus, Check } from 'lucide-react-native';

interface AudienceItem {
  id: string;
  label: string;
  selected: boolean;
}

interface TimelineItem {
  duration: string;
  activity: string;
}

interface AboutSessionStepProps {
  explanation: string;
  onChangeExplanation: (val: string) => void;
  
  topics: string[];
  newTopic: string;
  onChangeNewTopic: (val: string) => void;
  onAddTopic: () => void;
  onRemoveTopic: (index: number) => void;

  timeline: TimelineItem[];

  audienceList: AudienceItem[];
  onToggleAudience: (id: string) => void;

  outcomes: string[];
  newOutcome: string;
  onChangeNewOutcome: (val: string) => void;
  onAddOutcome: () => void;
  onRemoveOutcome: (index: number) => void;

  questions: string[];
  newQuestion: string;
  onChangeNewQuestion: (val: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;

  cameraRequired: boolean;
  onChangeCameraRequired: (val: boolean) => void;
  micRequired: boolean;
  onChangeMicRequired: (val: boolean) => void;
}

export const AboutSessionStep: React.FC<AboutSessionStepProps> = ({
  explanation,
  onChangeExplanation,
  topics,
  newTopic,
  onChangeNewTopic,
  onAddTopic,
  onRemoveTopic,
  timeline,
  audienceList,
  onToggleAudience,
  outcomes,
  newOutcome,
  onChangeNewOutcome,
  onAddOutcome,
  onRemoveOutcome,
  questions,
  newQuestion,
  onChangeNewQuestion,
  onAddQuestion,
  onRemoveQuestion,
  cameraRequired,
  onChangeCameraRequired,
  micRequired,
  onChangeMicRequired,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>About This Session</Text>

      <Text style={styles.inputTitle}>What is this session about?</Text>
      <TextInput
        style={[styles.textInput, styles.textArea]}
        placeholder="Explain this session in detail."
        multiline
        numberOfLines={3}
        value={explanation}
        onChangeText={onChangeExplanation}
      />

      <Text style={styles.inputTitle}>What will you cover? (Topics list)</Text>
      <View style={styles.addInputRow}>
        <TextInput
          style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
          placeholder="e.g. My Journey"
          value={newTopic}
          onChangeText={onChangeNewTopic}
        />
        <TouchableOpacity style={styles.addIconBtn} onPress={onAddTopic}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.topicsTagsList}>
        {topics.map((t, index) => (
          <View key={index} style={styles.topicTag}>
            <Text style={styles.topicTagText}>✓ {t}</Text>
            <TouchableOpacity onPress={() => onRemoveTopic(index)}>
              <Text style={styles.tagRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.inputTitle}>Session Timeline</Text>
      {timeline.map((item, idx) => (
        <View key={idx} style={styles.timelineRow}>
          <Text style={styles.timelineDuration}>{item.duration}</Text>
          <Text style={styles.timelineActivity}>{item.activity}</Text>
        </View>
      ))}

      <Text style={styles.inputTitle}>Who is this session for?</Text>
      {audienceList.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.checkboxRow}
          onPress={() => onToggleAudience(item.id)}
        >
          <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
            {item.selected && <Check size={12} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.inputTitle}>What should users expect after the session?</Text>
      <View style={styles.addInputRow}>
        <TextInput
          style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
          placeholder="e.g. Clear Roadmap"
          value={newOutcome}
          onChangeText={onChangeNewOutcome}
        />
        <TouchableOpacity style={styles.addIconBtn} onPress={onAddOutcome}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.topicsTagsList}>
        {outcomes.map((o, idx) => (
          <View key={idx} style={styles.topicTag}>
            <Text style={styles.topicTagText}>✓ {o}</Text>
            <TouchableOpacity onPress={() => onRemoveOutcome(idx)}>
              <Text style={styles.tagRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.inputTitle}>Before Booking (Expert Questions)</Text>
      <View style={styles.addInputRow}>
        <TextInput
          style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
          placeholder="e.g. Upload Resume"
          value={newQuestion}
          onChangeText={onChangeNewQuestion}
        />
        <TouchableOpacity style={styles.addIconBtn} onPress={onAddQuestion}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {questions.map((q, idx) => (
        <View key={idx} style={styles.questionItem}>
          <Text style={styles.questionItemText}>{idx + 1}. {q}</Text>
          <TouchableOpacity onPress={() => onRemoveQuestion(idx)}>
            <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.inputTitle}>Session Rules</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Camera Required</Text>
        <Switch value={cameraRequired} onValueChange={onChangeCameraRequired} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Microphone Required</Text>
        <Switch value={micRequired} onValueChange={onChangeMicRequired} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  inputTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14.5,
    color: '#0F172A',
    marginBottom: 6,
  },
  textArea: {
    textAlignVertical: 'top',
    height: 90,
  },
  addInputRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  addIconBtn: {
    backgroundColor: '#0369A1',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicsTagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 8,
    marginBottom: 12,
  },
  topicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topicTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  tagRemoveText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  timelineRow: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  timelineDuration: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
    width: 80,
  },
  timelineActivity: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0369A1',
    borderColor: '#0369A1',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  questionItem: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  questionItemText: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
});

export default AboutSessionStep;
