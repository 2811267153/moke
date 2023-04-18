import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToplistArtist } from '@/axios/recommend/artist';

interface initialState {
  topListArtistData: []
  artistListInOccident: []
  artistListInJapan: []
  artistListInKorea: []
  topListArtistLoading: boolean
  artistListInJapanLoading: boolean
  artistListInKoreaLoading: boolean
  artistListInOccidentLoading: boolean
  artistListInOccidentErr: null | string
  topListArtLIstErr: null | string
  artistListInJapanErr: null | string
  artistListInKoreaErr: null | string
}

const initialState: initialState = {
  topListArtistData: [],
  artistListInOccident: [],
  artistListInJapan: [],
  artistListInKorea: [],
  topListArtistLoading: true,
  artistListInJapanLoading: true,
  artistListInKoreaLoading: true,
  artistListInOccidentLoading: true,
  artistListInOccidentErr: null,
  topListArtLIstErr: null,
  artistListInJapanErr: null,
  artistListInKoreaErr: null,
}
export const getTopListArtistDispatch = createAsyncThunk(
  "artistSclce/getTopListArtistDispatch",
  async (type: number) => {
    const { list } = await getToplistArtist(type)
    return list.artists
  }
)
export const getTopListArtistOccidentDispatch = createAsyncThunk(
  "artistSclce/getTopListArtistOccidentDispatch",
  async (type: number) => {
    const { list } = await getToplistArtist(type)
    return list.artists
  }
)
export const getTopListArtistJapanDispatch = createAsyncThunk(
  "artistSclce/getTopListArtistJapanDispatch",
  async (type: number) => {
    const { list } = await getToplistArtist(type)
    return list.artists
  }
)
export const artistListInKoreaDispatch = createAsyncThunk(
  "artistSclce/artistListInKoreaDispatch",
  async (type: number) => {
    const { list } = await getToplistArtist(type)
    return list.artists
  }
)

export const artistSlice = createSlice({
  name: "artistSlice",
  initialState,
  reducers: {},
  extraReducers: {
    [getTopListArtistDispatch.pending.type]: state => {
      state.topListArtistLoading = true
    },
    [getTopListArtistDispatch.fulfilled.type]: (state, action) => {
      state.topListArtistLoading = false
      state.topListArtistData = action.payload
    },
    [getTopListArtistDispatch.rejected.type]: (state, action) => {
      state.topListArtistLoading = false
      state.topListArtLIstErr = action.payload
    },
    [getTopListArtistOccidentDispatch.pending.type]: state => {
      state.artistListInOccidentLoading = true
    },
    [getTopListArtistOccidentDispatch.fulfilled.type]: (state, action) => {
      state.artistListInOccidentLoading = false
      state.artistListInOccident = action.payload
    },
    [getTopListArtistOccidentDispatch.rejected.type]: (state, action) => {
      state.artistListInOccidentLoading = false
      state.artistListInOccidentErr = action.payload
    },
    [getTopListArtistJapanDispatch.pending.type]: state => {
      state.artistListInOccidentLoading = true
    },
    [getTopListArtistJapanDispatch.fulfilled.type]: (state, action) => {
      state.artistListInJapanLoading = false
      state.artistListInJapan = action.payload
    },
    [getTopListArtistJapanDispatch.rejected.type]: (state, action) => {
      state.artistListInJapanLoading = false
      state.artistListInJapanErr = action.payload
    },
    [artistListInKoreaDispatch.pending.type]: state => {
      state.artistListInKoreaLoading = true
    },
    [artistListInKoreaDispatch.fulfilled.type]: (state, action) => {
      state.artistListInKoreaLoading = false
      state.artistListInKorea = action.payload
    },
    [artistListInKoreaDispatch.rejected.type]: (state, action) => {
      state.artistListInKoreaLoading = false
      state.artistListInKoreaErr = action.payload
    },
  }
})