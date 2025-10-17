
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
  columns: { id: string; label: string; visible: boolean }[];
  data: any[];
  sorting: { column: string; direction: 'asc' | 'desc' };
  filtering: string;
  pagination: { page: number; rowsPerPage: number };
}

const initialState: TableState = {
  columns: [
    { id: 'name', label: 'Employee Name', visible: true },
    { id: 'email', label: 'Email Address', visible: true },
    { id: 'age', label: 'Age', visible: true },
    { id: 'role', label: 'Job Role', visible: true },
  ],
  data: [
    { id: 1, name: 'Aarav Mehta', email: 'aarav@techcorp.com', age: 27, role: 'Full Stack Developer' },
    { id: 2, name: 'Priya Sharma', email: 'priya@techcorp.com', age: 30, role: 'UI/UX Designer' },
    { id: 3, name: 'Rohit Kumar', email: 'rohit@techcorp.com', age: 35, role: 'Project Manager' },
    { id: 4, name: 'Sneha Patel', email: 'sneha@techcorp.com', age: 28, role: 'Frontend Developer' },
    { id: 5, name: 'Arjun Singh', email: 'arjun@techcorp.com', age: 32, role: 'Data Analyst' },
    { id: 6, name: 'Kavya Reddy', email: 'kavya@techcorp.com', age: 29, role: 'Backend Developer' },
    { id: 7, name: 'Vikram Joshi', email: 'vikram@techcorp.com', age: 31, role: 'DevOps Engineer' },
    { id: 8, name: 'Ananya Gupta', email: 'ananya@techcorp.com', age: 26, role: 'QA Tester' },
    { id: 9, name: 'Karan Agarwal', email: 'karan@techcorp.com', age: 33, role: 'Tech Lead' },
    { id: 10, name: 'Riya Bansal', email: 'riya@techcorp.com', age: 25, role: 'Product Designer' },
    { id: 11, name: 'Siddharth Rao', email: 'siddharth@techcorp.com', age: 34, role: 'System Architect' },
    { id: 12, name: 'Pooja Verma', email: 'pooja@techcorp.com', age: 29, role: 'Business Analyst' },
    { id: 13, name: 'Rahul Nair', email: 'rahul@techcorp.com', age: 28, role: 'Mobile Developer' },
    { id: 14, name: 'Ishita Malhotra', email: 'ishita@techcorp.com', age: 30, role: 'Scrum Master' },
    { id: 15, name: 'Amit Chopra', email: 'amit@techcorp.com', age: 36, role: 'Engineering Manager' },
  ],
  sorting: { column: 'name', direction: 'asc' },
  filtering: '',
  pagination: { page: 0, rowsPerPage: 5 },
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
    updateRow: (state, action: PayloadAction<{ index: number; data: any }>) => {
      state.data[action.payload.index] = action.payload.data;
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      state.data.splice(action.payload, 1);
    },
    setColumns: (state, action: PayloadAction<{ id: string; label: string; visible: boolean }[]>) => {
      state.columns = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ column: string; direction: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    setFiltering: (state, action: PayloadAction<string>) => {
      state.filtering = action.payload;
    },
    setPagination: (state, action: PayloadAction<{ page: number; rowsPerPage: number }>) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setData,
  setColumns,
  setSorting,
  setFiltering,
  setPagination,
  updateRow,
  deleteRow,
} = tableSlice.actions;

export default tableSlice.reducer;
