import React, { useEffect, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import { List, ListItem } from '@/components';
import { addPlayingList } from '@/redux/audioDetail/slice';
import { songsSearch_c } from '@/redux/musicDetailProduct/slice';
import { useNavigate } from 'react-router-dom';

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
    console.log(search_cData);
  }, [search_cData]);


  const handleChangeClick = (index: number) => {
    const songsItem = searchList[index];
    const findIndex = playList.findIndex((el) => el.id === songsItem.id);
    if (findIndex !== -1) {
      const newPlayList = playList.slice();
      newPlayList.splice(index, 1);
      console.log(songsItem);
      dispatch(addPlayingList(songsItem));
    } else {
      console.log(songsItem);
      dispatch(addPlayingList(songsItem));
    }
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
        searchList && <List handleChangeClick={handleChangeClick} data={searchList}></List>
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
