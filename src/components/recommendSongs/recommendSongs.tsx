import React, { useEffect } from 'react';
import styles from "./index.module.scss"
import { useAppDispatch, useSelector } from '@/redux/hooks';

import { playingList } from '@/redux/audioDetail/slice';
import { recommendSongs } from '@/redux/recmmendSongs/slice';
import { FlexCol } from '@/components/common/FlexCol/FlexCol';
import { Skeleton } from '@/components';

export const RecommendSongs: React.FC = () => {
  const dispatch = useAppDispatch()
  const playList = useSelector(state => state.audioData.playingList) || []

  const cookie = useSelector(state => state.loginUnikey.cookie);
  const { dailySongs } = useSelector(state => state.recommendSongs.data)|| []
  const recommendSongsLoading = useSelector(state => state.recommendSongs.loading)

  useEffect(() => {
    if(cookie != "") {
      dispatch(recommendSongs(cookie));
    }
  }, [cookie]);

  const handleToPlayer = (item: any) => {
    const index = playList.findIndex((el) => el.id === item.id);
    if (index !== -1) {
      const newPlayList = playList.slice();
      newPlayList.splice(index, 1);
      dispatch(playingList([item, ...newPlayList]))
    } else {
      dispatch(playingList([item, ...playList]))
    }
  }

  const handelFlexColClick = (_: any, uiElement: any) => {
    console.log(uiElement);
    handleToPlayer(uiElement)
  }

  useEffect(() => {
    console.log(dailySongs);
  }, [dailySongs]);


  if(recommendSongsLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '281px', width: "100%" }}>
      <Skeleton />
    </div>
  }
  return (
    <div>
      <h2>拥有你相同爱好的同学也喜欢听这些呢(｀・ω・´)  </h2>
      <div className={styles['recommend-list-warp']}>
        <div className={styles['recommend-list']} >
          {
            dailySongs.map((item: any, index: number) => {
              const uiElement = {...item}
              const resourceExtInfo = {...item}
              const resources = {
                resourceId: null
              }
              resources.resourceId = item.id

              uiElement.image = {}
              uiElement.mainTitle = {}
              uiElement.subTitle = {}
              resourceExtInfo.songData = {}
              resourceExtInfo.songData.artists = [...item.ar]
              uiElement.image.imageUrl = item.al.picUrl
              uiElement.mainTitle.title = item.name
              uiElement.subTitle.title = item.reason
              if(index <= 11) {
                return <FlexCol handelChangeSongs={handelFlexColClick} resources={resources}  resourceExtInfo={resourceExtInfo} uiElement={uiElement}></FlexCol>
              }
            })
          }
        </div>
      </div>
    </div>
  )
}

