import React from 'react';
import styles from './index.module.scss';
import { HistoryItem } from '@/components/historyPlay/HistoryItem';
import { ListItem } from '@/components';
import { useAppDispatch } from '@/redux/hooks';
import { addPlayingList } from '@/redux/audioDetail/slice';
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
    const copyPlaylist = list?.[index].data as ListItem
    dispatch(addPlayingList(copyPlaylist));
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
          <div className={styles["history-result"]} >
            <span>当前还没有播放记录, 先去听歌吧~</span>
            <img src='src/assets/image/benhua.png' alt='' />
          </div>
        )}
      </div>
    </div>
  );
};
