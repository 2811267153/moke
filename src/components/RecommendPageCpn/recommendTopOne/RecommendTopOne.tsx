import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Navigation } from 'swiper';
import Color from 'color-thief-react';
import styles from '@/page/recommendPage/index.module.scss';
import { getAlbumidData } from '@/redux/albumInfo/slice';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from '@/components/common/gird';

interface PropsType {
  data: any[]
  cookie: string
  imgUrl: string[],
  scrollImgUrl: string[]
}

export const RecommendTopOne: React.FC<PropsType> = ({ data, cookie, scrollImgUrl, imgUrl }) => {
  const albumListId = useSelector(state => state.musicAlbumDetail.albumidData?.result?.playlists[0].id) || '';
  const [listId, setListId] = useState('');
  const location = useLocation()
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(albumListId !== ''){
      setListId(albumListId)
    }
  }, [albumListId]);

  useEffect(() => {
    console.log(location.pathname);
    if(location.pathname !== "recommend"){
      setListId('')
    }
  }, [location]);

  useEffect(() => {
    if(listId !== ''){
      navigate(`/album/${albumListId}`);
    }
  }, [listId]);



  const handleToAlbum = async (item: any) => {
    if (item.mainTitle.title.includes('私人雷达')) {
      const params = {
        cookie,
        key: '私人雷达',
        id: ''
      };
      await dispatch(getAlbumidData(params));
    } else {
      const params = {
        cookie,
        key: item.mainTitle.title as string,
        id: ''
      };
      await dispatch(getAlbumidData(params));
    }
    console.log(albumListId);
    setTimeout(() => {
      console.log(albumListId);

      // navigate(`/album/${albumListId}`);
    }, 10000);
  };
  return (
    <>
      {data?.map((resource: any, index) => (
        <div key={index}>
          {resource.creativeType === 'scroll_playlist' ? (
            <div className={styles.recommend_one_warp}>
              <Swiper
                spaceBetween={30}
                grabCursor={true}
                effect={'creative'}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false
                }}
                modules={[Autoplay, Navigation]}
                className={styles.mySwiper}
              >
                {
                  resource.resources.map((item: any, i: number) => {
                    return (
                      <SwiperSlide>
                        <Grid imgUrl={scrollImgUrl} handleToAlbum={handleToAlbum} index={i} resource={item}></Grid>
                      </SwiperSlide>

                    );
                  })
                }
              </Swiper>
            </div>
          ) : (
            <Grid imgUrl={imgUrl} handleToAlbum={handleToAlbum} index={index} resource={resource} />
          )
          }
        </div>
      ))}
    </>
  );
};