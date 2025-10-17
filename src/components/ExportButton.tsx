
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Button } from '@mui/material';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export function ExportButton() {
  const { columns, data, filtering } = useSelector((state: RootState) => state.table);

  const handleExport = () => {
    const visibleColumns = columns.filter((c) => c.visible);
    const filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filtering.toLowerCase())
      )
    );

    const csvData = filteredData.map((row) => {
      const newRow: { [key: string]: any } = {};
      visibleColumns.forEach((col) => {
        newRow[col.label] = row[col.id];
      });
      return newRow;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table-data.csv');
  };

  return (
    <Button 
      onClick={handleExport}
      variant="outlined"
      size="small"
    >
      Export CSV
    </Button>
  );
}
