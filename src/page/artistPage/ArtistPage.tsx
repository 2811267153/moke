import React, { Fragment, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import {
  artistListInKoreaDispatch,
  getTopListArtistDispatch,
  getTopListArtistJapanDispatch,
  getTopListArtistOccidentDispatch
} from '@/redux/artist/slice';
import styles from './index.module.scss';
import { CommonGrid } from '@/components';
import { animate, format, formatTimestamp } from '@/utils';

export const ArtistPage: React.FC = () => {
  const artistList = useSelector(state => state.artistInfo.topListArtistData.slice(0, 15)) || [];
  const artistListInOccident = useSelector(state => state.artistInfo.artistListInOccident.slice(0, 15)) || [];
  const artistListInJapan = useSelector(state => state.artistInfo.artistListInJapan.slice(0, 15)) || [];
  const artistListInKorea = useSelector(state => state.artistInfo.artistListInKorea.slice(0, 15)) || [];
  const artistLoading = useSelector(state => state.artistInfo.topListArtistLoading);
  const [scrollTo, setScrollTo] = useState<number[]>([]);
  const dispatch = useAppDispatch();

  const artistListRef = useRef<HTMLDivElement>(null);
  const OccidentRef = useRef<HTMLDivElement>(null);
  const JapanRef = useRef<HTMLDivElement>(null);
  const KoreaRef = useRef<HTMLDivElement>(null);
  const [artistListRefTop, setArtistListRefTop] = useState(0);
  const [OccidentRefTop, setOccidentRefTop] = useState(0);
  const [JapanRefTop, setJapanRefTop] = useState(0);
  const [KoreaRefTop, setKoreaRefTop] = useState(0);
  const navigateList = ['华语', '欧美', '韩国', '日本'];
  const [navigateIndex, setNavigateIndex] = useState(0);

  useEffect(() => {
    const scroll = [artistListRefTop, OccidentRefTop, JapanRefTop, KoreaRefTop];
    setScrollTo(scroll);
  }, [artistListRefTop, OccidentRefTop, JapanRefTop, KoreaRefTop]);

  useEffect(() => {
    PubSub.subscribe('AppChangeQueryCounts', (_, scrollPos: number) => {
      if (scrollTo[0] < scrollPos && scrollPos < scrollTo[1]) {
        setNavigateIndex(0);
      } else if (scrollTo[1] < scrollPos && scrollPos < scrollTo[2]) {
        setNavigateIndex(1);
      } else if (scrollTo[2] < scrollPos && scrollPos < scrollTo[3]) {
        setNavigateIndex(2);
      } else if (scrollTo[3] < scrollPos) {
        setNavigateIndex(3);
      }else {
        setNavigateIndex(0);
      }
    });
  }, [scrollTo]);
  useEffect(() => {
    dispatch(getTopListArtistDispatch(1));
    dispatch(getTopListArtistOccidentDispatch(2));
    dispatch(getTopListArtistJapanDispatch(3));
    dispatch(artistListInKoreaDispatch(4));
    PubSub.subscribe('imageLoading', () => {
      setArtistListRefTop((artistListRef.current?.offsetTop ?? 0) - 100);
      setOccidentRefTop((OccidentRef.current?.offsetTop ?? 0) - 100);
      setJapanRefTop((JapanRef.current?.offsetTop ?? 0) - 100);
      setKoreaRefTop((KoreaRef.current?.offsetTop ?? 0) - 100);
    });
  }, []);

  const handleNavigateClick = (index: number) => {
    console.log(scrollTo[index]);
    PubSub.publish('ArtistScrollTo', scrollTo[index]);
    setNavigateIndex(index);
  };

  return <>
    <div>
      <div className={styles.navigate}>
        {
          navigateList.map((navigate: string, index: number) => {
            return <a className={navigateIndex === index ? styles.activeNavigate : ''}
                      onClick={() => handleNavigateClick(index)}>{navigate} <i /></a>;
          })
        }
      </div>
      <div style={{ height: 55 }}></div>
      <h2>歌手排行榜（收集各地最受欢迎的歌手）</h2>
      <div ref={artistListRef}>
        <p style={{ padding: '10px 15px'}}>华语</p>
        <CommonGrid type='artist' data={artistList}></CommonGrid>
      </div>
      <div ref={OccidentRef}>
        <p style={{ padding: '10px 15px'}}>欧美</p>
        <CommonGrid type="artist" data={artistListInOccident}></CommonGrid>
      </div>
      <div ref={JapanRef}>
        <p style={{ padding: '10px 15px'}}>韩国</p>
        <CommonGrid type="artist" data={artistListInJapan}></CommonGrid>
      </div>
      <div ref={KoreaRef}>
        <p style={{ padding: '10px 15px'}}>日本</p>
        <CommonGrid type='artist' data={artistListInKorea}></CommonGrid>
      </div>
    </div>
  </>;
};