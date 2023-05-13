import React, { useState, useRef, useEffect } from 'react';
import styles from '@/App.module.scss';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import {
  songsDurationDispatch,
  songsUrlDispatch
} from '@/redux/musicDetailProduct/slice';
import { message } from 'antd';
import { changeAudioPlay, isLoadingDispatch, isPlayingDispatch } from '@/redux/audioDetail/slice';
import PubSub from 'pubsub-js';
import { useNavigate } from 'react-router-dom';
import {Image} from '@/components';
import { getScrobbleDispatch } from '@/redux/other/slice';

export const AudioPlayer: React.FC = () => {
  const navigate = useNavigate()
  const songsUrl = useSelector(state => state.musicDetailPage.songsUrl) || ''; //获取线上歌曲url
  const [benDiUrl, setBenDiUrl] = useState("");//获取本地url
  const playList = useSelector(state => state.audioData.playingList || []);//保存正在播放的音乐
  const songsDuration = useSelector(state => state.musicDetailPage.songsDuration);
  const autoPlay = useSelector(state => state.audioData.isAudioPlay);
  const isPlaying = useSelector(state => state.audioData.isPlaying);
  const cookie = useSelector(state => state.loginUnikey.cookie) || ''
  const isLoading = useSelector(state => state.audioData.isLoading)

  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentsMusic = playList?.[currentIndex] || {};
  const [flag, setFlag] = useState(true); //控制页面是否初次打开

  useEffect(() => {
    PubSub.subscribe('currentIndex', (_, index) => {
      setCurrentIndex(index);
    });
    PubSub.subscribe('UpDataTime', (_, Time) => {

      if(audioRef.current){
        audioRef.current.currentTime = Time / 1000 -1
        audioRef.current.play()
      }
    })
    //读取本地歌曲
    loadMusic()

    return () => {
      PubSub.unsubscribe('currentIndex');
      // PubSub.unsubscribe('RecommendedStation');
      PubSub.unsubscribe('AudioCurrentMusic');
    };

  }, []);

  useEffect(() => {
    if (playList.length != 0) {
      setCurrentIndex(0);
      //如果当前播放歌曲不包含url属性 则发送请求
      if(!playList[currentIndex].hasOwnProperty('url')){
        const params = {
          id: playList[currentIndex]?.id,
          level: 'standard',
          sourceid: playList[currentIndex]?.al.id,
          time: currentTime,
          cookie
        };
        dispatch(songsUrlDispatch(params));
        dispatch(songsDurationDispatch(currentsMusic?.id));
        dispatch(getScrobbleDispatch(params))
      }else {
        setBenDiUrl(playList[currentIndex].url)
      }
    }
  }, [playList]);

  useEffect(() => {
    //监听通过播放页面传递过来的切换歌曲请求
    PubSub.subscribe("PlayerPageChangeSongs", (_, data) => {
      handleNextClick(data[0], data[1])
    })
    //如果当前歌曲不存在id属性 那么就是本地歌曲 将loading状态设置为false
    console.log( currentsMusic.id === undefined );
    if (playList.length !== 0 && currentsMusic?.id != undefined) {
      if(flag) {
        //如果当前播放歌曲不包含url属性 则发送请求
        if(!playList[currentIndex].hasOwnProperty('url')){
          const params = {
            id: playList[currentIndex]?.id,
            level: 'standard',
            sourceid: playList[currentIndex]?.al.id,
            time: currentTime,
            cookie
          };
          dispatch(songsUrlDispatch(params));
          dispatch(songsDurationDispatch(currentsMusic?.id));
          dispatch(getScrobbleDispatch(params))
        }else {
          setBenDiUrl(playList[currentIndex].url)
        }
        setFlag(false)
      }
      dispatch(isPlayingDispatch(true))
      dispatch(isLoadingDispatch(false))
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      const onLoadedData = () => {
        dispatch(isLoadingDispatch(false))
        dispatch(isPlayingDispatch(true));
        setDuration(audio.duration > 31 ? audio.duration : (songsDuration / 1000));
        if (audio.duration <= 32) {
          message.info('当前歌曲为30秒试听版本');
        }
        PubSub.publish('AudioCurrentLoadingMusicData', false);
      };
      const onprogress = () => {
        dispatch(isLoadingDispatch(true))
        const bufferedTimeRanges = audio.buffered;
        if (bufferedTimeRanges.length > 0) {
          const bufferedTime = bufferedTimeRanges.end(bufferedTimeRanges.length - 1);
          // console.log(`已缓冲: ${bufferedTime.toFixed(2)}秒`);
        }
      }
      const onTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        dispatch(isLoadingDispatch(false))
        console.log(isLoading);
        // dispatch(isPlayingDispatch(true));
      };

      const onEnded = () => {
        handleNextClick(undefined,'next');
        setCurrentTime(0);
        dispatch(isPlayingDispatch(false));
      };
      const onPlaying = () => {
        dispatch(isLoadingDispatch(false))
        dispatch(isPlayingDispatch(false));
      };
      const onwaiting = () => {
        dispatch(isLoadingDispatch(true))
        dispatch(isPlayingDispatch(false))
      }
      const onloadedmetadata = () => {
        if(autoPlay) {
          audio.play()
          dispatch(isPlayingDispatch(true))
          dispatch(isLoadingDispatch(false))
        }
      }

      audio.addEventListener('loadeddata', onLoadedData);
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('playing', onPlaying);
      audio.addEventListener('progress', onprogress);
      audio.addEventListener('waiting', onwaiting);
      audio.addEventListener('loadedmetadata', onloadedmetadata);

      return () => {
        audio.addEventListener('loadeddata', onLoadedData);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('progress', onprogress);
        audio.addEventListener('waiting', onwaiting);
        audio.addEventListener('loadedmetadata', onloadedmetadata);
      };
    }
  }, [currentsMusic]);
  useEffect(() => {
    PubSub.publish('AudioCurretTime', [currentTime, duration , isLoading, isPlaying, playList[currentIndex], currentIndex]);
  }, [currentTime]);

  let timer: NodeJS.Timeout | null = null;
  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }
    if (songsUrl === '无版权歌曲') {
      message.error('当前歌曲暂无版权信息，即将自动切换至下一首播放').then();
      timer = setInterval(() => {
        setCurrentIndex(currentIndex + 1);
      }, 3000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [songsUrl]);


  useEffect(() => {
    if(currentIndex < playList.length){
      PubSub.publish('AudioCurrentMusic', playList[currentIndex]);
      //如果当前播放歌曲不包含url属性 则发送请求
      if(!playList[currentIndex].hasOwnProperty('url')){
        const params = {
          id: playList[currentIndex]?.id,
          level: 'standard',
          sourceid: playList[currentIndex]?.al.id,
          time: currentTime,
          cookie
        };
        dispatch(songsUrlDispatch(params));
        dispatch(songsDurationDispatch(currentsMusic?.id));
        dispatch(getScrobbleDispatch(params))
      }else {
        setBenDiUrl(playList[currentIndex].url)
      }
    }else {
      setCurrentIndex(0)
    }
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (isPlaying) {
      audio.pause();
      // setCurrentTime(0);
    } else {
      audio.play();
      // setCurrentTime(0);
    }
  }, [isPlaying]);
  const handlePlayPauseClick = (e:any) => {
    e.stopPropagation()
    dispatch(isPlayingDispatch(!isPlaying));
    dispatch(changeAudioPlay(true));
  };
  const handleNextClick = (e:any, type: "next" | "piece") => {
    dispatch(changeAudioPlay(true));
    if(e !== undefined) {
      e.stopPropagation()
    }
    switch (type) {
      case 'next': {
        if (currentIndex < playList.length - 1) {
          setCurrentTime(0); // 将当前播放时间重置为 0
          // audio?.pause();
          return setCurrentIndex(currentIndex + 1);
        } else {
          // audio?.pause();
          setCurrentTime(0); // 将当前播放时间重置为 0
          return setCurrentIndex(0);
        }
      }
      case 'piece': {
        if (currentIndex > 0) {
          setCurrentTime(0); // 将当前播放时间重置为 0
          return setCurrentIndex(currentIndex - 1);
        } else {
          setCurrentTime(0); // 将当前播放时间重置为 0
          return setCurrentIndex(playList.length - 1);
        }
      }
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const time = Number(event.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handelClick = () => {
    navigate('/playerPage')
  }
  const loadMusic = () => {
  };

  return <div className={`${styles['footer']}`} onClick={handelClick}>
    <div className={styles['audio-controller-warp']}>
      <div className={styles['audio-controller']}
           style={{ width: (currentTime / duration ) * 100 + '%' }}></div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {currentsMusic && currentsMusic.name && <div className={styles['audio']}>
        <div className={styles.audioArt}>
          <Image key={currentsMusic?.id} src={currentsMusic?.al?.picUrl || ""}></Image>
          <div className={styles.footerSongs}>
            <span>{currentsMusic.name}</span>
            <p
              className={styles['music-other']}>{currentsMusic && currentsMusic.ar && currentsMusic.ar.map((item: any) => {
              return <span key={item.id}>{item.name} -</span>;
            }) || "未知艺术家"} <span
              className={styles['music-ablum']}>专辑: {currentsMusic && currentsMusic.al && currentsMusic.al.name || "未知专辑"}</span>
            </p>
          </div>
        </div>
      </div>}
      <div className={styles['iconfont']}>
        <i className='icon iconfont icon-shangyiqu' onClick={(event) => handleNextClick(event, 'piece')} />
        {/*如果isPlaying是true显示播放按钮,否则显示暂停*/}
        {!isPlaying && !isLoading &&  <i className='icon iconfont icon-bofangzhong' onClick={(e) => handlePlayPauseClick(e)} style={{ fontSize: 35 }} />}
        {!isLoading && isPlaying && <i className='icon iconfont icon-zanting' onClick={e => handlePlayPauseClick(e)} style={{ fontSize: 35 }} />}
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
        <i className='icon iconfont icon-xiayiqu' onClick={(event) => handleNextClick(event, 'next')} />
      </div>
      <div style={{ width: 300, textAlign: 'right', paddingRight: 30 }}>
        <i className='icon iconfont icon-yinliang1' style={{ fontSize: 20, marginRight: 20 }}></i>
        <i className='icon iconfont icon-bofangduilie' style={{ fontSize: 20, marginRight: 20 }}></i>
      </div>
      {playList[currentIndex] && playList[currentIndex].url && <audio src={benDiUrl} autoPlay={autoPlay} ref={audioRef} />}
      {playList[currentIndex] && playList[currentIndex].url === undefined && <audio src={songsUrl} autoPlay={autoPlay} ref={audioRef} />}
    </div>
  </div>;
};



