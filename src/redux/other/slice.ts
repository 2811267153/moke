import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBannerUrl, getDjBanner, getHotArtistUrl, getNewLyric } from '@/axios/recommend/other';
import { parseLyric } from '@/utils';
import { parsePureDynamicLyric } from '@/core/lyric-parser';

interface initialState {
  bannerLoading: boolean,
  bannerData: any[],
  bannerErr: string | null
  hotArtist: any[]
  hotArtistLoading: boolean
  hotArtistErr: string | null
  lyricLoading: boolean
  lyricData: any
  lyrErr: null | string
}

const initialState: initialState = {
  bannerLoading: true,
  bannerData: [],
  bannerErr: null,
  hotArtist: [],
  hotArtistLoading: true,
  hotArtistErr: null,
  lyricLoading: true,
  lyricData: {},
  lyrErr: null
};
export const getBanner = createAsyncThunk(
  'other/getBanner',
  async () => {
    const { banners } = await getBannerUrl();
    return banners;
  }
);
export const getHotArtist = createAsyncThunk(
  'other/getHotArtist',
  async (type: number) => {
    const { list } = await getHotArtistUrl(type);
    return list.artists;
  }
);
export const getLyricDispatch = createAsyncThunk(
  'other/getLyricDispatch',
  async (id: number) => {
    const data = await getNewLyric(id);
    console.log('getLyricDispatch', data);
    return parseLyric(data.lrc.lyric)
    // if(Object.keys(data.klyric).length !== 0) {
    //   return parsePureDynamicLyric(data.klyric.lyric)
    // }else{
    //   return parseLyric(data.lrc.lyric)
    // }
  }
);

export const otherSlice = createSlice({
  name: 'other',
  initialState,
  reducers: {},
  extraReducers: {
    [getBanner.pending.type]: state => {
      state.bannerLoading = true;
    },
    [getBanner.fulfilled.type]: (state, action) => {
      state.bannerLoading = false;
      state.bannerData = action.payload;
    },
    [getBanner.rejected.type]: (state, action) => {
      state.bannerLoading = false;
      state.bannerErr = action.payload;
    },
    [getHotArtist.pending.type]: state => {
      state.hotArtistLoading = true;
    },
    [getHotArtist.fulfilled.type]: (state, action) => {
      state.hotArtistLoading = false;
      state.hotArtist = action.payload;
    },
    [getHotArtist.rejected.type]: (state, action) => {
      state.hotArtistLoading = false;
      state.hotArtistErr = action.payload;
    },
    [getLyricDispatch.pending.type]: state => {
      state.lyricLoading = true;
    },
    [getLyricDispatch.fulfilled.type]: (state, action) => {
      state.lyricLoading = false;
      state.lyricData = action.payload;
    },
    [getLyricDispatch.rejected.type]: (state, action) => {
      state.lyricLoading = false;
      state.lyrErr = action.payload;
    }
  }
});