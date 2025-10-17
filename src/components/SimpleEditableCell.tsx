'use client';

import { useState } from 'react';
import { TableCell, TextField } from '@mui/material';

interface SimpleEditableCellProps {
  value: any;
  onSave: (value: any) => void;
  columnId: string;
}

export function SimpleEditableCell({ value, onSave, columnId }: SimpleEditableCellProps) {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = () => {
    // Basic validation
    if (columnId === 'age') {
      const num = Number(editValue);
      if (isNaN(num) || num < 0 || num > 120) {
        alert('Age must be a number between 0-120');
        return;
      }
    }
    
    if (columnId === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editValue)) {
        alert('Please enter a valid email');
        return;
      }
    }

    onSave(editValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return (
    <TableCell>
      <TextField
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        size="small"
        fullWidth
        autoFocus
        variant="outlined"
        sx={{ 
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'action.hover'
          }
        }}
      />
    </TableCell>
  );
}