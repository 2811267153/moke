import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { getSongsCheckState, getSongsSearch_c, getSongsUrl } from '@/axios/recommend/songs';


interface MusiceDeatilState {
  loading: boolean,
  songsLoading: boolean,
  songUrlLoaidng: boolean
  search_cLoading: boolean
  songsState: any
  data: any,
  songsUrl: any,
  error: null | string
  songsDuration: any
  songsErr: null | string
  urlErr: null | string
  keyword: string
  search_cSongsErr: string | null
  search_cSongs: any
  historySearchList: any[]
}

export const musicDetailPage = createAsyncThunk(
  'musicDetail/musicDetailPage',
  async (
    paramaters: {
      songsid: string | number,
    },
    thunkAPI
  ) => {
    const { data } = await axios.get(`/search?keywords=${paramaters.songsid}`);
    return data.result.songs[0];
  }
);
export const songsDurationDispatch = createAsyncThunk(
  'musicDetail/songsDetail',
  async (id: number,
         thunkAPI
  ) => {
    const { data } = await axios.get(`/search?keywords=${id}`);
    return data.result.songs[0].duration;
  }
);
export const songsSearch = createAsyncThunk(
  'musicDetail/songsSearch',
  async (params: {
    value: any,
    offset: number
  }, thunkAPI) => {
    // const data = await  getSearchSuggest(key)
    const { result } = await getSongsSearch_c(params.value, params.offset);
    return result.songs;
  }
);
export const musicUrl = createAsyncThunk(
  'musicDetail/musicUrl',
  async (
    params: {
      id: string | number,
      level?: string
    },
    thunkAPI
  ) => {
    const { id, level } = params;
    const data = await getSongsUrl(id, level);
    if (data.data.data[0].url !== null) {
      console.log(data.data.data[0].url);
      return data.data.data[0].url;
    } else {
      data.data.data[0].url;
      return data.data.data[0].url = '无版权歌曲';
    }
  }
);
export const songsUrlDispatch = createAsyncThunk(
  'musicDetail/songsUrlDispatch',
  async (
    params: {
      id: string | number,
      level?: string,
      cookie?: string
    },
    thunkAPI
  ) => {
    const { id, level, cookie } = params;
    const { data } = await getSongsUrl(id, level, cookie);

    if (data[0].url === null) {
      return '无版权歌曲';
    } else {
      return data[0].url;
    }
  }
);
export const songsStateDisptch = createAsyncThunk(
  'musicDetail/songsState',
  async (id: number) => {
    const data = getSongsCheckState(id);
    return data;
  }
);

const initialState: MusiceDeatilState = {
  loading: true,
  songsLoading: true,
  songUrlLoaidng: true,
  songsUrl: '',
  data: [],
  songsDuration: {},
  songsState: '',
  songsErr: null,
  error: null,
  urlErr: null,
  keyword: "",
  search_cLoading: true,
  search_cSongs: [],
  search_cSongsErr: null,
  historySearchList: []
};

export const musicDetailSlice = createSlice({
  name: 'musicDetail',
  reducers: {
    updateKeyword: (state, action) => {
      state.keyword = action.payload;
    },

  },
  initialState,
  extraReducers: {
    [musicDetailPage.pending.type]: state => {
      state.loading = true;
    },
    [musicDetailPage.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [musicDetailPage.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [songsDurationDispatch.pending.type]: state => {
      state.songsLoading = true;
    },
    [songsDurationDispatch.fulfilled.type]: (state, action) => {
      state.songsLoading = false;
      state.songsDuration = action.payload;
    },
    [songsDurationDispatch.rejected.type]: (state, action) => {
      state.songsLoading = false;
      state.songsErr = action.payload;
    },
    [musicUrl.pending.type]: state => {
      state.songUrlLoaidng = true;
    },
    [musicUrl.fulfilled.type]: (state, action) => {
      state.songUrlLoaidng = false;
      state.songsUrl = action.payload;
    },
    [musicUrl.rejected.type]: (state, action) => {
      state.songUrlLoaidng = false;
      state.urlErr = action.payload;
    },
    [songsUrlDispatch.pending.type]: state => {
      state.songUrlLoaidng = true;
      state.songsUrl = '';
    },
    [songsUrlDispatch.fulfilled.type]: (state, action) => {
      state.songUrlLoaidng = false;
      state.songsUrl = action.payload;
    },
    [songsUrlDispatch.rejected.type]: (state, action) => {
      state.songUrlLoaidng = false;
      state.songsUrl = '';
      state.urlErr = action.payload;
    },
    [songsStateDisptch.pending.type]: state => {
      state.songUrlLoaidng = true;
    },
    [songsStateDisptch.fulfilled.type]: (state, action) => {
      state.songUrlLoaidng = false;
      state.songsState = action.payload;
    },
    [songsStateDisptch.rejected.type]: (state, action) => {
      state.songUrlLoaidng = false;
    },
    [songsSearch.pending.type]: (state) => {
      // return {...state, loading: true}
      state.search_cLoading = true;
      state.search_cSongs = []
    },
    [songsSearch.fulfilled.type]: (state, action) => {
      state.search_cLoading = false;
      state.search_cSongs = action.payload;
    },
    [songsSearch.rejected.type]: (state, action: PayloadAction<string | null>) => {
      state.search_cLoading = false;
      state.search_cSongsErr = action.payload;
    }
  }
});


export const { updateKeyword } = musicDetailSlice.actions;
export default musicDetailSlice.reducer;
