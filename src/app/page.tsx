'use client';

import { useDispatch } from 'react-redux';
import { setFiltering } from '@/lib/redux/slices/tableSlice';
import { DataTable } from "@/components/DataTable";
import { ManageColumnsModal } from "@/components/ManageColumnsModal";
import { ImportButton } from "@/components/ImportButton";
import { ExportButton } from "@/components/ExportButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { Box, Typography, TextField } from "@mui/material";

export default function Home() {
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFiltering(event.target.value));
  };

  return (
    <Box sx={{ padding: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" sx={{ marginBottom: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Dynamic Data Table Manager
      </Typography>
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: "space-between", 
        marginBottom: 2,
        gap: 2
      }}>
        <TextField 
          label="Search" 
          variant="outlined" 
          onChange={handleSearch}
          size="small"
          sx={{ minWidth: { xs: '100%', sm: '300px' } }}
        />
        <Box sx={{ 
          display: "flex", 
          gap: 1, 
          alignItems: "center",
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-end' }
        }}>
          <ThemeToggle toggleTheme={toggleTheme} isDark={isDark} />
          <ImportButton />
          <ExportButton />
          <ManageColumnsModal />
        </Box>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <DataTable />
      </Box>
    </Box>
  );
}