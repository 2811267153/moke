import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from "@/redux/TestRedux/slice"
import audioSliceReducer from "@/redux/audioDetail/slice"
import { musicDetailSlice } from '@/redux/musicDetailProduct/slice';
import { musicLyricSlice } from '@/redux/getLyric/slice';
import { recommendSongsDetailSlice } from '@/redux/recmmendSongs/slice';
import { getLoginUnikeyDetailSlice } from '@/redux/accountLogin/slice';
import { getRecommendPlaySlice } from '@/redux/recommendPlayList/slice';
import { musicAlbumSlice } from '@/redux/albumInfo/slice';
import { accountSlice } from '@/redux/accountLogin/accountSlice';
import { otherSlice } from '@/redux/other/slice';
import { feedInfoSlice } from '@/redux/feedInfo/slice';
import { artistSlice } from '@/redux/artist/slice';

import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  counter: counterReducer,
  audioData: audioSliceReducer,

  musicDetailPage: musicDetailSlice.reducer,
  musicLyric: musicLyricSlice.reducer,
  recommendSongs: recommendSongsDetailSlice.reducer,
  loginUnikey: getLoginUnikeyDetailSlice.reducer,
  recommendPlayList: getRecommendPlaySlice.reducer,
  musicAlbumDetail: musicAlbumSlice.reducer,
  userSlice: accountSlice.reducer,
  otherSlice: otherSlice.reducer,
  feedInfo: feedInfoSlice.reducer,
  artistInfo: artistSlice.reducer
})
// const store = createStore(rootReducer, applyMiddleware(thunk));
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: true
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;