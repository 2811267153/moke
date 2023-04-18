import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from 'swiper';
import { Image, Skeleton } from '@/components';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { getBanner } from '@/redux/other/slice';
import { getDjBannerDispatch, getTopListDispatch } from '@/redux/feedInfo/slice';
import { shell } from 'electron';
import { message } from 'antd/lib';

import 'swiper/css';
import 'swiper/css/effect-creative';

// import required modules
export const FeedSwiper: React.FC = () => {
  const dispatch = useAppDispatch();
  const topListLoading = useSelector(state => state.feedInfo.topListLoading);
  const banner = useSelector(state => state.otherSlice.bannerData) || [];
  const djBanner = useSelector(state => state.feedInfo.djBanner) || [];
  const djBannerLoading = useSelector(state => state.feedInfo.djBannerLoading);
  const djBannerErr = useSelector(state => state.feedInfo.djBannerErr);
  useEffect(() => {
    dispatch(getBanner());
    dispatch(getTopListDispatch());
    dispatch(getDjBannerDispatch());
  }, []);

  const handleBannerClick = (url: string) => {
    shell.openExternal(url).then().catch(e => {
      message.error({
        content: e
      });
    });
  };

  if (topListLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '425px' }}>
      <Skeleton />;
    </div>;
  }

  return(
    <div className={styles.swiper}>
      <Swiper
        style={{marginRight: 20, overflow: 'hidden', borderRadius: 10}}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000,disableOnInteraction: false}}
        pagination={{clickable: true }}
        modules={[Autoplay]}>{
        banner.map(item => {
          return <SwiperSlide onClick={() => handleBannerClick(item.url)}><Image src={item.pic} width={"100%"} height={300}></Image></SwiperSlide>
        })
      }
      </Swiper>
      <Swiper
        grabCursor={true}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1]
          },
          next: {
            translate: ['100%', 0, 0]
          }
        }}
        autoplay={{delay: 5000, disableOnInteraction: false }}
        modules={[EffectCreative, Autoplay]}
        className={styles.swiper_small}
      >{
        djBanner.map((item: any) => {
          return  <SwiperSlide><Image src={item.pic}></Image></SwiperSlide>
        })
      }
      </Swiper>
    </div>

  )
}