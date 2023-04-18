import { createSlice } from '@reduxjs/toolkit';

const initialCounterState = { value: "" };

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  reducers: {
    setSearchKey(state, action) {
      state.value = action.payload;
    },
  },
});

export const { setSearchKey } = counterSlice.actions;

export default counterSlice.reducer;
