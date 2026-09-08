import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, Target, CheckCircle2 } from 'lucide-react-native';
import Theme from '../../../../app/theme';

export const GoalDetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Target size={48} color={Theme.colors.primary} />
          <Text style={styles.title}>Complete React Native Course</Text>
          <Text style={styles.subtitle}>75% Complete</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>
            Master React Native development by completing a comprehensive course covering all major concepts and best practices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Date</Text>
          <View style={styles.dateRow}>
            <Calendar size={20} color={Theme.colors.textSecondary} />
            <Text style={styles.dateText}>December 31, 2026</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <View style={styles.milestone}>
            <CheckCircle2 size={20} color={Theme.colors.primary} />
            <Text style={styles.milestoneText}>Setup Development Environment</Text>
          </View>
          <View style={styles.milestone}>
            <CheckCircle2 size={20} color={Theme.colors.primary} />
            <Text style={styles.milestoneText}>Learn Basic Components</Text>
          </View>
          <View style={styles.milestone}>
            <CheckCircle2 size={20} color={Theme.colors.primary} />
            <Text style={styles.milestoneText}>Navigation & State Management</Text>
          </View>
          <View style={styles.milestone}>
            <CheckCircle2 size={20} color={Theme.colors.border} />
            <Text style={styles.milestoneText}>API Integration</Text>
          </View>
          <View style={styles.milestone}>
            <CheckCircle2 size={20} color={Theme.colors.border} />
            <Text style={styles.milestoneText}>Build Final Project</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: Theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  section: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.sm,
  },
  sectionText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  dateText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.sm,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  milestoneText: {
    fontSize: 14,
    color: Theme.colors.textMain,
    marginLeft: Theme.spacing.md,
  },
  completeButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoalDetailsScreen;
