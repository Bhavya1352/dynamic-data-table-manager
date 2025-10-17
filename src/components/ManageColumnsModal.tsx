
'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setColumns } from '@/lib/redux/slices/tableSlice';
import { 
  Button, 
  Modal, 
  Box, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { DragIndicator, ArrowUpward, ArrowDownward, Visibility, VisibilityOff, Add } from '@mui/icons-material';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function ManageColumnsModal() {
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.table);
  const [open, setOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleColumnToggle = (id: string) => {
    const newColumns = columns.map((col) =>
      col.id === id ? { ...col, visible: !col.visible } : col
    );
    dispatch(setColumns(newColumns));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() !== '') {
      const newColumn = { id: newColumnName.toLowerCase().replace(/\s+/g, '_'), label: newColumnName, visible: true };
      dispatch(setColumns([...columns, newColumn]));
      setNewColumnName('');
    }
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    dispatch(setColumns(newColumns));
  };

  return (
    <>
      <Button 
        onClick={handleOpen}
        variant="contained"
        size="small"
      >
        Manage Columns
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
            🛠️ Manage Table Columns
          </Typography>
          <Box sx={{ mb: 2, p: 1, backgroundColor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              📊 Table Info: Configure which columns to show/hide and reorder them
            </Typography>
          </Box>
          <List>
            {columns.map((column, index) => (
              <ListItem key={column.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => index > 0 && moveColumn(index, index - 1)}
                  disabled={index === 0}
                >
                  <ArrowUpward />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => index < columns.length - 1 && moveColumn(index, index + 1)}
                  disabled={index === columns.length - 1}
                >
                  <ArrowDownward />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleColumnToggle(column.id)}
                    sx={{ 
                      color: column.visible ? 'success.main' : 'text.disabled',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    {column.visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <Typography 
                    sx={{ 
                      flex: 1, 
                      color: column.visible ? 'text.primary' : 'text.disabled',
                      fontWeight: column.visible ? 600 : 400
                    }}
                  >
                    {column.label}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', marginTop: 2 }}>
            <TextField
              label="New Column"
              variant="outlined"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <Button onClick={handleAddColumn}>Add</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
