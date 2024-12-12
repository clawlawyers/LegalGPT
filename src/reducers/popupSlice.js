import { createSlice } from "@reduxjs/toolkit";

export const popupSlice = createSlice({
  name: "popup",
  initialState: {
    open: false,
  },

  reducers: {
    open(state) {
      state.open = true;
    },
    close(state) {
      state.open = false;
    },
  },
});

export const { open, close } = popupSlice.actions;

export default popupSlice.reducer;
