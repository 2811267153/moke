import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getBannerUrl,
  getDjBanner,
  getHotArtistUrl,
  getNewLyric,
  getRecentSongs,
  getScrobble
} from '@/axios/recommend/other';
import { parseLyric } from '@/utils';

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
  scrobbleData: any,
  scrobbleLoading: boolean,
  scrobbleErr: string | null
  recentSongsData: any[]
  recentSongsLoading: boolean
  recentSongsErr: string | null
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
  lyrErr: null,
  scrobbleData: "",
  scrobbleLoading: true,
  scrobbleErr: null,
  recentSongsData: [],
  recentSongsLoading: true,
  recentSongsErr: null,
};
export const getBanner = createAsyncThunk(
  'other/getBanner',
  async () => {
    const { banners } = await getBannerUrl();
    return banners;
  }
);
export const getRecentSongsDispatch = createAsyncThunk(
  'other/getRecentSongsDispatch',
  async (params: paramsType) => {
    const {limit, cookie} = params
    const {data} = await getRecentSongs(limit, cookie);
    return data.list;
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
    return parseLyric(data.lrc.lyric);
    // if(Object.keys(data.klyric).length !== 0) {
    //   return parsePureDynamicLyric(data.klyric.lyric)
    // }else{
    //   return parseLyric(data.lrc.lyric)
    // }
  }
);
interface paramsType {
  id?: string | number
  sourceid?: string | number
  cookie: string
  limit?: number
}
export const getScrobbleDispatch = createAsyncThunk(
  'other/getScrobbleDispatch',
  async (params : paramsType) => {
    const {id, sourceid, cookie} = params
    return await getScrobble(id, sourceid, cookie);
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
    },
    [getScrobbleDispatch.pending.type]: state => {
      state.scrobbleLoading = true;
    },
    [getScrobbleDispatch.fulfilled.type]: (state, action) => {
      state.scrobbleLoading = false;
      state.scrobbleData = action.payload;
    },
    [getScrobbleDispatch.rejected.type]: (state, action) => {
      state.scrobbleLoading = false;
      state.scrobbleErr = action.payload;
    },
    [getRecentSongsDispatch.pending.type]: state => {
      state.recentSongsLoading = true;
    },
    [getRecentSongsDispatch.fulfilled.type]: (state, action) => {
      state.recentSongsLoading = false;
      state.recentSongsData = action.payload;
    },
    [getRecentSongsDispatch.rejected.type]: (state, action) => {
      state.recentSongsLoading = false;
      state.recentSongsErr = action.payload;
    }
  }
});