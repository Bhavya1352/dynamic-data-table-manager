'use client';

import { useState } from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export function ThemeToggle({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {isDark ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}