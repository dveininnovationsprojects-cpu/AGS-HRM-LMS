import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarMobileOpen: (state, action: PayloadAction<boolean>) => { state.sidebarMobileOpen = action.payload; },
  },
});

export const { toggleSidebar, setSidebarMobileOpen } = uiSlice.actions;
export default uiSlice.reducer;
