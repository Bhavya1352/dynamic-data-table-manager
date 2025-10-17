'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? '#00d4aa' : '#1a237e', // Custom teal/indigo instead of default blue
        light: isDark ? '#4fffdf' : '#534bae',
        dark: isDark ? '#00a07b' : '#000051',
      },
      secondary: {
        main: isDark ? '#ff6b35' : '#e91e63', // Custom orange/pink
        light: isDark ? '#ff9d64' : '#ff5983',
        dark: isDark ? '#c53d08' : '#b0003a',
      },
      background: {
        default: isDark ? '#0a0e27' : '#f8faff',
        paper: isDark ? '#1a1f3a' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        color: isDark ? '#00d4aa' : '#1a237e',
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}