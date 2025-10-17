
'use client';

import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from '@/lib/redux/slices/tableSlice';
import { Button, Snackbar, Alert } from '@mui/material';
import Papa from 'papaparse';

export function ImportButton() {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setLoading(false);
          if (results.errors.length > 0) {
            setNotification({
              open: true,
              message: `CSV Error: ${results.errors[0].message}`,
              type: 'error'
            });
          } else {
            dispatch(setData(results.data));
            setNotification({
              open: true,
              message: `Successfully imported ${results.data.length} rows!`,
              type: 'success'
            });
          }
        },
        error: (error) => {
          setLoading(false);
          setNotification({
            open: true,
            message: `Import failed: ${error.message}`,
            type: 'error'
          });
        },
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button 
        onClick={handleButtonClick}
        variant="outlined"
        size="small"
        disabled={loading}
      >
        {loading ? 'Importing...' : 'Import CSV'}
      </Button>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
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
