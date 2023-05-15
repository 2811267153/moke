import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import styles from './index.module.scss';
import { List, ListItem } from '@/components';
import { addPlayingList, changeAudioPlay, deleteAllFromPlayingList, playingList } from '@/redux/audioDetail/slice';
import { useParams } from 'react-router-dom';
import { readdirSync } from 'fs';
import { songsSearch_c } from '@/redux/musicDetailProduct/slice';
import { getSongsInfoData } from '@/redux/albumInfo/slice';
import { FindFiles, getMusicListByIds } from '@/utils/findFiles';


export const ListPage: React.FC = () => {
  const playList = useSelector(state => state.audioData.playingList) || [];

  const menuList = ['本地歌曲', '下载歌曲', '下载视频', '正在下载'];
  const [currentIndex, setIndex] = useState(0);
  const { type } = useParams();
  const dispatch = useAppDispatch();
  const [list, setList] = useState<ListItem[]>([]); //保存的未被初始化的音乐

  useEffect(() => {
    PubSub.subscribe("ListPageData", (_, data) => {
      setList(data)
    })
  }, []);


  useEffect(() => {
    if (type === 'file') {

    } else if (type === 'live') {

    } else {

    }
  }, [type]);


  const handleChangeClick = (index: number) => {
    dispatch(changeAudioPlay(true));
    PubSub.publish('currentIndex', index);
    dispatch(addPlayingList(list))
  };
  const handleChangeType = (index: number) => {
    setIndex(index);
  };
  return <div>
    <div className={styles.list_top}>
      <h2>本地与下载</h2>
      <div className={styles.deputy_name}>
        {
          menuList.map((item: string, index) => {
            return <button onClick={() => handleChangeType(index)}
                           className={`${styles.deputy_item} ${index === currentIndex ? styles.active : ''}`}
                           key={item}>
              <p>{item}
                <i className={styles.deputy_solid} />
              </p>
            </button>;
          })
        }
      </div>
    </div>
    <List handleChangeClick={handleChangeClick} data={list} />
  </div>;
};
