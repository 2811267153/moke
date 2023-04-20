import React, { useEffect, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { Skeleton } from '@/components/common/Skeleton/Skeleton';
import { List, ListItem } from '@/components';
import { playingList } from '@/redux/audioDetail/slice';
import { ipcRenderer } from 'electron';
import { songsSearch } from '@/redux/musicDetailProduct/slice';
import { useNavigate } from 'react-router-dom';

export const SearchePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [queryCount, setQueryCount] = useState(1);
  const [searchListItem, setSearchListItem] = useState<ListItem[]>([]);
  const searchList: ListItem[] = useSelector(state => state.musicDetailPage.search_cSongs) || [];
  const loading = useSelector(state => state.musicDetailPage.search_cLoading);
  const error = useSelector(state => state.musicDetailPage.search_cSongsErr);
  const value = useSelector(state => state.counter.value);
  const historyList = useSelector(state => state.audioData.audioInfo);
  const playList = useSelector(state => state.audioData.playingList);
  const handleChangeClick = (index: number) => {
    const songsItem = searchListItem[index];
    const findIndex = playList.findIndex((el) => el.id === songsItem.id);
    if (findIndex !== -1) {
      const newPlayList = playList.slice();
      newPlayList.splice(index, 1);
      dispatch(playingList([songsItem, ...newPlayList]));
    } else {
      dispatch(playingList([songsItem, ...playList]));
    }
  };
  useEffect(() => {
    if (value.length === 0) {
      navigate('/');
    }
  }, [value]);

  useEffect(() => {
    ipcRenderer.send('setSongHistoryListData', historyList);
  }, [historyList]);

  useEffect(() => {
    const params = {
      value,
      offset: queryCount
    };
    dispatch(songsSearch(params));
  }, [queryCount]);

  useEffect(() => {
    const list = [...searchListItem, ...searchList];
    setSearchListItem(searchList.length > 0 ? list : []);
  }, [searchList, searchListItem]);

  useEffect(() => {
    PubSub.subscribe('AppChangeQueryCount',(_, data) => {
      setQueryCount(queryCount + 1)
    })
  }, []);

  if (loading && queryCount == 1 && value.length !== 0) {
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
        searchList && <List handleChangeClick={handleChangeClick} data={searchListItem}></List>
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
