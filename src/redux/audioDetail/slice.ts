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
  isPlaying: boolean
  isLoading: boolean
  isAudioPlay: boolean
}

const initialCounterState: initialAudioDetailState = {
  audioInfo: [],
  currentMusic: {},
  songHistoryList: [],
  playingList: [],
  isPlaying: false,
  isAudioPlay: false,
  isLoading: true
};

const audioSlice = createSlice({
  name: 'audioDetail',
  initialState: initialCounterState,
  reducers: {
    isPlayingDispatch(state, action) {
      state.isPlaying = action.payload;
    },
    addPlayingList: (state, action: PayloadAction<ListItem>) => {
      state.playingList.unshift(action.payload);
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
  removeAudioData,
  playingList
} = audioSlice.actions;

export const addPlayingList = (payload: ListItem) => async (dispatch: Dispatch, getState: () => RootState) => {
  const dbData: ListItem = await new Promise((resolve, reject) => {
    db.findOne({ id: payload.id }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const copyAction = { ...payload, type: 'playinglist' };
  if (dbData) {
    db.update({ id: payload.id }, copyAction, {}, (err, numReplaced) => {
      if (!err) {
        dispatch({ type: 'audioDetail/addPlayingList', payload: copyAction });
      } else {
        console.log('数据更新失败', err);
      }
    });
  } else {
    db.insert(copyAction, (err, res) => {
      if (!err) {
        dispatch({ type: 'audioDetail/addPlayingList', payload: copyAction });
      } else {
        console.log('数据插入失败', err);
      }
    });
  }
};


export default audioSlice.reducer;
