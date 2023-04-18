import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoginCheckStates, getLoginQrImage, getLoginState, getLoginUnikey } from '@/axios/recommend/Login';
import {
  getRecommendAlbumList,
  getRecommendDiscover,
  getRecommendNewPlayList,
  getrecommendUserList
} from '@/axios/recommend/Recommend';
import { message } from 'antd';


interface RecommendState{
  loading: boolean,
  recommendNewPlayListData: [],
  recommendLoading: boolean
  recommedUserLoading: boolean
  recommendDiscoverLoading: boolean
  recommendAlbumLoading: boolean
  recommendAlbumListData: [],
  recommendDiscoverData: any,
  recommendDiscoverError: null | string,
  recommedUserListData: [],
  error: null | string,
  cookie: string
}
interface paramsType {
  id: number,
  cookie: string
}
export const recommendPlayListState = createAsyncThunk(
  'recommendPlayListDetail/recommendPlayListState',
  async(area: string) => {
    const { monthData } =  await getRecommendNewPlayList(area);
    return monthData
  }
);
export const recommendAlbumListState = createAsyncThunk(
  'recommendAlbumListDetail/recommendAlbumListState',
  async() => {
    const data =  await getRecommendAlbumList();
    return data.result
  }
);
export const recommedUserListDataState = createAsyncThunk(
  'recommendAlbumListDetail/recommedUserListDataState',
  async(params: paramsType) => {
    const {id, cookie} = params
    const data = await getrecommendUserList(id, cookie);
    return  data.playlists;
  }
);
export const recommendDiscoverDispatch = createAsyncThunk(
  'recommendAlbumListDetail/recommendDiscoverDispatch',
  async(cookie: string) => {

    const data = await getRecommendDiscover(cookie);
    return  data;
  }
);

const initialState: RecommendState = {
  loading: true,
  recommendLoading: true,
  recommendAlbumLoading: true,
  recommedUserLoading: true,
  recommendDiscoverLoading: true,
  recommendNewPlayListData: [],
  recommendAlbumListData: [],
  recommedUserListData:[],
  recommendDiscoverData:{},
  recommendDiscoverError: null,
  error: null,
  cookie: ""
};
export const getRecommendPlaySlice = createSlice({
  name: 'recommendPlayListDetail',
  reducers: {
  },
  initialState,
  extraReducers: {
    //新歌速递
    [recommendPlayListState.pending.type]: state => {
      state.recommendLoading = true;
    },
    [recommendPlayListState.fulfilled.type]: (state, action) => {
      state.recommendLoading = false;
      state.recommendNewPlayListData = action.payload;
    },
    [recommendPlayListState.rejected.type]: (state, action) => {
      state.recommendLoading = false;
      state.error = action.payload;
    },
    //推荐专辑
    [recommendAlbumListState.pending.type]: state => {
      state.recommendAlbumLoading = true;
    },
    [recommendAlbumListState.fulfilled.type]: (state, action) => {
      state.recommendAlbumLoading = false;
      state.recommendAlbumListData = action.payload;
    },
    [recommendAlbumListState.rejected.type]: (state, action) => {
      state.recommendAlbumLoading = false;
      state.error = action.payload;
    },
    //推荐专辑
    [recommedUserListDataState.pending.type]: state => {
      state.recommedUserLoading = true;
    },
    [recommedUserListDataState.fulfilled.type]: (state, action) => {
      state.recommedUserLoading = false;
      state.recommedUserListData = action.payload;
    },
    [recommedUserListDataState.rejected.type]: (state, action) => {
      state.recommedUserLoading = false;
      state.error = action.payload;
    },
    //首页发现
    [recommendDiscoverDispatch.pending.type]: state => {
      state.recommendDiscoverLoading = true;

    },
    [recommendDiscoverDispatch.fulfilled.type]: (state, action) => {
      state.recommendDiscoverLoading = false;
      state.recommendDiscoverData = action.payload;
    },
    [recommendDiscoverDispatch.rejected.type]: (state, action) => {
      state.recommendDiscoverLoading = false;
      state.recommendDiscoverError = action.payload;
    },
  }
});
