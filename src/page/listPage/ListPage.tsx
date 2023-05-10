import React, { useEffect } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { Carousel } from 'antd';
import { getBanner } from '@/redux/other/slice';
import styles from './index.module.scss';
import { message } from 'antd/lib';
import { List, ListItem } from '@/components';
import { changeAudioPlay } from '@/redux/audioDetail/slice';

const { shell } = require('electron');

export const ListPage: React.FC = () => {
  const playingList = useSelector(state => state.audioData.playingList) || [];
  const banner = useSelector(state => state.otherSlice.bannerData) || [];
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getBanner());
  }, []);

  const handleBannerClick = (url: string) => {
    shell.openExternal(url).then().catch(e => {
      message.error({
        content: e
      });
    });
  };
  const handleChangeClick = (index: number) => {
    PubSub.publish('currentIndex', index);
    dispatch(changeAudioPlay(true));
  };
  return <div>
    <div className={styles['banner-warp']}>
      <Carousel autoplay effect='fade'>
        {banner.map(item => {
          return <div className={styles['banner-item']}>
            <img src={item.pic} alt='' />
            <button onClick={() => handleBannerClick(item.url)}>了解一下</button>
          </div>;
        })
        }
      </Carousel>
    </div>

    <List handleChangeClick={handleChangeClick} data={playingList} />
  </div>;
};
