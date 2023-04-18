import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecommendMv, getTopList } from '@/axios/recommend/feed';
import { getDjBanner } from '@/axios/recommend/other';

interface initFeedState{
  topListData: any
  topListLoading: boolean,
  topListErr: null | string
  djBanner: any;
  djBannerLoading: boolean
  djBannerErr: null | string
  personalizedMv: any[],
  personalizedMvLoading: boolean,
  personalizedMvErr: string | null
}

const initialState: initFeedState ={
  topListData: [],
  topListErr: null,
  topListLoading: true,
  djBanner: [],
  djBannerErr: null,
  djBannerLoading: true,
  personalizedMv: [],
  personalizedMvLoading: true,
  personalizedMvErr: null
}
export const getTopListDispatch = createAsyncThunk(
  "feedInfoData/getTopList",
  async () => {
    const { list } = await getTopList()
    return list
  }
)
export const getDjBannerDispatch = createAsyncThunk(
  "feedInfoData/getDjBannerDispatch",
  async () => {
    const { data } = await getDjBanner()
    return data
  }
)

interface ParamsType{
  area: string,
  order: string,
  limit: number,
  offset: number
}
export const getRecommendMvDispatch = createAsyncThunk(
  "feedInfoData/getRecommendMvDispatch",
  async (params: ParamsType) => {
    const {area, order, limit, offset} = params
    const { data } = await getRecommendMv(area, order, limit, offset)
    return data
  }
)
export const feedInfoSlice = createSlice({
  name: "feedInfoData",
  reducers: {},
  initialState,
  extraReducers: {
    [getTopListDispatch.pending.type]: state => {
      state.topListLoading = true
    },
    [getTopListDispatch.fulfilled.type]: (state, action) => {
      state.topListLoading = false
      state.topListData = action.payload
    },
    [getTopListDispatch.rejected.type]: (state, action) => {
      state.topListLoading = false
      state.topListErr = action.payload
    },
    [getDjBannerDispatch.pending.type]: state => {
      state.djBannerLoading = true
    },
    [getDjBannerDispatch.fulfilled.type]: (state, action) => {
      state.djBannerLoading = false
      state.djBanner = action.payload
    },
    [getDjBannerDispatch.rejected.type]: (state, action) => {
      state.djBannerLoading = false
      state.djBannerErr = action.payload
    },
    [getRecommendMvDispatch.pending.type]: state => {
      state.personalizedMvLoading = true
    },
    [getRecommendMvDispatch.fulfilled.type]: (state, action) => {
      state.personalizedMvLoading = false
      state.personalizedMv = action.payload
    },
    [getRecommendMvDispatch.rejected.type]: (state, action) => {
      state.personalizedMvLoading = false
      state.personalizedMvErr = action.payload
    },
  }
})