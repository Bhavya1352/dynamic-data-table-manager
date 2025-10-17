
'use client';

import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from '@/lib/redux/slices/tableSlice';
import { Button } from '@mui/material';
import Papa from 'papaparse';

export function ImportButton() {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          dispatch(setData(results.data));
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
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
      >
        Import CSV
      </Button>
    </>
  );
}
