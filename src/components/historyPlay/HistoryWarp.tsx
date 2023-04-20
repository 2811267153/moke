import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { HistoryItem } from '@/components/historyPlay/HistoryItem';
import { ListItem } from '@/components';
import { useAppDispatch } from '@/redux/hooks';
import { clearHistoryList, playingList } from '@/redux/audioDetail/slice';
import useScrollbarSize from 'react-scrollbar-size';
import { useHorizontalScroll } from '@/hooks/scrollHook';


export interface List {
  list: ListItem[],
  type?: string,
  listAll?: ListItem[]
}

export const HistoryWarp: React.FC<List> = ({ list, listAll, type }) => {
  const dispatch = useAppDispatch();
  const scrollRef = useHorizontalScroll();

  const handleItemClick = (index: number) => {
    const copyList = {...list[index], autoplay: true, index: index};
    dispatch(playingList(listAll));
  }

  return (
    <div className={styles["history"]} style={{overflow: "hidden"}}>
      <div
        className={styles['history-warp']}
        ref={scrollRef}
      >
        {list?.length !== 0 ? (
          list.map((item, index) => (
            <HistoryItem
              key={item.id}
              type={type}
              imgUrl={item.al?.picUrl ?? ''}
              singer={item.ar?.[0]?.name ?? ''}
              songName={item.name}
              count={item.count}
              index={index}
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
