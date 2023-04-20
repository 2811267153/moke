import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getablumAllSongs,
  getAblumId,
  getAblumInfo,
  getdynamicAblumDetail,
  updatePlayList
} from '@/axios/recommend/ablum';
import { getSongsInfo } from '@/axios/recommend/songs';
import { message } from 'antd';

interface initalbumState {
  infoLoading: boolean,
  songesLoading: boolean,
  dynamicAblumLoading: boolean,
  ablumAllSongsLoading: boolean,
  updateLoading: boolean,
  albumData: any[],
  ablumAllSongsList: any[],
  dynamicAblumData: any[],
  updatePlayListCount: any
  error: null | string
  songsInfoData: any,
  songsInfoErr: null | string
  songsInfoLoading: boolean
  albumidData: any
  albumidLoading: boolean
  albumidError: null | string

}
interface albumParams {
  id: number | string,
  key?: number | string,
  cookie?: string,
  limit?: number,
  offset?: number
}

export const musicAlbumData = createAsyncThunk(
  "musicAblumData/musicAlbumData",
  async (params: albumParams) => {
    const {id, cookie} = params
    const { playlist, privileges } = await getAblumInfo(id, cookie)
    return [playlist, privileges]
  }
)
export const ablumAllSongs = createAsyncThunk(
  "musicAblumData/ablumAllSongs",
  async (params: albumParams) => {
    const {id, limit, offset} = params
    const res = await getablumAllSongs(id as number, 20, offset! * 10)
    return res
  }
)
export const dynamicAblumDetail = createAsyncThunk(
  "musicAblumData/dynamicAblumDetail",
  async (id: number) => {

    const res = await getdynamicAblumDetail(id)
    return res
  }
)
export const updatePlayListCount = createAsyncThunk(
  "musicAblumData/updatePlayList",
  async (id: number) => {

    const res = await updatePlayList(id)
    return res
  }
)
export const getSongsInfoData = createAsyncThunk(
  "musicAblumData/getSongsInfoData",
  async (id: number | string) => {
    const res = await getSongsInfo(id)
    return res;
  }
)
export const getAlbumidData = createAsyncThunk(
  "musicAblumData/getSongsInfo",
  async (params: albumParams) => {
  const {key, cookie} = params
    message.loading("加载中....")
    const res = await getAblumId(typeof key === 'string' ? key :'未传递key', cookie)
    return res
  }
)
const initialState: initalbumState = {
  error: "",
  infoLoading: true,
  songesLoading:  true,
  dynamicAblumLoading:  true,
  updateLoading:  true,
  albumData: [],
  ablumAllSongsList: [],
  dynamicAblumData: [],
  updatePlayListCount: "",
  songsInfoData: [],
  songsInfoLoading: true,
  songsInfoErr: null,
  albumidData:'',
  albumidLoading:true,
  ablumAllSongsLoading:true,
  albumidError:'',
}
export const musicAlbumSlice = createSlice({
  name: "musicAblumData",
  reducers: {},
  initialState,
  extraReducers: {
    [musicAlbumData.pending.type]: state => {
      state.infoLoading = true
    },
    [musicAlbumData.fulfilled.type]: (state, action) => {
      state.infoLoading = false
      state.albumData = action.payload
    },
    [musicAlbumData.rejected.type]: (state, action) => {
      state.infoLoading = false
      state.error = action.payload
    },

    [getSongsInfoData.pending.type]: state => {
      state.songsInfoLoading = true
    },
    [getSongsInfoData.fulfilled.type]: (state, action) => {
      state.songsInfoLoading = false
      state.songsInfoData = action.payload
    },
    [getSongsInfoData.rejected.type]: (state, action) => {
      state.songsInfoLoading = false
      state.songsInfoErr = action.payload
    },

    [ablumAllSongs.pending.type]: state => {
      state.ablumAllSongsLoading = true
    },
    [ablumAllSongs.fulfilled.type]: (state, action) => {
      state.ablumAllSongsLoading = false
      state.ablumAllSongsList = action.payload
    },
    [ablumAllSongs.rejected.type]: (state, action) => {
      state.ablumAllSongsLoading = false
      state.error = action.payload
    },
    [dynamicAblumDetail.pending.type]: state => {
      state.dynamicAblumLoading = true
    },
    [dynamicAblumDetail.fulfilled.type]: (state, action) => {
      state.dynamicAblumLoading = false
      state.dynamicAblumData = action.payload
    },
    [dynamicAblumDetail.rejected.type]: (state, action) => {
      state.dynamicAblumLoading = false
      state.error = action.payload
    },
    [updatePlayListCount.pending.type]: state => {
      state.updateLoading = true
    },
    [updatePlayListCount.fulfilled.type]: (state, action) => {
      state.updateLoading = false
      state.updatePlayListCount = action.payload
    },
    [updatePlayListCount.rejected.type]: (state, action) => {
      state.updateLoading = false
      state.updatePlayListCount = action.payload
    },
    [getAlbumidData.pending.type]: (state, action) => {
      state.albumidLoading = false
      state.albumidData = ''
    },
    [getAlbumidData.fulfilled.type]: (state, action) => {
      state.albumidLoading = false
      state.albumidData = action.payload
    },
    [getAlbumidData.rejected.type]: (state, action) => {
      state.albumidLoading = false
      state.albumidData = ''
      state.albumidError = action.payload
    },
  }
})