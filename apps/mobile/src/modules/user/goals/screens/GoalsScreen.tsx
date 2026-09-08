import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Target, Plus, CheckCircle2, Circle } from 'lucide-react-native';
import Theme from '../../../../app/theme';

export const GoalsScreen: React.FC = () => {
  // Mock goals data
  const goals = [
    { id: '1', title: 'Complete React Native Course', progress: 75, completed: false },
    { id: '2', title: 'Land Senior Developer Role', progress: 40, completed: false },
    { id: '3', title: 'Build 5 Mobile Apps', progress: 20, completed: false },
    { id: '4', title: 'Learn TypeScript', progress: 100, completed: true },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Goals</Text>
          <Text style={styles.headerSubtitle}>Track your career aspirations</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>58%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>

        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {goals.map((goal) => (
            <TouchableOpacity key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIconContainer}>
                  {goal.completed ? (
                    <CheckCircle2 size={24} color={Theme.colors.primary} />
                  ) : (
                    <Circle size={24} color={Theme.colors.border} />
                  )}
                </View>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}>
                    {goal.title}
                  </Text>
                  <Text style={styles.goalProgress}>{goal.progress}% Complete</Text>
                </View>
                <Target size={20} color={Theme.colors.textSecondary} />
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${goal.progress}%` }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    marginBottom: Theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
    marginBottom: Theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginHorizontal: Theme.spacing.xs,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  goalsSection: {
    marginBottom: Theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.textMain,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  goalIconContainer: {
    marginRight: Theme.spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textMain,
    marginBottom: 2,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Theme.colors.textSecondary,
  },
  goalProgress: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
});

export default GoalsScreen;
