'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TableCell, TextField, IconButton, Box } from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';

interface EditableRowProps {
  row: any;
  columns: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function EditableRow({ row, columns, onSave, onCancel }: EditableRowProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: row
  });

  const onSubmit = (data: any) => {
    onSave(data);
  };

  const validateAge = (value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 120) {
      return 'Age must be a valid number between 0-120';
    }
    return true;
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  };

  return (
    <>
      {columns.filter(c => c.visible).map((column) => (
        <TableCell key={column.id}>
          <TextField
            {...register(column.id, {
              required: `${column.label} is required`,
              validate: column.id === 'age' ? validateAge : 
                       column.id === 'email' ? validateEmail : undefined
            })}
            error={!!errors[column.id]}
            helperText={errors[column.id]?.message as string}
            size="small"
            fullWidth
          />
        </TableCell>
      ))}
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleSubmit(onSubmit)} size="small" color="primary">
            <Save />
          </IconButton>
          <IconButton onClick={onCancel} size="small" color="secondary">
            <Cancel />
          </IconButton>
        </Box>
      </TableCell>
    </>
  );
}