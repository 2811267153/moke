import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { Image } from '@/components';
import { v4 as uuidv4 } from 'uuid';

export interface ListItem {
  singer: string | undefined;
  count: number;
  type: string
  al: any
  ar: any[],
  artists: any[],
  copyrightId: number,
  duration: number
  fee: number
  ftype: number
  id: number
  mark: number
  url: string
  mvid: number
  name: string | number
  rUrl: string | number | null
  rtype: string | number;
  status: number | string
  size: number | string
  blurPicUrl: string,
  time: number
  autoplay: boolean,
  currentTime: number,
  index: number
}

interface PropsType {
  data: ListItem[],
  privileges?: []
  onClick?: (value: ListItem) => void;
  handleChangeClick?: (index: number) => void
}

export const List: React.FC<PropsType> = ({ data, privileges, onClick, handleChangeClick }) => {
  const handleClick = (index: number) => {
    if (handleChangeClick) {
      handleChangeClick(index);
    }
  };

  return (
    <div className={styles['item-warp']}>
      {
        data && data?.map((item, index) => {
          return <div onClick={() => handleClick(index)} className={styles['item-info']} key={index}>
            <div className={styles['item-name']}>
              <Image width={50} height={50} src={item?.al?.picUrl || ""} style={{ borderRadius: 5, marginLeft: 10 }} />
              <span style={{ marginLeft: 20 }}>{item.name}</span>
            </div>
            <div className={styles['item-list']}>
              <p>{item && item.ar && item.ar[0].name || "未知艺术家"}
              </p>
            </div>
            <div className={styles['item-al']}>
              专辑: {item?.al?.name|| "未知专辑"}
            </div>
            <div className={styles['item-duration']}>
              <i className='icon iconfont icon-bofang' />
              <i className='icon iconfont icon-xihuan2' />
            </div>
          </div>;
        })
      }
    </div>
  );
};