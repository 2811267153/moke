import styles from './index.module.scss';
import React, { useEffect, useState } from 'react';
import { Col, Row, Segmented } from 'antd';
import { SegmentedLabeledOption } from 'antd/es/segmented';
import { Image, Skeleton } from '@/components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { recommendAlbumListState, recommendPlayListState } from '@/redux/recommendPlayList/slice';

export const RecommendPlayList: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('ALL');
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const recommendNewPlayListData = useSelector(state => state.recommendPlayList.recommendNewPlayListData) || []
  const recommendAlbumListData = useSelector(state => state.recommendPlayList.recommendAlbumListData) || []
  const recommendLoading = useSelector(state => state.recommendPlayList.recommendLoading)
  const items: SegmentedLabeledOption[] = [
    { label: '全部', value: 'ALL',},
    { label: '华宇', value: 'ZH', },
    { label: '欧美', value: 'EA', },
    { label: '韩国', value: 'KP', },
    { label: '日本', value: 'JP', },
  ];
  useEffect(() => {
    dispatch(recommendPlayListState(selectedValue))
    dispatch(recommendAlbumListState())
  }, [selectedValue]);

  const handelClick = (value: any) => {
    setSelectedValue(value);
  };
  const handleToPlayer = (item: any) => {
    navigate(`/playerPage/${item.id}`);
  }

  return <div className={styles['recommend-play-list-warp']}>
    <Row>
      <Col span={15}>
        <div className={styles['list-warp-l']}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>新碟上架(这些都是专辑吧?应该?(•ᴗ•)</h2>
            <Segmented className={styles['recommend-segmented']} selected={true} onChange={handelClick} options={items} />
          </div>
          <div>
            {recommendLoading &&  (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '425px' }}>
              <Skeleton />;
            </div>)}
            {!recommendLoading && <div className={styles['segmented-info']}>   {
              recommendNewPlayListData.map((item: any, index: number) => {
                if (index < 15) {
                  return (
                    <div className={styles['segmented-item']} key={item.value} onClick={() => handleToPlayer(item)}>
                      <div className={styles['segmented-item-mask']}>
                        <i className='icon iconfont icon-bofang-01 play-icon' />
                      </div>
                      <img src={item.picUrl} alt='' />
                      <p>{item.name}</p>
                    </div>
                  );
                }
              })
            }*
            </div>}
          </div>
        </div>
      </Col>
      <Col span={9}>
        <div className={styles['list-warp-r']}>
          <h2>最近推荐歌单 <button>MORE<i className="icon iconfont icon-you-01"></i></button></h2>
          <div className={styles['play-list-info']}>
            {recommendAlbumListData &&
              recommendAlbumListData.map((item: any, index: number) => {
                if(index < 8){
                  return (
                    <div className={styles['play-list-info-item']} key={item.id}>
                      <Image height={'100%'} src={item.picUrl} key={item.id}></Image>
                      <div>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  );
                }
              })
            }
          </div>
        </div>
      </Col>
    </Row>
  </div>;
};
