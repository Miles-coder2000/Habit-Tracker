import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50',
    accent: '#81C784',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    accent: '#4CAF50',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
  },
};
