import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getBannerUrl, getDjBanner, getHotArtistUrl } from '@/axios/recommend/other';

interface initialState {
  bannerLoading: boolean,
  bannerData: any[],
  bannerErr: string | null
  hotArtist: any[]
  hotArtistLoading: boolean
  hotArtistErr: string | null
}

const initialState: initialState = {
  bannerLoading: true,
  bannerData: [],
  bannerErr: null,
  hotArtist: [],
  hotArtistLoading: true,
  hotArtistErr: null,
}
export const getBanner = createAsyncThunk(
  "other/getBanner",
  async () => {
    const { banners } = await getBannerUrl()
    return banners
  }
)
export const getHotArtist = createAsyncThunk(
  "other/getHotArtist",
  async (type: number) => {
    const { list } = await getHotArtistUrl(type)
    return list.artists
  }
)

export const otherSlice = createSlice({
  name: "other",
  initialState,
  reducers: {},
  extraReducers: {
    [getBanner.pending.type]: state => {
      state.bannerLoading = true
    },
    [getBanner.fulfilled.type]: (state, action) => {
      state.bannerLoading = false
      state.bannerData = action.payload
    },
    [getBanner.rejected.type]: (state, action) => {
      state.bannerLoading = false
      state.bannerErr = action.payload
    },
    [getHotArtist.pending.type]: state => {
      state.hotArtistLoading = true
    },
    [getHotArtist.fulfilled.type]: (state, action) => {
      state.hotArtistLoading = false
      state.hotArtist = action.payload
    },
    [getHotArtist.rejected.type]: (state, action) => {
      state.hotArtistLoading = false
      state.hotArtistErr = action.payload
    },
  }
})