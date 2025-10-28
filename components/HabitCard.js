// app/components/HabitCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HabitCard({ habit, toggleHabit }) {
  return (
    <TouchableOpacity
      onPress={() => toggleHabit(habit.id)}
      style={{
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        backgroundColor: habit.completed ? '#4CAF50' : '#f5f5f5',
      }}
    >
      <Text style={{ fontSize: 18 }}>{habit.name}</Text>
      <Text style={{ fontSize: 14, color: '#888' }}>
        {habit.completed ? 'Completed Today ✅' : 'Tap to Complete'}
      </Text>
    </TouchableOpacity>
  );
}
