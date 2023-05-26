import { ListItem } from '@/components/common/List/List';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import db from '../../../db';
import { RootState } from '@/redux/store';

interface initialAudioDetailState {
  audioInfo: ListItem[];
  currentMusic: {},
  songHistoryList: ListItem[]
  playingList: ListItem[]
  musicList: ListItem[]
  isPlaying: boolean
  isLoading: boolean
  isAudioPlay: boolean
}

const initialCounterState: initialAudioDetailState = {
  audioInfo: [],
  currentMusic: {},
  songHistoryList: [],
  playingList: [],
  musicList: [],
  isPlaying: true,
  isAudioPlay: false,
  isLoading: false
};

const audioSlice = createSlice({
  name: 'audioDetail',
  initialState: initialCounterState,
  reducers: {
    isPlayingDispatch(state, action) {
      state.isPlaying = action.payload;
    },
    addPlayingList: (state, action: PayloadAction<any>) => {
      state.playingList = action.payload.value;
    },
    deleteAllFromPlayingList: (state, action: PayloadAction<ListItem>) => {
      state.playingList = []
    },
    musicListDispatch: (state, action) => {
      state.musicList = action.payload
    },
    playingList(state, action) {
      state.playingList = action.payload
    },
    isLoadingDispatch(state, action) {
      state.isLoading = action.payload;
    },
    changeAudioPlay(state, action) {
      state.isAudioPlay = action.payload;
    },
    clearHistoryList(state, action) {
      state.songHistoryList = [];
      ipcRenderer.send('setSongHistoryListData', []);
    },
    clearPlayingList(state, action) {
      state.playingList = [];
      ipcRenderer.send('setSongplayingList', []);
    },
    removeAudioData(state, action) {
      const index = state.audioInfo.findIndex(obj => obj.id === action.payload.id);
      if (index !== -1) {
        state.audioInfo.splice(index, 1);
      }
    }
  }
});

export const {
  isPlayingDispatch,
  clearHistoryList,
  changeAudioPlay,
  clearPlayingList,
  isLoadingDispatch,
  musicListDispatch,
  removeAudioData,
  playingList
} = audioSlice.actions;

export const addPlayingList = (payload: ListItem[]) => async (dispatch: Dispatch, getState: () => RootState) => {
  const playlist = { key: "playlist", value: payload }
  const dbData: {key: string, value: ListItem[]}= await new Promise((resolve, reject) => {
    db.findOne({ key: playlist.key }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  if (dbData) {
    db.update({ key: playlist.key }, playlist, {}, (err, numReplaced) => {
      if (!err) {
        dispatch({ type: 'audioDetail/addPlayingList', payload: playlist });
      } else {
        console.log('数据更新失败', err);
      }
    });
  } else {
    db.insert(playlist, (err, res) => {
      if (!err) {
        dispatch({ type: 'audioDetail/addPlayingList', payload: playlist });
      } else {
        console.log('数据插入失败', err);
      }
    });
  }
};

//删除所有类型为playlist的对象
export const deleteAllFromPlayingList = () => async (dispatch: Dispatch, getState: () => RootState) => {
  db.remove({ key: 'playlist' }, { multi: true }, (err, numRemoved) => {
    if (!err) {
      dispatch({ type: 'audioDetail/deleteAllFromPlayingList' });
    } else {
      console.log('数据删除失败', err);
    }
  });
};



export default audioSlice.reducer;
