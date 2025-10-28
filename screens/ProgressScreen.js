// screens/ProgressScreen.js
import React, { useContext } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Text, Appbar, Card, useTheme } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { HabitContext } from '../context/HabitContext';
import { useThemeContext } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width - 32;

export default function ProgressScreen({ navigation }) {
  const { habits } = useContext(HabitContext);
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();

  // 🎯 Calculate statistics
  const totalHabits = habits.length;
  const completedHabits = habits.filter((h) => h.completed).length;
  const averageStreak =
    habits.length > 0
      ? habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length
      : 0;

  const topStreaks = habits
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)
    .map((h) => ({
      label: h.name.length > 10 ? h.name.slice(0, 10) + '…' : h.name,
      value: h.streak,
    }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Progress Overview" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Summary Cards */}
        <View style={styles.statsRow}>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium">Total Habits</Text>
              <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
                {totalHabits}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium">Completed Today</Text>
              <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
                {completedHabits}
              </Text>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium">Avg Streak</Text>
              <Text variant="headlineLarge" style={{ color: theme.colors.primary }}>
                {averageStreak.toFixed(1)}🔥
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* 🔥 Top Habits Chart */}
        {topStreaks.length > 0 && (
          <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title title="Top 5 Habit Streaks" />
            <Card.Content>
              <BarChart
                data={{
                  labels: topStreaks.map((h) => h.label),
                  datasets: [{ data: topStreaks.map((h) => h.value) }],
                }}
                width={screenWidth}
                height={220}
                fromZero
                chartConfig={{
                  backgroundGradientFrom: theme.colors.background,
                  backgroundGradientTo: theme.colors.background,
                  decimalPlaces: 0,
                  color: (opacity = 1) =>
                    isDarkMode
                      ? `rgba(255, 255, 255, ${opacity})`
                      : `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    isDarkMode
                      ? `rgba(255,255,255,${opacity})`
                      : `rgba(0,0,0,${opacity})`,
                }}
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        )}

        {/* 📈 Habit Growth Over Time */}
        {habits.length > 0 && (
          <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title title="Habit Growth (by ID order)" />
            <Card.Content>
              <LineChart
                data={{
                  labels: habits.map((_, i) => `#${i + 1}`),
                  datasets: [{ data: habits.map((h) => h.streak || 0) }],
                }}
                width={screenWidth}
                height={220}
                fromZero
                bezier
                chartConfig={{
                  backgroundGradientFrom: theme.colors.background,
                  backgroundGradientTo: theme.colors.background,
                  decimalPlaces: 0,
                  color: (opacity = 1) =>
                    theme.colors.primary + Math.floor(opacity * 255).toString(16),
                  labelColor: (opacity = 1) =>
                    isDarkMode
                      ? `rgba(255,255,255,${opacity})`
                      : `rgba(0,0,0,${opacity})`,
                }}
                style={styles.chart}
              />
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  chartCard: {
    marginTop: 20,
    borderRadius: 12,
    paddingBottom: 12,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
});
