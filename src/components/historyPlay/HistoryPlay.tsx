import React from 'react';
import styles from "./index.module.scss"
import { HistoryWarp } from './HistoryWarp';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { clearHistoryList, clearPlayingList, songHistoryListData } from '@/redux/audioDetail/slice';
import { ipcRenderer } from 'electron';

export const HistoryPlay: React.FC = () => {
  const historyList = useSelector(state => state.audioData.songHistoryList) || []
  const dispatch = useAppDispatch()

  const clearALL = () => {
    // dispatch(clearHistoryList([]));
    dispatch(clearPlayingList([]));
    ipcRenderer.send("getSongHistoryListData")
    ipcRenderer.on('getsongHistoryList', (e, data) => {
      dispatch(songHistoryListData(data));
    });
  }

  const moreClick = () => {

  }
  return (
    <div className={styles["history-play"]}>
      <h2>最近在听 <span> <button onClick={clearALL}> <i className="icon iconfont icon-lajitong" /> 清空</button> <button onClick={moreClick}>查询更多</button></span></h2>
      <HistoryWarp listAll={historyList} list={historyList} type={"recommend"}></HistoryWarp>
    </div>
  );
};