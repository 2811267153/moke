import React from 'react';
import styles from './index.module.scss';
import { HistoryItem } from '@/components/historyPlay/HistoryItem';
import { ListItem, LoginErr } from '@/components';
import { useAppDispatch } from '@/redux/hooks';
import { addPlayingList, changeAudioPlay } from '@/redux/audioDetail/slice';
import { useHorizontalScroll } from '@/hooks/scrollHook';


export interface List {
  list: any,
  type?: string,
  playlist: ListItem[]
}

export const HistoryWarp: React.FC<List> = ({ list, playlist, type }) => {
  const dispatch = useAppDispatch();
  const scrollRef = useHorizontalScroll();

  const handleItemClick = (index: number) => {
    const data = list.map((item: any) => {
      return  item.data;
    })
    dispatch(changeAudioPlay(true));
    PubSub.publish('currentIndex', index);
    dispatch(addPlayingList(data));
  }

  return (
    <div className={styles["history"]} style={{overflow: "hidden"}}>
      <div
        className={styles['history-warp']}
        ref={scrollRef}
      >
        {list?.length !== 0 ? (
          list.map((item: any, index: number) => (
            <HistoryItem
              key={item.data.id}
              type={type}
              index={index}
              imgUrl={item.data.al?.picUrl ?? ''}
              singer={item.data.ar?.[0]?.name ?? ''}
              songName={item.data.name}
              onClick={handleItemClick}
            />
          ))
        ) : (
          <LoginErr  message={"登陆以后会获取手机上播放过的音乐展示在这里哦~"} height={200}></LoginErr>
        )}
      </div>
    </div>
  );
};
