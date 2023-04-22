import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getRecommendSongsList } from '@/axios/recommend/Recommend';


interface MusiceState {
  loading: boolean,
  data: any,
  error: null | string
}

export const recommendSongs = createAsyncThunk(
  'recommendSongsDetail/recommendSongs',
  async (cookie: string) => {
    const { data }= await getRecommendSongsList(cookie);
    return data.data.dailySongs
  }
);

const initialState: MusiceState = {
  loading: true,
  data: [],
  error: null
};

export const recommendSongsDetailSlice = createSlice({
  name: 'recommendSongsDetail',
  reducers: {},
  initialState,
  extraReducers: {
    [recommendSongs.pending.type]: state => {
      state.loading = true;
    },
    [recommendSongs.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [recommendSongs.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});