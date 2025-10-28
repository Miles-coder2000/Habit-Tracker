// app/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem('@habits', JSON.stringify(habits));
  } catch (e) {
    console.error('Error saving habits:', e);
  }
};

export const loadHabits = async () => {
  try {
    const json = await AsyncStorage.getItem('@habits');
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error loading habits:', e);
    return [];
  }
};
