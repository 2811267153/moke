import React, { useEffect, useRef, useState } from 'react';
import { Image, ListItem, LoginErr, Skeleton } from '../common';
import styles from './index.module.scss';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { recommedUserListDataState } from '@/redux/recommendPlayList/slice';
import { format } from '@/utils';
import { changeAudioPlay, isPlayingDispatch } from '@/redux/audioDetail/slice';
import { useNavigate } from 'react-router-dom';
import PubSub from 'pubsub-js';
import { message } from 'antd';

interface recommendListItem {
  coverImgUrl?: string
  name?: string,
  id?: number
}

export const RecommendedStation: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cookie = useSelector(state => state.loginUnikey.cookie);
  const [currentMusic, setCurrentMusic] = useState<ListItem>(); //获取正在播放的歌曲
  const [currentTime, setCurrentTime] = useState(0); //当前播放的秒数
  const [width, setWidth] = useState(0); //进度条宽度
  const [duration, setDuration] = useState(0);
  const isPlaying = useSelector(state => state.audioData.isPlaying);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(5);

  useEffect(() => {
    PubSub.subscribe('AudioCurrentMusic', (_, data) => {
      setCurrentMusic(data);
    });

    PubSub.subscribe('AudioCurretTime', (_, data) => {
      setWidth(data[0] / data[1] * 100);
      setCurrentTime(data[0]);
      setDuration(data[1]);
      setIsLoading(data[2]);
      setCurrentMusic(data[4]); //获取当前歌曲的推荐歌单
      dispatch(isPlayingDispatch(data[3]));
    });
    PubSub.subscribe('AudioCurrentLoadingMusicData', (_, data) => {
      setIsLoading(data);
    });
    return () => {
      PubSub.unsubscribe('AudioCurretTime');
      PubSub.unsubscribe('AudioCurrentMusic');
      PubSub.unsubscribe('RecommendedStation');
    };
  }, []);
  const handlePlayPauseClick = (e: any) => {
    e.stopPropagation();
    dispatch(changeAudioPlay(true));
    dispatch(isPlayingDispatch(!isPlaying));
  };
  const handleToPlayerPage = () => {
    navigate('/playerPage');
  };

  const handelGetSongs = (type: 'file' | 'live' | 'playlist') => {
    navigate(`/list/${type}`);
    if (type === 'live') {
      if(cookie === '') {
        message.info("请先登录")
        navigate(`/`)
      }
      navigate(`/list/${type}`);
    } else {
      navigate(`/list/${type}`);
    }
  };
  return <div className={styles['recommend-station']} style={{ display: 'flex', width: '100%' }}>
    <div style={{ width: '50%' }}>
      <h2 style={{ fontWeight: 200, fontSize: 15, height: 28 }}>要继续听歌么?我把播放器给你搬过来了(〃´-ω･) </h2>
      <div className={styles['recommend-station-warp']} onClick={handleToPlayerPage}>
        <div className={styles['listening']}>
          <Image width='110px'
                 src={currentMusic && currentMusic.al && currentMusic.al.picUrl || ''}
                 height={110} />
          <div className={styles['song-info']}>
            <div style={{ height: 100 + '%', flex: '1', padding: '0 20px' }}>
              <h3>{currentMusic?.name || '简音乐'}</h3>
              <div className={styles['music-info']}>
                <div className={styles['scrolling-text-container']} ref={containerRef}>
                  <div className={styles['scrolling-text']} style={{
                    animationDuration: `${10}s`,
                    width: `${containerWidth}px`
                  }}>
                    <p
                      className={styles['music-other']}>{currentMusic && currentMusic.ar && currentMusic.ar.map((item: any) => {
                      return <span key={item.id}>{item.name} -</span>;
                    }) || '简音乐'} <span
                      className={styles['music-ablum']}>专辑: {currentMusic && currentMusic.al && currentMusic.al.name || '简音乐, 让音乐多一点简单'}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles['player-controller-warp']}>
                <span>{format(currentTime)}</span>
                <div className={styles['player-controller']}>
                  <div className={styles['player-controller-solid']} style={{ width: width + '%' }}></div>
                </div>
                <span>{format(duration)}</span>
              </div>
            </div>
            <div className={styles['song-info-icon']}>
              {!isPlaying && !isLoading &&
                <i className='icon iconfont icon-zanting2' onClick={(e) => handlePlayPauseClick(e)}
                   style={{ fontSize: 35 }} />}
              {!isLoading && isPlaying &&
                <i className='icon iconfont icon-bofang' onClick={(e) => handlePlayPauseClick(e)}
                   style={{ fontSize: 35 }} />}
            </div>
            {isLoading && <div style={{ position: 'relative', height: 30 }}>
              <svg className={styles['icon-solid']} version='1.0' xmlns='http://www.w3.org/2000/svg'
                   width='25.000000pt' height='25.000000pt' viewBox='0 0 200.000000 200.000000'
                   preserveAspectRatio='xMidYMid meet'>
                <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)'
                   fill='#ff59a9' stroke='none'>
                  <path d='M874 1910 c-85 -12 -136 -26 -233 -66 -211 -87 -397 -274 -485 -487
                    -56 -134 -69 -203 -69 -357 0 -154 13 -223 69 -357 45 -111 115 -211 207 -300
                    93 -89 173 -143 280 -188 132 -54 204 -68 357 -69 152 -1 242 18 378 80 148
                    67 291 186 381 318 50 73 107 201 132 301 33 130 32 305 -1 433 -13 51 -32
                    101 -42 112 -23 24 -61 26 -83 3 -19 -19 -17 -47 10 -163 27 -117 23 -273 -9
                    -383 -70 -237 -212 -401 -438 -506 -214 -101 -481 -93 -698 19 -176 92 -317
                    256 -380 442 -143 420 81 873 500 1012 148 49 340 51 484 6 38 -12 78 -19 90
                    -16 29 7 50 47 41 76 -20 62 -311 116 -491 90z' />
                </g>
              </svg>
              <svg style={{ position: 'absolute', left: 0 }} version='1.0' xmlns='http://www.w3.org/2000/svg'
                   width='25.000000pt' height='25.000000pt' viewBox='0 0 200.000000 200.000000'
                   preserveAspectRatio='xMidYMid meet'>
                <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)'
                   fill='#ff59a9' stroke='none'>
                  <path d='M861 1347 c-19 -7 -44 -25 -55 -40 -20 -27 -21 -43 -24 -292 -3 -290
                        1 -317 54 -352 16 -10 46 -18 69 -18 36 0 65 16 234 130 201 135 231 165 231
                        230 0 55 -28 82 -214 208 -213 145 -235 155 -295 134z' />
                </g>
              </svg>
            </div>}
          </div>
        </div>
      </div>
    </div>
    <div style={{ width: '50%', marginLeft: 20 }}>
      <h2 style={{ fontWeight: 200, fontSize: 15, height: 28 }}>找到了几个于这首歌类似的歌单(〃^ω^) </h2>
      <div className={styles['song-album']}>
        <div className={styles['album-item']} onClick={() => handelGetSongs('file')}>
          <a><i className='icon iconfont icon-yinle'></i>
            <p>
              本地歌曲
            </p>
          </a>
        </div>
        <div className={styles['album-item']} onClick={() => handelGetSongs('live')}>
          <a><i className='icon iconfont icon-aixin'></i>
            <p>
              我喜欢
            </p>
          </a>
        </div>
        <div className={styles['album-item']} onClick={() => handelGetSongs('playlist')}>
          <a><i className='icon iconfont icon-bofangduilie'></i>
            <p>
              当前播放列表
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>;
};
