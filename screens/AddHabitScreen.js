// screens/AddHabitScreen.js
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  useTheme,
  Text,
  Card,
  HelperText,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { HabitContext } from '../context/HabitContext';
import { useThemeContext } from '../context/ThemeContext';

export default function AddHabitScreen() {
  const navigation = useNavigation();
  const { addHabit } = useContext(HabitContext);
  const { isDarkMode } = useThemeContext();
  const theme = useTheme();

  const [habitName, setHabitName] = useState('');
  const [category, setCategory] = useState('General');
  const [notificationTime, setNotificationTime] = useState('20:00');

  // Ask for notification permission
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission for notifications not granted!');
      }
    })();
  }, []);

  // Schedule notification for habit reminder
  const scheduleNotification = async (name, time) => {
    const [hour, minute] = time.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Habit Reminder',
        body: `Don't forget to complete: ${name}!`,
      },
      trigger: { hour, minute, repeats: true },
    });
  };

  const handleAddHabit = async () => {
    if (habitName.trim()) {
      addHabit(habitName.trim(), category);
      await scheduleNotification(habitName, notificationTime);
      navigation.navigate('Home');
      setHabitName('');
    }
  };

  const hasError = habitName.trim().length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Habit" />
      </Appbar.Header>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.onBackground }]}>Habit Name:</Text>
        <TextInput
          label="Enter habit name"
          mode="outlined"
          value={habitName}
          onChangeText={setHabitName}
          style={styles.input}
        />
        <HelperText type="error" visible={hasError}>
          Habit name cannot be empty
        </HelperText>

        <Text style={[styles.label, { color: theme.colors.onBackground }]}>Category:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={{
              color: theme.colors.onBackground,
            }}
          >
            <Picker.Item label="General" value="General" />
            <Picker.Item label="Health" value="Health" />
            <Picker.Item label="Fitness" value="Fitness" />
            <Picker.Item label="Study" value="Study" />
            <Picker.Item label="Mindfulness" value="Mindfulness" />
          </Picker>
        </View>

        {/* Live Preview Card */}
        {habitName ? (
          <Card
            style={[
              styles.previewCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card.Title title={habitName} subtitle={`Category: ${category}`} />
          </Card>
        ) : null}

        <Button
          mode="contained"
          onPress={handleAddHabit}
          style={styles.button}
          disabled={hasError}
        >
          Add Habit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { flex: 1, justifyContent: 'center', padding: 24 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { marginBottom: 16 },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewCard: {
    marginVertical: 16,
    borderRadius: 12,
  },
  button: { marginTop: 8, borderRadius: 8 },
});
