// screens/HomeScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Appbar,
  FAB,
  Card,
  useTheme,
  Portal,
  Dialog,
  Button,
  TextInput,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { HabitContext } from '../context/HabitContext';
import { useThemeContext } from '../context/ThemeContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    habits,
    toggleHabitCompletion,
    deleteHabit,
    editHabit,
  } = useContext(HabitContext);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter habits by category
  const filteredHabits =
    selectedCategory === 'All'
      ? habits
      : habits.filter((h) => h.category === selectedCategory);

  const openDialog = (habit, isEdit = false) => {
    setSelectedHabit(habit);
    setEditMode(isEdit);
    setEditedName(habit.name);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditMode(false);
    setEditedName('');
  };

  const openConfirmDialog = () => {
    setShowDialog(false);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setSelectedHabit(null);
  };

  const handleDelete = () => {
    if (selectedHabit) {
      deleteHabit(selectedHabit.id);
    }
    closeConfirmDialog();
  };

  const handleEdit = () => {
    if (editedName.trim()) {
      editHabit(selectedHabit.id, editedName.trim());
      closeDialog();
    }
  };

  const handleComplete = (id) => {
    const updated = toggleHabitCompletion(id);
    if (updated?.streak && [7, 30, 100].includes(updated.streak)) {
      Alert.alert('🎉 Congratulations!', `You reached a ${updated.streak}-day streak!`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="My Habits" />
        <Appbar.Action
          icon={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
          onPress={toggleTheme}
        />
        <Appbar.Action icon="chart-line" onPress={() => navigation.navigate('Progress')} />
        <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
      </Appbar.Header>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        {['All', 'General', 'Health', 'Fitness', 'Study', 'Mindfulness'].map((cat) => (
          <Chip
            key={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.chip,
              selectedCategory === cat && { backgroundColor: theme.colors.primary },
            ]}
            textStyle={{
              color:
                selectedCategory === cat
                  ? theme.colors.onPrimary
                  : theme.colors.onBackground,
            }}
          >
            {cat}
          </Chip>
        ))}
      </View>

      {/* Habit List */}
      {filteredHabits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.onBackground }}>
            No habits yet. Tap + to add one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleComplete(item.id)}
              onLongPress={() => openDialog(item)}
            >
              <Card
                style={[
                  styles.card,
                  {
                    backgroundColor: item.completed
                      ? theme.colors.primaryContainer
                      : theme.colors.surface,
                  },
                ]}
              >
                <Card.Title
                  title={item.name}
                  subtitle={`Category: ${item.category || 'General'} | Streak: ${
                    item.streak
                  } days`}
                  titleStyle={{ color: theme.colors.onSurface }}
                  subtitleStyle={{ color: theme.colors.onSurfaceVariant }}
                />
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Add Habit Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AddHabit')}
      />

      {/* Edit/Delete Dialog */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={closeDialog}>
          {editMode ? (
            <View>
              <Dialog.Title>Edit Habit</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Habit Name"
                  value={editedName}
                  onChangeText={setEditedName}
                  mode="outlined"
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={closeDialog}>Cancel</Button>
                <Button onPress={handleEdit}>Save</Button>
              </Dialog.Actions>
            </View>
          ) : (
            <View>
              <Dialog.Title>Manage Habit</Dialog.Title>
              <Dialog.Content>
                <Text>What would you like to do with "{selectedHabit?.name}"?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => openDialog(selectedHabit, true)}>Edit</Button>
                <Button onPress={openConfirmDialog} textColor="red">
                  Delete
                </Button>
              </Dialog.Actions>
            </View>
          )}
        </Dialog>

        <Dialog visible={showConfirmDialog} onDismiss={closeConfirmDialog}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete "{selectedHabit?.name}"? This action cannot
              be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeConfirmDialog}>Cancel</Button>
            <Button onPress={handleDelete} textColor="red">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { marginBottom: 12, borderRadius: 12 },
  fab: { position: 'absolute', right: 16, bottom: 24 },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  chip: {
    marginHorizontal: 4,
    marginBottom: 4,
  },
});
