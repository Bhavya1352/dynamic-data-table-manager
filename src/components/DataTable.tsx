'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setSorting, setPagination, updateRow, deleteRow } from '@/lib/redux/slices/tableSlice';
import { EditableRow } from './EditableRow';
import { SimpleEditableCell } from './SimpleEditableCell';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel, 
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Snackbar,
  Typography
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { useState } from 'react';

export function DataTable() {
  const dispatch = useDispatch();
  const { columns, data, sorting, pagination, filtering } = useSelector((state: RootState) => state.table);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: -1 });
  const [editingRows, setEditingRows] = useState<number[]>([]);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  // Search functionality - filters across all columns
  // Simple but effective approach for global search
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filtering.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sorting.column];
    const bVal = b[sorting.column];
    if (aVal < bVal) return sorting.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sorting.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculation - slice karta hai data ko pages mein
  // Math simple hai: page * rowsPerPage se start, uske baad slice
  const startIndex = pagination.page * pagination.rowsPerPage;
  const endIndex = startIndex + pagination.rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Sorting logic - toggles between ascending and descending
  // Thoda manual rakha hai taaki behavior samajh mein aaye
  const handleSort = (column: string) => {
    const isAsc = sorting.column === column && sorting.direction === 'asc';
    dispatch(setSorting({ column, direction: isAsc ? 'desc' : 'asc' }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setPagination({ ...pagination, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const rowsPerPage = value === 'All' ? sortedData.length : parseInt(value, 10);
    dispatch(setPagination({ page: 0, rowsPerPage }));
  };

  const handleEditRow = (rowIndex: number) => {
    setEditingRows([...editingRows, rowIndex]);
  };

  const handleSaveRow = (rowIndex: number, newData: any) => {
    // Find the original row in the main data array
    const currentRow = paginatedData[rowIndex];
    const originalRowIndex = data.findIndex(row => 
      row.id === currentRow.id || 
      (row.name === currentRow.name && row.email === currentRow.email)
    );
    
    console.log('Saving row:', { rowIndex, originalRowIndex, newData, currentRow });
    
    if (originalRowIndex !== -1) {
      // Merge the new data with existing row data
      const updatedRow = { ...data[originalRowIndex], ...newData };
      dispatch(updateRow({ index: originalRowIndex, data: updatedRow }));
      
      setNotification({ 
        open: true, 
        message: `Row updated successfully!`, 
        type: 'success' 
      });
    }
    
    setEditingRows(editingRows.filter(idx => idx !== rowIndex));
  };

  const handleCancelRow = (rowIndex: number) => {
    setEditingRows(editingRows.filter(idx => idx !== rowIndex));
  };

  const handleSaveAll = () => {
    const count = editingRows.length;
    
    // Force save all editing rows (this is a simplified approach)
    // In a real app, you'd collect form data from each EditableRow
    editingRows.forEach(rowIndex => {
      const currentRow = paginatedData[rowIndex];
      const originalRowIndex = data.findIndex(row => 
        row.id === currentRow.id || 
        (row.name === currentRow.name && row.email === currentRow.email)
      );
      
      if (originalRowIndex !== -1) {
        // Keep existing data as is (since we can't access form state from here)
        dispatch(updateRow({ index: originalRowIndex, data: currentRow }));
      }
    });
    
    setEditingRows([]);
    setNotification({ 
      open: true, 
      message: `Successfully saved ${count} row(s)!`, 
      type: 'success' 
    });
  };

  const handleCancelAll = () => {
    const count = editingRows.length;
    setEditingRows([]);
    setNotification({ 
      open: true, 
      message: `Cancelled editing ${count} row(s)`, 
      type: 'error' 
    });
  };

  const handleDeleteClick = (index: number) => {
    setDeleteDialog({ open: true, index });
  };

  const handleDeleteConfirm = () => {
    const originalRowIndex = data.findIndex(row => row === sortedData[startIndex + deleteDialog.index]);
    if (originalRowIndex !== -1) {
      dispatch(deleteRow(originalRowIndex));
    }
    setDeleteDialog({ open: false, index: -1 });
  };

  return (
    <>
      {/* Edit All Controls - Custom feature for better UX */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button 
          variant={editingRows.length === 0 ? "contained" : "outlined"}
          color="primary"
          onClick={() => {
            if (editingRows.length === 0) {
              // Edit All - enable editing for all visible rows
              setEditingRows(paginatedData.map((_, index) => index));
            } else {
              // Exit Edit Mode
              setEditingRows([]);
            }
          }}
          sx={{ minWidth: 120 }}
        >
          {editingRows.length === 0 ? 'Edit All' : 'Exit Edit'}
        </Button>
        
        {editingRows.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600 }}>
              {editingRows.length} row(s) in edit mode
            </Typography>
          </Box>
        )}
      </Box>
      
      {editingRows.length > 0 && (
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          display: 'flex', 
          gap: 2, 
          backgroundColor: 'action.hover',
          borderRadius: 1,
          alignItems: 'center'
        }}>
          <Box sx={{ flex: 1 }}>
            <strong>{editingRows.length} row(s) in edit mode</strong>
          </Box>
          <Button 
            variant="contained" 
            color="success" 
            onClick={handleSaveAll}
            size="small"
          >
            Save All Changes
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleCancelAll}
            size="small"
          >
            Cancel All
          </Button>
        </Box>
      )}

      <Box sx={{ 
        mb: 1, 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'white', 
        borderRadius: 1, 
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem'
      }}>
        📄 Page {pagination.page + 1} of {Math.ceil(sortedData.length / pagination.rowsPerPage)} | Total: {sortedData.length} rows | Showing: {paginatedData.length} rows
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {columns.filter(c => c.visible).map((column) => (
                <TableCell 
                  key={column.id}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    borderBottom: '2px solid',
                    borderColor: 'primary.dark',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  <TableSortLabel
                    active={sorting.column === column.id}
                    direction={sorting.column === column.id ? sorting.direction : 'asc'}
                    onClick={() => handleSort(column.id)}
                    sx={{
                      color: 'white !important',
                      '& .MuiTableSortLabel-icon': {
                        color: 'white !important',
                      }
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 700,
                borderBottom: '2px solid',
                borderColor: 'primary.dark'
              }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow 
                key={index}
                sx={{
                  backgroundColor: editingRows.includes(index) ? 'action.selected' : 'inherit'
                }}
              >
                {editingRows.includes(index) ? (
                  // Simple inline editing approach
                  <>
                    {columns.filter(c => c.visible).map((column) => (
                      <SimpleEditableCell
                        key={column.id}
                        value={row[column.id]}
                        columnId={column.id}
                        onSave={(newValue) => {
                          // Update this specific cell
                          const originalRowIndex = data.findIndex(r => 
                            r.id === row.id || (r.name === row.name && r.email === row.email)
                          );
                          if (originalRowIndex !== -1) {
                            const updatedRow = { ...data[originalRowIndex], [column.id]: newValue };
                            dispatch(updateRow({ index: originalRowIndex, data: updatedRow }));
                          }
                        }}
                      />
                    ))}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => handleCancelRow(index)} size="small" color="success">
                          <Save />
                        </IconButton>
                        <IconButton onClick={() => handleCancelRow(index)} size="small" color="error">
                          <Cancel />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </>
                ) : (
                  <>
                    {columns.filter(c => c.visible).map((column) => (
                      <TableCell key={column.id}>
                        {row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => handleEditRow(index)} size="small">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(index)} size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 25, 'All']}
        component="div"
        count={sortedData.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        labelRowsPerPage="Rows per page:"
      />
      
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, index: -1 })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this row?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, index: -1 })}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          severity={notification.type} 
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}