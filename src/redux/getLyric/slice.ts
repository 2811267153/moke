import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { parseLyric } from '@/utils';

interface MusicLyricState {
  loading: boolean,
  data: any,
  error: null | string
}

export const musicLyric = createAsyncThunk(
  "musicDetail/musicLyric",
  async (
    paramaters: {
      songsid: string | number,
    },
    thunkAPI
  ) => {
    const response = await axios.get(`/lyric?id=${paramaters.songsid}`)
    return parseLyric(response.data.lrc.lyric)
  }
)

const initialState: MusicLyricState = {
  loading: true,
  data: [],
  error: null
}

export const musicLyricSlice = createSlice({
  name: 'musicLyric',
  reducers: {},
  initialState,
  extraReducers: {
    [musicLyric.pending.type]: state => {
      state.loading = true
    },
    [musicLyric.fulfilled.type]: (state, action) => {
      state.loading = false
      state.data = action.payload
    },
    [musicLyric.rejected.type]: (state, action) => {
      state.loading = false
      state.error = action.payload
    }
  }
})