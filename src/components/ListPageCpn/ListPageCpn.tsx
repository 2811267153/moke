import React, { RefObject, useEffect, useRef, useState } from 'react';
import styles from '@/page/listPage/index.module.scss';
import { Carousel } from 'antd';
import { CommonEmpty, List, ListItem } from '@/components';
import { addPlayingList, changeAudioPlay } from '@/redux/audioDetail/slice';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { CarouselRef } from 'antd/es/carousel';
import { useParams } from 'react-router-dom';

interface PropsType {
  title: string,
  menuList: string[],
  dataList: any
}
export const ListPageCpn:React.FC<PropsType> = ({title, menuList, dataList}) => {
  const swiperRef = useRef<any>();
  const [currentIndex, setIndex] = useState(0);
  const dispatch = useAppDispatch();
  const handleChangeClick = (index: number) => {
    dispatch(changeAudioPlay(true));
    dispatch(addPlayingList(dataList));
    PubSub.publish('currentIndex', index);
  };
  const handleChangeType = (index: number) => {
    setIndex(index);
    swiperRef.current.goTo(index);
  };
  // @ts-ignore
  return (
    <>
      <div className={styles.list_top}>
        <h2>{title}</h2>
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

      <Carousel ref={swiperRef}>
        <List handleChangeClick={handleChangeClick} data={dataList} />
        <div className={styles['list-empty']}>
          <CommonEmpty description={"未找到相关内容"}></CommonEmpty>
        </div>
        <div className={styles['list-empty']}>
          <CommonEmpty description={"未找到相关内容"}></CommonEmpty>
        </div>
        <div className={styles['list-empty']}>
          <CommonEmpty description={"未找到相关内容"}></CommonEmpty>
        </div>
      </Carousel>
    </>
  )
}