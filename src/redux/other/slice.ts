import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit';
import {
  getBannerUrl,
  getHotArtistUrl,
  getNewLyric,
  getRecentSongs,
} from '@/axios/recommend/other';
import { parseLyric } from '@/utils';
import { ListItem } from '@/components';
import { RootState } from '@/redux/store';
import db from '../../../db';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { getLikelist } from '@/axios/recommend/songs';

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
  closePop: false
  staticResourcePath: string
  rememberSelect: string
  likelistData: any
  likelistLoading: boolean
  likelistErr: string | null
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
  scrobbleData: '',
  scrobbleLoading: true,
  scrobbleErr: null,
  recentSongsData: [],
  recentSongsLoading: true,
  recentSongsErr: null,
  likelistData: [],
  likelistLoading: true,
  likelistErr: null,


  closePop: false,
  staticResourcePath: '',
  rememberSelect: ""
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
    const { limit, cookie } = params;
    const { data } = await getRecentSongs(limit, cookie);
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
export const getLikeListDispatch = createAsyncThunk(
  'other/getLikeListDispatch',
  async (params: paramsType) => {
    const {id, cookie} = params
    const { ids } = await getLikelist(id, cookie);
    return ids
  }
);

interface paramsType {
  id:  number;
  sourceid?: string | number;
  cookie: string;
  limit?: number;
}


export const otherSlice = createSlice({
  name: 'other',
  initialState,
  reducers: {
    closePopDispatch(state, action) {
      state.closePop = action.payload;
    },
    staticResourcePathDispatch(state, action){
      state.staticResourcePath = action.payload
    },
    rememberSelectDispatch(state, action) {
      state.rememberSelect = action.payload
    }
  },
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
    },
    [getLikeListDispatch.pending.type]: state => {
      state.likelistLoading = true;
    },
    [getLikeListDispatch.fulfilled.type]: (state, action) => {
      state.likelistLoading = false;
      state.likelistData = action.payload;
    },
    [getLikeListDispatch.rejected.type]: (state, action) => {
      state.likelistData = false;
      state.likelistErr = action.payload;
    }
  }
});

export const {
  closePopDispatch,
  staticResourcePathDispatch
} = otherSlice.actions;

export const rememberSelect = (payload: CheckboxValueType[]) => async (dispatch: Dispatch, getState: () => RootState) => {
  const rememberSelect = { key: "rememberSelect", value: payload }
  const dbData: {key: string, value: []}= await new Promise((resolve, reject) => {
    db.findOne({ key: rememberSelect.key }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  if (dbData) {
    db.update({ key: rememberSelect.key }, rememberSelect, {}, (err, numReplaced) => {
      if (!err) {
        dispatch({ type: 'audioDetail/addPlayingList', payload: rememberSelect });
      } else {
        console.log('数据更新失败', err);
      }
    });
  } else {
    db.insert(rememberSelect, (err, res) => {
      if (!err) {
        dispatch({ type: 'audioDetail/addPlayingList', payload: rememberSelect });
      } else {
        console.log('数据插入失败', err);
      }
    });
  }
};