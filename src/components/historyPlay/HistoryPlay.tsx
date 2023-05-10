import React, { useEffect } from 'react';
import styles from "./index.module.scss"
import { HistoryWarp } from './HistoryWarp';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { clearHistoryList, clearPlayingList } from '@/redux/audioDetail/slice';
import { getRecentSongsDispatch, getScrobbleDispatch } from '@/redux/other/slice';


export const HistoryPlay: React.FC = () => {
  const dispatch = useAppDispatch()
  const cookie = useSelector(state => state.loginUnikey.cookie)
  const historyList = useSelector(state => state.otherSlice.recentSongsData)
  const playlist = useSelector(state => state.audioData.playingList)
  const clearALL = () => {
    dispatch(clearPlayingList([]));
  }
  useEffect(() => {
    if(cookie) {
      const params = {
        limit: 20,
        cookie
      }
      dispatch(getRecentSongsDispatch(params))
    }
  }, [cookie]);


  const moreClick = () => {

  }
  return (
    <div className={styles["history-play"]}>
      <h2>最近在听 <span> {/*<button onClick={clearALL}> <i className="icon iconfont icon-lajitong" /> 清空</button>*/} <button onClick={moreClick}>查询更多</button></span></h2>
      <HistoryWarp playlist={playlist} list={historyList} type={"recommend"}></HistoryWarp>
    </div>
  );
};
