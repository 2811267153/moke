import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Image, List, Skeleton } from '@/components';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { getSongsInfoData, musicAlbumData } from '@/redux/albumInfo/slice';
import { formatStr, formatTimeDate } from '@/utils';
import { changeAudioPlay, addPlayingList } from '@/redux/audioDetail/slice';


export const AlbumPage: React.FC = () => {
  const { albumid } = useParams();
  const dispatch = useAppDispatch();


  const cookie = useSelector(state => state.loginUnikey.cookie);
  const ablumInfo = useSelector(state => state.musicAlbumDetail.albumData)[0];
  const infoLoading = useSelector(state => state.musicAlbumDetail.infoLoading);
  const ablumAllSongsList = useSelector(state => state.musicAlbumDetail.songsInfoData) || []
  const songsInfoLoading = useSelector(state => state.musicAlbumDetail.songsInfoLoading)

  const hisoryllist = useSelector(state => state.audioData.playingList)
  const ablumAllSongsInfo = useSelector(state => state.musicAlbumDetail.ablumAllSongsList);
  // const songsInfoLoading = useSelector(state => state.musicAlbumDetail.songsInfoLoading);
  const dynamicAblumData = useSelector(state => state.musicAlbumDetail.dynamicAblumData);
  const dynamicAblumLoading = useSelector(state => state.musicAlbumDetail.dynamicAblumLoading);
  const updatePlayListCount = useSelector(state => state.musicAlbumDetail.updatePlayListCount);
  const updateLoading = useSelector(state => state.musicAlbumDetail.updateLoading);

  useEffect(() => {
    if (cookie.length != 0) {
      const params = {
        id: albumid!,
        cookie
      };
      dispatch(musicAlbumData(params));
    }
  }, [albumid, cookie]);



  useEffect(() => {
    const idArr = ablumInfo?.trackIds.map((obj: any) => obj.id)
    const isStringId = idArr?.join(',')
    dispatch(getSongsInfoData(isStringId))
  }, [ablumInfo]);

  const handleAddClick = () => {
    // dispatch(addPlayingList(ablumAllSongsList.songs))
    dispatch(changeAudioPlay(true));
  }
  const handleAddPlaylistClick = () => {
    // dispatch(addPlayingList([...hisoryllist, ...ablumAllSongsList.songs]))
  }
  const handleChangeClick = (index: number) => {
    dispatch(addPlayingList(ablumAllSongsList.songs[index],))
    dispatch(changeAudioPlay(true));
  }
  if (infoLoading) {
    return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 50px)' }}>
      <Skeleton />;
    </div>);
  }

  return (
    <>
      <div className={styles['album']}>
        <div className={styles['album-picture']}>
          <div className={styles['picture-info']}>
            <Image height={300} width={300} src={ablumInfo?.coverImgUrl} style={{ borderRadius: 30 }} />
          </div>
          <div className={styles['album-info']}>
            <h2>
              <div style={{
                display: 'inline-block',
                width: 3,
                height: 20,
                backgroundColor: '#f53c3c',
                verticalAlign: 'middle',
                marginRight: 10
              }}></div>
              {ablumInfo?.name.trim()}</h2>
            <p className={styles['description']}>{ablumInfo?.description}</p>
            <p className={styles['songs-other']}>创建时间: {formatTimeDate(ablumInfo?.createTime)}
              <i /> {formatStr(ablumInfo?.subscribedCount)}人喜欢 <i />{formatStr(ablumInfo?.commentCount)}条评论<i /> {formatStr(ablumInfo?.playCount)}次播放 <i /> {formatStr(ablumInfo?.shareCount)}次分享
            </p>
            <div className={styles['songs-btn']}>
              <button onClick={handleAddClick}><i className='icon iconfont icon-arrow_right_fat'
                         style={{ marginRight: 4, verticalAlign: 'bottom' }} /><span>播放</span></button>
              <button onClick={handleAddPlaylistClick}>添加到播放列表</button>
            </div>
          </div>
        </div>
      </div>
      {songsInfoLoading && (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - (50px + 330px))' }}>
        <Skeleton />;
        </div>)}
      {!songsInfoLoading && ablumAllSongsList.songs && <List data={ablumAllSongsList.songs} privileges={ablumAllSongsList.privileges} handleChangeClick={handleChangeClick} />}
    </>
  );
};
