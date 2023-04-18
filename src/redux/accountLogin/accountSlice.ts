import {
  getAccountInfo,
  getUserBinding,
  getUserDetail,
  getUserInfo,
  getUserPlaylist,
  getUserSubcount
} from '@/axios/recommend/account';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface initAccountSlice {
  accountInfoLoading: boolean,
  accountInfoData: any,
  accountInfoErr: null | string
  userSubcountLoading: boolean,
  userSubcountData: any[],
  userSubcountErr: null | string
  userPlaylistLoading: boolean,
  userPlaylistData: any[],
  userPlaylistErr: null | string
  userDetailLoading: boolean,
  userDetailstData: any[],
  userDetailstErr: null | string
  userBindingLoading: boolean,
  userBindingData: any[],
  userBindingErr: null | string
  userInfoLoading: boolean,
  userInfoData: [],
  userInfoErr: null | string,
  userDataInfo: []
}
const initialState: initAccountSlice = {
  accountInfoLoading: true,
  accountInfoData: {},
  accountInfoErr: null,
  userInfoLoading: true,
  userInfoData: [],
  userInfoErr: null,
  userSubcountLoading: true,
  userSubcountData: [],
  userSubcountErr: null,
  userPlaylistLoading: true,
  userPlaylistData: [],
  userPlaylistErr: null,
  userDetailLoading: true,
  userDetailstData: [],
  userDetailstErr: null,
  userBindingLoading: true,
  userBindingData: [],
  userBindingErr: null,
  userDataInfo: []
}
export const accountInfo = createAsyncThunk(
  "accountInfo/accountSlice",
  async (cookie: string) => {
    return await getAccountInfo(cookie)
  }
)
export const userInfo = createAsyncThunk(
  "accountInfo/userInfo",
  async (cookie: string) => {
    const data = await getUserInfo(cookie)
    return data
  }
)
export const userSubcount = createAsyncThunk(
  "accountInfo/userSubcount",
  async (cookie: string) => {
    const data = await getUserSubcount(cookie)
    return data
  }
)
export const userPlaylist = createAsyncThunk(
  "accountInfo/userPlaylist",
  async (cookie: string) => {
    const data = await getUserPlaylist(cookie)
    return data
  }
)
export const userDetail = createAsyncThunk(
  "accountInfo/userDetail",
  async (cookie: string) => {
    const data = await getUserDetail(cookie)
    return data
  }
)
export const userBinding = createAsyncThunk(
  "accountInfo/userBinding",
  async (cookie: string) => {
    const data = await getUserBinding(cookie)
    return data
  }
)
export const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    userDataInfo:(state, action) => {

    }
  },
  extraReducers: {
    [accountInfo.pending.type]: state => {
      state.accountInfoLoading = true;
    },
    [accountInfo.fulfilled.type]: (state, action) => {
      state.accountInfoLoading = false;
      state.accountInfoData = action.payload;
    },
    [accountInfo.rejected.type]: (state, action) => {
      state.accountInfoLoading = false;
      state.accountInfoErr = action.payload;
    },

    [userInfo.pending.type]: state => {
      state.userSubcountLoading = true;
    },
    [userInfo.fulfilled.type]: (state, action) => {
      state.userInfoLoading = false;
      state.userInfoData = action.payload;
    },
    [userInfo.rejected.type]: (state, action) => {
      state.userInfoLoading = false;
      state.userInfoData = action.payload;
    },

    [userSubcount.pending.type]: state => {
      state.userSubcountLoading = true;
    },
    [userSubcount.fulfilled.type]: (state, action) => {
      state.userSubcountLoading = false;
      state.userSubcountData = action.payload;
    },
    [userSubcount.rejected.type]: (state, action) => {
      state.userSubcountLoading = false;
      state.userSubcountData = action.payload;
    },

    [userPlaylist.pending.type]: state => {
      state.userPlaylistLoading = true;
    },
    [userPlaylist.fulfilled.type]: (state, action) => {
      state.userPlaylistLoading = false;
      state.userPlaylistData = action.payload;
    },
    [userPlaylist.rejected.type]: (state, action) => {
      state.userPlaylistLoading = false;
      state.userPlaylistErr = action.payload;
    },

    [userDetail.pending.type]: state => {
      state.userDetailLoading = true;
    },
    [userDetail.fulfilled.type]: (state, action) => {
      state.userDetailLoading = false;
      state.userDetailstData = action.payload;
    },
    [userDetail.rejected.type]: (state, action) => {
      state.userDetailLoading = false;
      state.userDetailstErr = action.payload;
    },

    [userBinding.pending.type]: state => {
      state.userBindingLoading = true;
    },
    [userBinding.fulfilled.type]: (state, action) => {
      state.userBindingLoading = false;
      state.userBindingData = action.payload;
    },
    [userBinding.rejected.type]: (state, action) => {
      state.userBindingLoading = false;
      state.userBindingErr = action.payload;
    },
  }
})
export const {userDataInfo} = accountSlice.actions