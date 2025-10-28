// context/HabitContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) {
        setHabits(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const addHabit = (name, category) => {
    const newHabit = {
      id: Date.now(),
      name,
      category: category || 'General', // ✅ Default category fix
      completed: false,
      streak: 0,
      lastCompleted: null,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const editHabit = (id, newName) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabitCompletion = (id) => {
    const today = new Date().toDateString();
    let updatedHabit = null;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const wasCompleted = h.lastCompleted === today;
          const newStreak =
            !wasCompleted && h.lastCompleted === new Date(Date.now() - 86400000).toDateString()
              ? h.streak + 1
              : wasCompleted
              ? h.streak
              : 1;

          updatedHabit = {
            ...h,
            completed: !wasCompleted,
            lastCompleted: wasCompleted ? null : today,
            streak: newStreak,
          };
          return updatedHabit;
        }
        return h;
      })
    );
    return updatedHabit;
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        editHabit,
        deleteHabit,
        toggleHabitCompletion,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
