import React, {useEffect, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import {  ListItem, ListPageCpn } from '@/components';
import { useParams } from 'react-router-dom';
import { getLikeListDispatch } from '@/redux/other/slice';
import { getSongsData } from '@/redux/albumInfo/slice';


export const ListPage: React.FC = () => {
  const { type } = useParams();
  const dispatch = useAppDispatch()
  const userInfo = useSelector(state => state.userSlice.accountInfoData) || null;
  const likeList = useSelector(state => state.otherSlice.likelistData) || []
  const songsList = useSelector(state => state.musicAlbumDetail.songsList) || []

  const cookie = useSelector(state => state.loginUnikey.cookie)
  const loading = useSelector(state => state.otherSlice.likelistLoading)
  const likeListErr = useSelector(state => state.otherSlice.likelistErr)
  const [list, setList] = useState<ListItem[]>([]); //保存的未被初始化的音乐

  const [title, setTitle] = useState('');
  const [menuList, setMenuList] = useState<string[]>([]);

  useEffect(() => {
    if (type === 'file') {
      setTitle("本地与下载")
      setMenuList(['本地歌曲', '下载歌曲', '下载视频', '正在下载'])
      PubSub.subscribe('ListPageData', (_, data) => {
        setList(data);
      });
    } else if (type === 'live') {
      setTitle("我喜欢")
      setMenuList(["歌曲"])
      setList(songsList.songs)
    } else {
      setTitle("本地与播放列表")
      setMenuList(['当前播放列表', '下载歌曲', '下载视频', '正在下载'])
    }
  }, [type]);

  useEffect(() => {
    const params = {
      id: userInfo?.account?.id,
      cookie
    }
    dispatch(getLikeListDispatch(params))
  }, [userInfo, cookie]);

  useEffect(() => {
    dispatch(getSongsData(likeList));
  }, [likeList]);

  return <div>
    <ListPageCpn menuList={menuList} dataList={list} title={title}></ListPageCpn>
  </div>;
};
