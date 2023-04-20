import React, { useImperativeHandle } from 'react';
import { Image } from '@/components';
import styles from './index.module.scss';

interface ScrollRef {
  handleItemClicks: Function
}
interface PropsTypes {
  imgUrl: string;
  singer: string | undefined;
  songName: string | number;
  type: string | undefined,
  key: number
  index: number
  onClick: Function
}

export const HistoryItem: React.FC<PropsTypes> = ({ imgUrl, singer, songName, type, key, index, onClick }) => {
  const handleItemClicks = (i: number) => {
    onClick(index)
  };
  if (type === 'recommend') {
    return <div className={styles['history-item']} onClick={() => handleItemClicks(index)} >
      <div className={styles['image-masike']}>
        <i className='icon iconfont icon-bofang-01 play-icon' />
        <s />
      </div>
      <Image className={styles['history-image']} height={140} width={'130px'} src={imgUrl}></Image>
      <p className={styles['history-text']}>
        <span>
          {singer} - {songName}
        </span>
      </p>
      <div className={styles['history-item-solid']}>
      </div>
    </div>;

  }
  return (
    <div className={styles['history-item']}>
      <div className={styles['image-masike']} style={{ position: 'absolute', top: '30px' }}>
        <i className='icon iconfont icon-bofang-01 play-icon' />
        <s />
      </div>
      <Image className={styles['history-image']} height={140} width={'130px'} src={imgUrl}></Image>
      <p className={styles['history-text']}>
        <span>
          {singer} - {songName}
        </span>
      </p>
    </div>
  )}
