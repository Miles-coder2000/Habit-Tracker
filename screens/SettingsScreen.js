// screens/SettingsScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../context/ThemeContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.row}>
          <Text style={{ color: theme.colors.onBackground }}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
