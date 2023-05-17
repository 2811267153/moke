import React, { MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
// import styles from './index.module.scss';
import { CommonEmpty, List, ListItem, ListPageCpn } from '@/components';
import { addPlayingList, changeAudioPlay} from '@/redux/audioDetail/slice';
import { useParams } from 'react-router-dom';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/es/carousel';


export const ListPage: React.FC = () => {
  const { type } = useParams();
  const [title, setTitle] = useState('');
  const [menuList, setMenuList] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'file') {
      setTitle("本地与下载")
      setMenuList(['本地歌曲', '下载歌曲', '下载视频', '正在下载'])
    } else if (type === 'live') {
      setTitle("我喜欢")
      setMenuList([])
    } else {
      setTitle("本地与播放列表")
      setMenuList(['当前播放列表', '下载歌曲', '下载视频', '正在下载'])
    }
  }, [type]);

  const contentStyle: React.CSSProperties = {
    margin: 0,
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79'
  };

  return <div>
    <ListPageCpn menuList={menuList} title={title}></ListPageCpn>
  </div>;
};
