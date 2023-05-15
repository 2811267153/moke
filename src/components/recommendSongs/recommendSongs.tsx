import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useAppDispatch, useSelector } from '@/redux/hooks';

import { addPlayingList, changeAudioPlay } from '@/redux/audioDetail/slice';
import { recommendSongs } from '@/redux/recmmendSongs/slice';
import { FlexCol } from '@/components/common/FlexCol/FlexCol';
import { Skeleton } from '@/components';

export const RecommendSongs: React.FC = () => {
  const dispatch = useAppDispatch();
  const playList = useSelector(state => state.audioData.playingList) || [];

  const cookie = useSelector(state => state.loginUnikey.cookie);
  const dailySongs = useSelector(state => state.recommendSongs.data) || [];
  const recommendSongsLoading = useSelector(state => state.recommendSongs.loading);

  useEffect(() => {
    if (cookie != '') {
      dispatch(recommendSongs(cookie));
    }
  }, [cookie]);

  const handelFlexColClick = (uiElement: any, i: any) => {
    dispatch(changeAudioPlay(true));
    PubSub.publish('currentIndex', 0);
    const index = playList.findIndex((el) => el.id === uiElement.id);
    console.log(index);
    if (index !== -1) {
      const newPlayList = [...playList]; // 创建新的播放列表副本
      newPlayList.splice(index, 1); // 删除重复项
      console.log([uiElement, ...newPlayList]);
      dispatch(addPlayingList([uiElement, ...newPlayList])); // 更新播放列表
    } else {
      console.log([uiElement, ...playList]);
      const newPlayList = [uiElement, ...playList]; // 添加到播放列表开头
      dispatch(addPlayingList(newPlayList)); // 更新播放列表
    }
    // console.log("playlist", newPlayList); // 打印更新后的播放列表
  };

  if (cookie == '') {
    return <></>;
  }

  if (recommendSongsLoading) {
    return <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '281px', width: '100%' }}>
      <Skeleton />
    </div>;
  }
  return (
    <div>
      <h2 style={{marginBottom: 20}}>拥有你相同爱好的同学也喜欢听这些呢(｀・ω・´) </h2>
      <div className={styles['recommend-list-warp']}>
        <div className={styles['recommend-list']}>
          {
            dailySongs.map((item: any, index: number) => {
              const uiElement = { ...item };
              const resourceExtInfo = { ...item };
              const resources = {
                resourceId: null
              };
              resources.resourceId = item.id;

              uiElement.image = {};
              uiElement.mainTitle = {};
              uiElement.subTitle = {};
              resourceExtInfo.songData = {};
              resourceExtInfo.songData.artists = [...item.ar];
              uiElement.image.imageUrl = item.al.picUrl;
              uiElement.mainTitle.title = item.name;
              uiElement.subTitle.title = item.reason;
              if (index <= 11) {
                return <FlexCol handelChangeSongs={() =>handelFlexColClick(uiElement, index)} resources={resources}
                                resourceExtInfo={resourceExtInfo} uiElement={uiElement}></FlexCol>;
              }
            })
          }
        </div>
      </div>
    </div>
  );
};

