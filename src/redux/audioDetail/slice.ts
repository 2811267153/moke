import { ListItem } from '@/components/common/List/List';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ipcRenderer } from 'electron';
import { deepClone } from '@/utils';

interface initialAudioDetailState {
  audioInfo: ListItem[];
  currentMusic: {},
  songHistoryList: ListItem[]
  playingList: ListItem[]
  isPlaying: boolean
  isAudioPlay: boolean
}

const initialCounterState: initialAudioDetailState = {
  audioInfo: [],
  currentMusic: {},
  songHistoryList: [],
  playingList: [],
  isPlaying: false,
  isAudioPlay: false
};

const audioSlice = createSlice({
  name: 'audioDetail',
  initialState: initialCounterState,
  reducers: {
    isPlayingDispatch(state, action) {
      state.isPlaying = action.payload;
    },
    addAudioData(state, action: PayloadAction<ListItem>) {
      const { id } = action.payload;
      const exists = state.audioInfo.some(info => info.id === id);
      if (!exists) {
        state.audioInfo.unshift(action.payload);
      }
    },
    currentMusicData(state, action: PayloadAction<ListItem>) {
      const payload = action.payload;
      console.log('copyCurrentMusic', payload);

      if (!payload) {
        return;
      }
      const copyCurrentMusic = deepClone(payload);
      copyCurrentMusic.time = Date.now();
      state.currentMusic = copyCurrentMusic;
      ipcRenderer.send('currentMusic', copyCurrentMusic);
    },
    changeAudioPlay(state, action) {
      state.isAudioPlay = action.payload
    },
    songHistoryListData(state, action: PayloadAction<ListItem[]>) {
      state.songHistoryList = action.payload;
      ipcRenderer.send('setSongHistoryListData', action.payload);
    },
    clearHistoryList(state, action) {
      state.songHistoryList = [];
      ipcRenderer.send('setSongHistoryListData', []);
    },
    clearPlayingList(state, action) {
      state.playingList = [];
      ipcRenderer.send('setSongplayingList', []);
    },
    playingList(state, action) {
      state.playingList = action.payload;
      ipcRenderer.send('setSongplayingList', action.payload);
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
  addAudioData,
  currentMusicData,
  songHistoryListData,
  playingList,
  clearHistoryList,
  changeAudioPlay,
  clearPlayingList,
  removeAudioData
} = audioSlice.actions;

export default audioSlice.reducer;
