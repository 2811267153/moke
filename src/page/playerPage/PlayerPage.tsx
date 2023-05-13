import React, { useEffect, useState } from 'react';
import { ListItem, Lyrics, Image } from '@/components';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import styles from './index.module.scss';
import { format } from '@/utils';
import Color from 'color-thief-react';
import { changeAudioPlay, isPlayingDispatch } from '@/redux/audioDetail/slice';
import { getLyricDispatch } from '@/redux/other/slice';

export const PlayerPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [countTime, setCountTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentMusic, setCurrentMusic] = useState<ListItem>(); //获取正在播放的歌曲
  const isPlaying = useSelector(state => state.audioData.isPlaying);
  const isLoading = useSelector(state => state.audioData.isLoading);
  const lyricData = useSelector(state => state.otherSlice.lyricData) || []; //获取当前歌曲的歌曲数据
  const lyricLoading = useSelector(state => state.otherSlice.lyricLoading);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    PubSub.subscribe('AudioCurretTime', (_, data) => {
      setCountTime(data[0]);
      setCurrentMusic(data[4]);
      setDuration(data[1]);
      setCurrentIndex(data[5]);
    });
    PubSub.subscribe('AudioCurrentMusic', (_, data) => {
      setCurrentMusic(data);
    });

    return () => {
      PubSub.unsubscribe('AudioCurretTime');
    };
  }, []);

  const handleNextClick = (e: any, type: 'next' | 'piece') => {
    PubSub.publish('PlayerPageChangeSongs', [e, type, currentIndex]);
  };
  const handlePlayPauseClick = () => {
    dispatch(isPlayingDispatch(!isPlaying));
    dispatch(changeAudioPlay(true));
  };

  const handleHiddenMeun = () => {
    setHidden(!hidden);
    let height = '';
    hidden ? height = '50' : height = '0';
    PubSub.publish('hiddenMenu', height);
  };

  useEffect(() => {
    if (currentMusic) {
      dispatch(getLyricDispatch(currentMusic.id as number));
    }
  }, [currentMusic?.id]);

  return (
    <div className={styles.player_page}>
      <img src={currentMusic?.al?.picUrl || 'https://i.imgtg.com/2023/04/23/IkfQB.png'} alt='' key={currentMusic?.id}
           style={{ transform:" scale(2)"}} />
      <div className={styles.player_filter}>
        <div className={styles.player_info} style={{alignItems: 'center'}}>
          <div className={styles.player_img}>
            <Image  src={currentMusic?.al?.picUrl || 'https://i.imgtg.com/2023/04/23/IkfQB.png'} key={currentMusic?.id} />
          </div>
          <div className={styles.player_artist_info}>
            <h3>{currentMusic?.name}</h3>
            <div className={styles.player_artist}>
              <span>{currentMusic?.al?.name || '未知专辑'}</span>
              <p style={{ marginTop: 20 }}>
                {currentMusic && currentMusic.ar && currentMusic.ar.map((artist, index) => {
                  return (
                    <React.Fragment key={artist.id}>
                      <span>{artist.name}</span>
                      {index !== currentMusic?.ar.length - 1 && ' & '}
                    </React.Fragment>
                  );
                }) || '未知艺术家'}
              </p>
            </div>
            <div className={styles.player_controller_warp}>
              <span>{format(countTime)}</span>
              <Color src={currentMusic?.al?.picUrl} format='hex'>
                {
                  ({ data }) => (
                    <div className={styles.player_controller}>
                      <div className={styles.player_controller_solid}
                           style={{ width: (countTime / duration) * 100 + '%', backgroundColor: data }}></div>
                    </div>
                  )
                }
              </Color>
              <span>{format(duration)} </span>
            </div>
            <div className={styles.player_controller_warp}>
              <i className='icon iconfont icon-shangyiqu' style={{ fontSize: 30 }}
                 onClick={(e) => handleNextClick(e, 'piece')} />
              {/*如果isPlaying是true显示播放按钮,否则显示暂停*/}
              {!isPlaying && !isLoading &&
                <i className='icon iconfont icon-bofangzhong' onClick={handlePlayPauseClick} style={{ fontSize: 35 }} />}
              {isPlaying && !isLoading &&
                <i className='icon iconfont icon-zanting' onClick={handlePlayPauseClick} style={{ fontSize: 35 }} />}
              {isLoading && <div style={{ position: 'relative', height: 30 }}>
                <svg className={styles['icon-solid']} version='1.0' xmlns='http://www.w3.org/2000/svg'
                     width='25.000000pt' height='25.000000pt' viewBox='0 0 200.000000 200.000000'
                     preserveAspectRatio='xMidYMid meet' fill='#f2f2f2'>
                  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)'
                     stroke='none'>
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
                     preserveAspectRatio='xMidYMid meet' fill='#f2f2f2'>
                  <g transform='translate(0.000000,200.000000) scale(0.100000,-0.100000)'
                     stroke='none'>
                    <path d='M861 1347 c-19 -7 -44 -25 -55 -40 -20 -27 -21 -43 -24 -292 -3 -290
                        1 -317 54 -352 16 -10 46 -18 69 -18 36 0 65 16 234 130 201 135 231 165 231
                        230 0 55 -28 82 -214 208 -213 145 -235 155 -295 134z' />
                  </g>
                </svg>
              </div>}
              <i className={`icon iconfont icon-xiayiqu`} style={{ fontSize: 30 }}
                 onClick={(e) => handleNextClick(e, 'next')} />
            </div>
          </div>
        </div>
        <div className={styles.player_lyric}>
          {!lyricLoading && currentMusic && currentMusic.id === undefined && <p>暂无歌词</p>}
          {!lyricLoading && lyricData && currentMusic && currentMusic.id &&
            <Lyrics lyrics={lyricData} currentTime={countTime}></Lyrics>}
          {lyricLoading && <p>歌词加载中</p>}
        </div>
      </div>
      <i onClick={handleHiddenMeun} className={`${styles.iconfonts} icon iconfont icon-touying`}></i>
    </div>
  );
};