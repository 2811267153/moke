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
    isLoadingDispatch(state, action) {
      state.isLoading = action.payload
    },
    changeAudioPlay(state, action) {
      state.isAudioPlay = action.payload
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
  playingList,
  clearHistoryList,
  changeAudioPlay,
  clearPlayingList,
  isLoadingDispatch,
  removeAudioData
} = audioSlice.actions;

export default audioSlice.reducer;
