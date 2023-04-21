import { createSlice, createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import {
  getLoginCheckStates,
  getLoginQrImage,
  getLoginState,
  getLoginStateData,
  getLoginUnikey
} from '@/axios/recommend/Login';
import { ListItem } from '@/components';
import db from '../../../db';
import { RootState } from '@/redux/store';


interface loginUnikeytate {
  loading: boolean,
  unikey: any, //二维码图片
  QrImage: any, //二维码
  loginData: any, //登录状态
  checkStates: any, //检查登陆状态
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
    const loginData =  await getLoginState();
    console.log(loginData);
    return loginData
  }
);
export const loginCheckStates = createAsyncThunk(
  'loginCheckStateDetail/loginCheckStates',
  async(params: LoginQrImageParams) => {
    const { key, time } = params;
    const checkStates =  await getLoginCheckStates(key, time);
    console.log(checkStates);
    return checkStates
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
  unikey: '', //二维码图片
  QrImage: '', //二维码
  loginData: '', //登录状态
  checkStates: '', //检查登陆状态
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
      state.unikey = action.payload;
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
      state.QrImage = action.payload;
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
      state.loginData = action.payload;
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
      state.checkStates = action.payload;
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

export const CaCheCookie = (payload: any) => async (dispatch: Dispatch, getState: () => RootState) => {
  const cookie = {key: "cookie", value: payload}
  const dbData:  {key: string, payload: any} = await new Promise((resolve, reject) => {
    db.find({ key: cookie.key }).limit(1).exec((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data[0]);
      }
    });
  });

  if (dbData) {
    db.update({ key: payload.value }, cookie, {}, (err, numReplaced) => {
      if (!err) {
        dispatch({ type: 'getLoginUnikeyDetailSlice/CheckCookie', payload: cookie });
      } else {
        console.log('数据更新失败', err);
      }
    });
  } else {
    db.insert(cookie, (err, res) => {
      if (!err) {
        dispatch({ type: 'getLoginUnikeyDetailSlice/CheckCookie', payload: cookie });
      } else {
        console.log('数据插入失败', err);
      }
    });
  }
};
export const {CheckCookie, isShowLoading} = getLoginUnikeyDetailSlice.actions