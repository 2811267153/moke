import React, { useEffect, useState } from 'react';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { recommendDiscoverDispatch } from '@/redux/recommendPlayList/slice';
import styles from './index.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './index.css';
import { Image, RecommendTopOne, Skeleton } from '@/components';
import { RecommendNewSongsNewAlbum } from '@/components/RecommendPageCpn/recommendNewSongsNewAlbum';
import { getHotArtist } from '@/redux/other/slice';
import Color from 'color-thief-react';
import { addPlayingList } from '@/redux/audioDetail/slice';
import { FlexCol } from '@/components/common/FlexCol/FlexCol';
import * as assert from 'assert';


export const RecommendPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const recommendDiscoverData = useSelector(state => state.recommendPlayList.recommendDiscoverData) || [];
    const recommendDiscoverLoading = useSelector(state => state.recommendPlayList.recommendDiscoverLoading);
    const recommendDiscoverError = useSelector(state => state.recommendPlayList.recommendDiscoverError);
    const playList = useSelector(state => state.audioData.playingList) || []
    const hotArtist = useSelector(state => state.otherSlice.hotArtist) || [];
    const hotArtistLoading = useSelector(state => state.otherSlice.hotArtistLoading);
    const cookie = useSelector(state => state.loginUnikey.cookie) || '';
    const [imgUrl, setImgUrl] = useState<any>([]);
    const [newSongsImgUrl, setNewSongsImgUrl] = useState<any>([]);
    const [newSongsScrollImgUrl, setNewSongsScrollImgUrl] = useState<any>([]);
    const [scrollImgUrl, setScrollImgUrl] = useState<any>([]);
    const [recommendDiscoverPlaylist, setRecommendDiscoverPlaylist] = useState([]);
    const [recommendNewSongsNewAlbum, setRecommendNewSongsNewAlbum] = useState([]);
    const [slideSongListAlign, setSlideSongListAlign] = useState([]);
    const [slideSongListAlignTitle, setSlideSongListAlignTitle] = useState('');

    useEffect(() => {
      dispatch(recommendDiscoverDispatch(cookie));
      dispatch(getHotArtist(1));
    }, [cookie]);

    useEffect(() => {
      if (recommendDiscoverData.code === 200) {
        if (recommendDiscoverData?.data?.blocks[2].blockCode == "HOMEPAGE_BLOCK_PLAYLIST_RCMD") {
          setRecommendDiscoverPlaylist(recommendDiscoverData?.data?.blocks[2].creatives);
          setSlideSongListAlign(recommendDiscoverData?.data?.blocks[3].creatives)
          setRecommendNewSongsNewAlbum(recommendDiscoverData?.data?.blocks[4].creatives);
          setSlideSongListAlignTitle(recommendDiscoverData?.data?.blocks[2].uiElement.subTitle.title)
        }else {
          setRecommendDiscoverPlaylist(recommendDiscoverData?.data?.blocks[1].creatives);
          setSlideSongListAlign(recommendDiscoverData?.data?.blocks[2].creatives)
          console.log(recommendDiscoverData?.data?.blocks[2]);
          setSlideSongListAlignTitle(recommendDiscoverData?.data?.blocks[2].uiElement.subTitle.title)
          setRecommendNewSongsNewAlbum(recommendDiscoverData?.data?.blocks[3].creatives);
        }
      }
    }, [recommendDiscoverData.code]);

    useEffect(() => {
      const url: any[] = [];
      const scrollUrl: any[] = [];
      recommendDiscoverPlaylist.map((item: any) => {
        url.push(item?.uiElement?.image?.imageUrl);
        setImgUrl(url);
        if (item.creativeType === 'scroll_playlist') {
          item.resources.map((el: any) => {
            scrollUrl.push(el.uiElement.image.imageUrl);
          });
          setScrollImgUrl(scrollUrl);
        }
      });
    }, [recommendDiscoverPlaylist]);

    useEffect(() => {
      const url: any[] = [];
      const scrollUrl: any[] = [];
      recommendNewSongsNewAlbum.map((resources: any) => {
        if (resources.creativeType == 'NEW_SONG_HOMEPAGE') {
          resources.resources.forEach((uiElement: any) => {
            scrollUrl.push(uiElement?.uiElement?.image?.imageUrl);
          });
        }
        resources.resources.forEach((uiElement: any) => {
          url.push(uiElement?.uiElement?.image?.imageUrl);
        });
        setNewSongsImgUrl(url);
        setNewSongsScrollImgUrl(scrollUrl);
      });
    }, [recommendNewSongsNewAlbum]);

    useEffect(() => {
      console.log(recommendDiscoverData);
    }, [recommendDiscoverData]);

  const handelChangeSongs = (item: any) => {
    const copyItem = {...item}
    copyItem.al = {};
    copyItem.ar = [...item.artists]
    copyItem.al.picUrl = item.album.blurPicUrl
    copyItem.al.name = item.album.name
    const index = playList.findIndex((el) => el.id === copyItem.id);
    if (index !== -1) {
      const newPlayList = playList.slice();
      newPlayList.splice(index, 1);
      dispatch(addPlayingList(copyItem))
    } else {
      dispatch(addPlayingList(copyItem))
    }
  }
    return (
      <>
        <div className={styles.recommend}>
          <div className={styles.recommend_flex}>
            <div style={{ flex: 1 }}>
              <h2>推荐歌单</h2>
              {recommendDiscoverLoading &&  (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '451px' }}>
                <Skeleton />;
              </div>)}
              <div className={styles.recommend_warp}>
                {!recommendDiscoverLoading && <RecommendTopOne cookie={cookie} data={recommendDiscoverPlaylist} imgUrl={imgUrl}
                                                               scrollImgUrl={scrollImgUrl}></RecommendTopOne>}
              </div>
            </div>
            <div className={styles.recommend_r}>
              {
                hotArtist.map((item: any, i: number) => {
                  if (i < 5) {
                    return (
                      <Color src={item.picUrl} crossOrigin='anonymous' format='hex'>
                        {({ data }) => (
                          <div key={item.id} className={styles.recommend_col}>
                            <Image src={item.picUrl} width={60} height={60}
                                   style={{ borderRadius: '50px', boxShadow: `5px 5px 20px 0 ${data}` }}></Image>
                            <div style={{ flex: 1, marginLeft: 20, fontSize: 12}}>
                              <p>{item.name}</p>
                              <p style={{ marginTop: 5 }}>{item.musicSize} 首歌曲</p>
                            </div>
                            <button>关注</button>
                          </div>
                        )
                        }
                      </Color>
                    );
                  }
                })
              }
            </div>
          </div>
          <h2>{slideSongListAlignTitle}</h2>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(4, 1fr)`, gridGap: 10, padding: `0px 20px`}}>
            {
              slideSongListAlign.map((item: any) => {
                return(
                  <>
                    {
                      item?.resources?.map((resources: any) => {
                        const {uiElement, resourceExtInfo } = resources
                        return <FlexCol handelChangeSongs={handelChangeSongs} uiElement={uiElement} resourceExtInfo={resourceExtInfo} resources={resources} ></FlexCol>
                      })
                    }
                  </>
                )
              })
            }
          </div>
          <h2>新歌新碟</h2>
          {recommendDiscoverLoading &&  (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Skeleton />
          </div>)}
          <div className={styles.recommend_warp} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {!recommendDiscoverLoading &&  <RecommendNewSongsNewAlbum scrollImgUrl={scrollImgUrl} cookie={cookie} data={recommendNewSongsNewAlbum}
                                        imgUrl={newSongsImgUrl} />}
          </div>
        </div>
      </>
    );
  }
;
;
