'use client';

import { useState } from 'react';
import { TableCell, TextField } from '@mui/material';

interface EditableCellProps {
  value: any;
  onSave: (value: any) => void;
  type?: 'text' | 'number' | 'email';
}

export function EditableCell({ value, onSave, type = 'text' }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return (
    <TableCell onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          type={type}
          size="small"
          autoFocus
        />
      ) : (
        value
      )}
    </TableCell>
  );
}