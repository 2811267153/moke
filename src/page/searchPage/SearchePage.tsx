import React, { useEffect, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import { List, ListItem } from '@/components';
import { addPlayingList } from '@/redux/audioDetail/slice';
import { songsSearch_c } from '@/redux/musicDetailProduct/slice';
import { useNavigate } from 'react-router-dom';
import { getSongsInfoData } from '@/redux/albumInfo/slice';

export const SearchePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [queryCount, setQueryCount] = useState(1);
  let searchList: ListItem[] = useSelector(state => state.musicDetailPage.search_cSongs) || [];
  const loading = useSelector(state => state.musicDetailPage.searchLoading);
  const error = useSelector(state => state.musicDetailPage.search_cSongsErr);
  const value = useSelector(state => state.counter.value);
  const playList = useSelector(state => state.audioData.playingList);
  const search_cData = useSelector(state => state.musicDetailPage.searchSongs)
  const ablumAllSongsList = useSelector(state => state.musicAlbumDetail.songsInfoData) || []
  const songsInfoLoading = useSelector(state => state.musicAlbumDetail.songsInfoLoading)

  useEffect(() => {
    PubSub.subscribe('AppChangeQueryCount', (_, index) => {
      setQueryCount(perCount => perCount + 1)
    });
  }, []);

  useEffect(() => {
    if (value.length === 0) {
      navigate('/');
    }
    const params = {
      value,
      offset: queryCount,
      limit: 30
    }
    dispatch(songsSearch_c(params))
  }, [value]);

  useEffect(() => {
    const idList = search_cData.map(item => item.id).join(',');
    console.log(idList);
    if(idList.length !== 0) {
      dispatch(getSongsInfoData(idList))
    }
  }, [search_cData]);
  useEffect(() => {
    console.log(ablumAllSongsList);
  }, [ablumAllSongsList]);

  const handleChangeClick = (index: number) => {
    dispatch(addPlayingList(ablumAllSongsList.songs[index]))
  };

  if (loading ) {
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
        !songsInfoLoading && ablumAllSongsList.songs &&<List handleChangeClick={handleChangeClick} data={ablumAllSongsList.songs}></List>
      }
      {
        loading && queryCount !== 1 && value.length !== 0 &&
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20, alignItems: 'center' }}><Skeleton /><span
          style={{ paddingLeft: 10 }}>加载中...</span></div>
      }
      <div style={{ padding: 40 }}>123</div>
    </>
  );
};
