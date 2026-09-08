import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Sparkles, Plus, Info } from 'lucide-react-native';

interface AiAnalysisStepProps {
  aiQualityScore: number | null;
  aiConciseSummary: string;
  aiKeywords: string[];
  newCustomTag: string;
  onChangeNewCustomTag: (val: string) => void;
  onAddCustomTag: () => void;
  onRemoveCustomTag: (index: number) => void;
  aiSuggestions: string[];
}

export const AiAnalysisStep: React.FC<AiAnalysisStepProps> = ({
  aiQualityScore,
  aiConciseSummary,
  aiKeywords,
  newCustomTag,
  onChangeNewCustomTag,
  onAddCustomTag,
  onRemoveCustomTag,
  aiSuggestions,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.aiHeaderRow}>
        <Sparkles size={22} color="#0369A1" />
        <Text style={styles.formLabel}>AI Session Analysis</Text>
      </View>
      <Text style={styles.formSub}>
        Our AI analyzed your verified experiences, career history, and education to generate rich metadata.
      </Text>

      {aiQualityScore && (
        <View style={styles.qualityScoreContainer}>
          <Text style={styles.qualityScoreLabel}>Session Quality Score</Text>
          <Text style={styles.qualityScoreValue}>{aiQualityScore} / 100</Text>
        </View>
      )}

      <Text style={styles.inputTitle}>concise session summary</Text>
      <View style={styles.aiOutputBox}>
        <Text style={styles.aiOutputText}>{aiConciseSummary}</Text>
      </View>

      <Text style={styles.inputTitle}>Topics & Keywords</Text>
      <View style={styles.addInputRow}>
        <TextInput
          style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
          placeholder="Add custom keyword/tag"
          value={newCustomTag}
          onChangeText={onChangeNewCustomTag}
        />
        <TouchableOpacity style={styles.addIconBtn} onPress={onAddCustomTag}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.keywordsGrid}>
        {aiKeywords.map((k, idx) => (
          <View key={idx} style={styles.keywordPill}>
            <Text style={styles.keywordPillText}>{k}</Text>
            <TouchableOpacity onPress={() => onRemoveCustomTag(idx)}>
              <Text style={{ color: '#EF4444', fontSize: 11, marginLeft: 4 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.inputTitle}>suggestions for improvement</Text>
      {aiSuggestions.map((s, idx) => (
        <View key={idx} style={styles.suggestionRow}>
          <Info size={16} color="#0369A1" style={{ marginTop: 2 }} />
          <Text style={styles.suggestionText}>{s}</Text>
        </View>
      ))}
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
  },
  formSub: {
    fontSize: 13,
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 16,
    lineHeight: 18,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  qualityScoreContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  qualityScoreLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#065F46',
  },
  qualityScoreValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
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
  aiOutputBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiOutputText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 18,
  },
  addInputRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
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
  },
  addIconBtn: {
    backgroundColor: '#0369A1',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keywordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
  keywordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  keywordPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
  },
  suggestionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  suggestionText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
    lineHeight: 17,
  },
});

export default AiAnalysisStep;
