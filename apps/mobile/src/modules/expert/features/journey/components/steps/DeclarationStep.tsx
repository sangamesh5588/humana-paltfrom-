import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShieldAlert, CheckSquare, Square } from 'lucide-react-native';
import Theme from '../../../../../../app/theme';
import useJourneyStore from '../../store/journeyStore';

export const DeclarationStep: React.FC = () => {
  const { answers, documents, declarationAccepted, setDeclarationAccepted } = useJourneyStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ShieldAlert size={28} color={Theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Review & Final Declaration</Text>
          <Text style={styles.subtitle}>
            Please review your details and confirm compliance with platform trust & safety policies.
          </Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionHeader}>Submitted Answers</Text>
        {Object.keys(answers).length > 0 ? (
          Object.entries(answers).map(([k, v]) => (
            <View key={k} style={styles.summaryRow}>
              <Text style={styles.keyText}>{k}:</Text>
              <Text style={styles.valText}>{String(v)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Standard Profile Details confirmed.</Text>
        )}

        <View style={styles.divider} />
        <Text style={styles.sectionHeader}>Attached Proofs ({documents.length})</Text>
        {documents.map((d, i) => (
          <Text key={i} style={styles.docText}>
            • {d.name}
          </Text>
        ))}
      </View>

      {/* Declaration Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setDeclarationAccepted(!declarationAccepted)}
        activeOpacity={0.8}
      >
        {declarationAccepted ? (
          <CheckSquare size={22} color={Theme.colors.primary} />
        ) : (
          <Square size={22} color="#94A3B8" />
        )}
        <Text style={styles.declarationText}>
          I solemnly declare that all information and documents provided are accurate, truthful, and belong to me.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  keyText: {
    fontSize: 13,
    color: '#64748B',
  },
  valText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  docText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  declarationText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
});

export default DeclarationStep;
