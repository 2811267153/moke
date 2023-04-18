import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getLoginCheckStates,
  getLoginQrImage,
  getLoginState,
  getLoginStateData,
  getLoginUnikey
} from '@/axios/recommend/Login';


interface loginUnikeytate {
  loading: boolean,
  data: any,
  error: null | string,
  cookie: string,
  monitorLoginStates: any
  showLoading: boolean
}
interface LoginQrImageParams {
  key: string;
  time: string | number;
}
//获取二维码关键字
export const loginUnikey = createAsyncThunk(
  'loginUnikeyDetail/loginUnikey',
  async () => {
    const { data } =  await getLoginUnikey();
    return data.unikey
  }
);
//获取图片url
export const loginQrImage = createAsyncThunk(
  'loginQrImageDetail/loginQrImage',
  async(params: LoginQrImageParams) => {
    const { key, time } = params;
    const { data } = await getLoginQrImage(key, time);
    return data.qrimg
  }
);
//获取登陆状态
export const loginState = createAsyncThunk(
  'loginStateDetail/loginState',
  async () => {
    const data =  await getLoginState();
    console.log(data);
  }
);
export const loginCheckStates = createAsyncThunk(
  'loginCheckStateDetail/loginCheckStates',
  async(params: LoginQrImageParams) => {
    const { key, time } = params;
    const data =  await getLoginCheckStates(key, time);
    console.log(data);
  }
);
export const monitorLoginStates = createAsyncThunk(
  'loginCheckStateDetail/loginCheckStates',
  async(cookie: string) => {
    const data =  await getLoginStateData(cookie);
    return data
  }
);

const initialState: loginUnikeytate = {
  loading: true,
  data: [],
  error: null,
  cookie: "",
  monitorLoginStates: '',
  showLoading: false
};

export const getLoginUnikeyDetailSlice = createSlice({
  name: 'loginUnikeyDetail',
  reducers: {
    CheckCookie(state, action) {
      state.cookie = action.payload
    },
    isShowLoading(state, action) {
      state.showLoading = action.payload
    }
  },
  initialState,
  extraReducers: {
    //获取二维码关键字
    [loginUnikey.pending.type]: state => {
      state.loading = true;
    },
    [loginUnikey.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [loginUnikey.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //获取图片url
    [loginQrImage.pending.type]: state => {
      state.loading = true;
    },
    [loginQrImage.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [loginQrImage.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //获取登陆状态
    [loginState.pending.type]: state => {
      state.loading = true;
    },
    [loginState.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [loginState.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //获取cookie
    [loginCheckStates.pending.type]: state => {
      state.loading = true;
    },
    [loginCheckStates.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [loginCheckStates.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //获取登录状态
    [monitorLoginStates.pending.type]: state => {
      state.loading = true;
    },
    [monitorLoginStates.fulfilled.type]: (state, action) => {
      state.loading = false;
      state.monitorLoginStates = action.payload;
    },
    [monitorLoginStates.rejected.type]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {CheckCookie, isShowLoading} = getLoginUnikeyDetailSlice.actions