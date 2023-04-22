import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { Grid } from '@/components/common/gird';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Navigation } from 'swiper';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { playingList } from '@/redux/audioDetail/slice';
import { useNavigate } from 'react-router-dom';

interface PropsTypes {
  cookie: string,
  data: any[],
  imgUrl: any[],
  scrollImgUrl: any[]
}

export const RecommendNewSongsNewAlbum: React.FC<PropsTypes> = ({ cookie, imgUrl, data, scrollImgUrl }) => {
  const navigate = useNavigate()
  const handleToAlbum = (_: any, resource: any) => {
    console.log(resource);
    if(resource.resourceType === 'song') {
      const params = {
        id: ''
      }
      params.id =resource.resourceId
    }else if(resource.resourceType === 'album'){
      navigate(`/album/${resource.resourceId}`);
    }
  };
  return <>
    {data.map((resource: any, index) => {
      if (resource.creativeType == 'NEW_SONG_HOMEPAGE') {
        return <Swiper
          direction={'vertical'}
          spaceBetween={30}
          pagination={{
            clickable: true
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false
          }}
          className={styles.mySwiper}
          modules={[Autoplay, Navigation]}
        >
          {
            resource.resources.map((item: any, i: number) => {
              return (
                <SwiperSlide>
                  <Grid show={'0px 0px 0px 0px'} imgUrl={scrollImgUrl} handleToAlbum={handleToAlbum} index={index}
                        resource={item}></Grid>
                </SwiperSlide>
              );
            })
          }
        </Swiper>;
      } else {
        return <>
          {
            resource.resources.map((item: any, i: number) => {
              const totalIndex = (index * resource.resources.length) + i;
              return <>
                <Grid imgUrl={imgUrl} show={'0px 0px 0px 0px'} resource={item} index={totalIndex}
                      handleToAlbum={handleToAlbum} />
              </>;
            })
          }
        </>;
      }
    })}
  </>;
};