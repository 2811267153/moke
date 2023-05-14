import React, { useEffect, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import { List, ListItem } from '@/components';
import { addPlayingList, changeAudioPlay } from '@/redux/audioDetail/slice';
import { songsSearch_c } from '@/redux/musicDetailProduct/slice';
import { useNavigate } from 'react-router-dom';
import { getSongsInfoData } from '@/redux/albumInfo/slice';
import { Pagination, PaginationProps } from 'antd';
import { current } from '@reduxjs/toolkit';

export const SearchePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [queryCount, setQueryCount] = useState(1);
  const loading = useSelector(state => state.musicDetailPage.searchLoading);
  const error = useSelector(state => state.musicDetailPage.search_cSongsErr);
  const value = useSelector(state => state.counter.value);
  const search_cData = useSelector(state => state.musicDetailPage.searchSongs)
  const ablumAllSongsList = useSelector(state => state.musicAlbumDetail.songsInfoData.songs) || []
  const playlist = useSelector(state => state.audioData.playingList || [])
  const songsInfoLoading = useSelector(state => state.musicAlbumDetail.songsInfoLoading)

  useEffect(() => {
    if (value.length === 0) {
      navigate('/');
    }
  }, [value]);

  useEffect(() => {

   const idList = search_cData?.songs?.map((item: any) => item.id).join(',');
    if(idList && idList.length !== 0) {
      dispatch(getSongsInfoData(idList))
    }
    console.log(search_cData?.songs);
  }, [search_cData]);

  const handleChangeClick = (index: number) => {
    PubSub.publish('currentIndex', index);
    dispatch(changeAudioPlay(true));
    // console.log("ablumAllSongsList", [ablumAllSongsList[index], ...playlist]);
    dispatch(addPlayingList([ablumAllSongsList[index], ...playlist]))
  };
  const onChange: PaginationProps['onChange'] = (page) => {
    setQueryCount(page);
    dispatch(songsSearch_c({ value, offset: page }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 50px)' }}>
        <Skeleton />;
      </div>);
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      {
        !songsInfoLoading && ablumAllSongsList && <div>
          <List handleChangeClick={handleChangeClick} data={ablumAllSongsList}></List>
          <div style={{textAlign: 'center'}}>
            <Pagination showSizeChanger={false} defaultCurrent={1} current={queryCount}  total={search_cData.songCount} onChange={onChange} />;
          </div>
        </div>
      }
    </>
  );
};
