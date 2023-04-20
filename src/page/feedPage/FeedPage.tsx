import React, { useEffect, useState } from 'react';
import styles from '@/page/feedPage/index.module.scss';

import { FeedSwiper } from '@/components/feedCpn';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { getRecommendMvDispatch, getTopListDispatch } from '@/redux/feedInfo/slice';
import { CommonGrid, CommonFlex } from '@/components';
import { Segmented } from 'antd';
import { SegmentedLabeledOption } from 'antd/es/segmented';
import { useNavigate } from 'react-router-dom';



interface ParamsType{
  area: string,
  order: string,
  limit: number,
  offset: number
}
export const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const topList = useSelector(state => state.feedInfo.topListData) || [];
  const recommendMv = useSelector(state => state.feedInfo.personalizedMv)
  const recommendMvLoading = useSelector(state => state.feedInfo.personalizedMvLoading)
  const [area, setArea] = useState<string>('');
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getTopListDispatch());
    let params = {}
    params = {
      area: area,
      order: "全部",
      limit: 30,
      offset: 1
    }
    dispatch(getRecommendMvDispatch(params as ParamsType))
  }, []);

  useEffect(() => {
    console.log(recommendMv);
  }, [recommendMv]);

  const handleToAlbum = (data: any) => {
    navigate(`/album/${data.id}`);

  };
  const handelClick = (item: any) => {
    let params = {}
    params = {
      area: item,
      order: "全部",
      limit: 30,
      offset: 1
    }
    dispatch(getRecommendMvDispatch(params as ParamsType))
  }
  return <div className={styles.feed}>
    <FeedSwiper></FeedSwiper>
    <h2 style={{ margin: "20px 0" }}>排行榜(这里汇集了最近最潮的歌曲,试试?)</h2>
    <CommonGrid handleToAlbum={handleToAlbum} data={topList.slice(0, 15)}></CommonGrid>
    <div style={{display: 'flex', justifyContent: 'space-between', height: 30, margin: "10px 20px"}}>
      <h2>推荐MV(最近比较火的MV都在这里,试试?)</h2>
      <Segmented options={['全部', '内地', '港台', '欧美', '日本','韩国']} defaultValue={"全部"} onChange={handelClick}/>
    </div>
    <CommonFlex  data={recommendMv}></CommonFlex>
  </div>;
};