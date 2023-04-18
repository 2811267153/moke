/*
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { AudioController, AudioControllerRef, ListItem, Skeleton } from '@/components';
import { Image } from '@/components';
import { useAppDispatch, useSelector } from '@/redux/hooks';

// @ts-ignore
import { format } from '@/utils/index';
import { musicDetailPage, musicUrl, songsDurationDispatch } from '@/redux/musicDetailProduct/slice';
import { musicLyric } from '@/redux/getLyric/slice';
import { Lyrics } from '@/components';
import { currentMusicData } from '@/redux/audioDetail/slice';
import { searchProduct } from '@/redux/searchProduct/slice';
// import { ipcRenderer } from 'electron';

export const PlayerPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [musicObj, setMusicObj] = useState<ListItem | null>(null);
  const [id, setId] = useState<number>(0);  //歌曲的id
  const [level, setLevel] = useState('standard'); //选择歌曲的品质
  const [currentTime, setCurrentTime] = useState(0); //当前播放的秒数
  const [duration, setDuration] = useState(50); //歌曲的总时长
  const [width, setWidth] = useState(0); //进度条宽度
  const [musicLoading, setMusicLoading] = useState(true);
  const [musicState, setMusicStates] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);  //控制音乐的播放状态

  const { songsid } = useParams();

  const loading = useSelector(state => state.musicDetailPage.songsLoading); // 歌词加载loading
  const songsUrl = useSelector(state => state.musicDetailPage.songsUrl); //音乐的url
  const error = useSelector(state => state.musicDetail.error);
  const lyricErr = useSelector(state => state.musicLyric.error);
  const lyricLoaing = useSelector(state => state.musicLyric.loading);
  const lyricData = useSelector(state => state.musicLyric.data); //获取当前歌曲的歌曲数据
  const searchData = useSelector(state => state.musicDetailPage.data); //获取搜索该歌曲后的信息<主要是获取歌曲的总播放时长>
  const songsData = useSelector(state => state.audioData.audioInfo); //获取全部播放列表
  const currentMusic = useSelector(state => state.audioData.currentMusic)
  const songsLoading = useSelector(state => state.musicDetailPage.songsLoading)
  const [currentIndex, setCurrentIndex] = useState(0); //当前播放歌曲的索引值
  const audioRef = useRef<AudioControllerRef>(null);


  useEffect(() => {
    dispatch(songsDetail(songsid!))
    setWidth(0);
  }, []);
  useEffect(() => {
    if (musicObj) {
      setId(musicObj?.id);
      //将当前播放的歌曲保存到store中
      // dispatch(currentMusicData(musicObj))
    }
  }, [musicObj]);
  useEffect(() => {
    const params = {
      value: songsid,
      offset: 1
    }
    if (songsid) {
      console.log("id -----------",id);
      dispatch(musicUrl({ songsid, level }));
      dispatch(musicDetailPage({ songsid }));
      dispatch(musicLyric({ songsid }));
    }
  }, [id]);


  useEffect(() => {
    console.log('songsData', songsData);
  }, [songsData]);


  useEffect(() => {
    setWidth((currentTime / (searchData.duration / 1000)) * 100);
  }, [currentTime]);


  const previous = (type: string, index: number) => {
    if (type === 'previous') {
      if (index > 0) {
        setCurrentIndex(--index);
      } else {
        setCurrentIndex(songsData.length - 1);
      }
    } else if (type === 'next') {
      if (index < songsData.length - 1) {
        setCurrentIndex(++index);
      } else {
        setCurrentIndex(0);
      }
    }
    setMusicObj(songsData[currentIndex]);
    dispatch(currentMusicData(songsData[currentIndex]));
    // ipcRenderer.send('currentMusic', songsData[currentIndex]);
  };

  if (songsLoading) {
    return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Skeleton />;
    </div>);
  }


  const handleTimeUpdate = (currentTime: number) => {
    setCurrentTime(currentTime);
  };
  const handleLoadedData = (loadig: boolean) => {
    setMusicLoading(loadig);
  };
  const handleDuration = (duration: number) => {
    setDuration((duration / (searchData.duration / 1000) * 100));
  };
  const handleEnded = () => {
    setMusicStates(false);
  };
  const toggleAudio = () => {
    // console.log(audio);
    if (isPlaying ) {
      if(audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if(audioRef.current) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  }
  const handleOnPause = () => {
    setMusicStates(true);
    if(audioRef.current) {
      audioRef.current.pause();
    }
  };
  const handleOnPlaying = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  };
  return (
    <div className={styles['page-warp']}>
      <div className={styles['player-info']}>
        <h3>{currentMusic?.name}</h3>
        <p style={{ display: 'inline-block' }} className={styles['player-ar']}>
          {
            currentMusic?.ar[0].name && (currentMusic?.ar.map((item: string) => {
              return <a key={item.id}>{item.name}</a>;
            }))
          }
        </p>
        <div className={styles['player-image']}>
          {currentMusic?.al ? <Image width={200} style={{ borderRadius: '20px' }} src={currentMusic?.al.picUrl}></Image> :
            <Image width={200} style={{ borderRadius: '20px' }} src={musicObj?.blurPicUrl}></Image>}
        </div>
        <div className={styles['controller']}>
          <span> {format(currentTime)}</span>
          <div className={styles['player-controller']}>
            <div className={styles['player-controller-solid']} style={{ width: width + '%' }} />
            {duration <= 30 &&
              <div className={styles['player-controller-point']} style={{ width: duration + '%' }}></div>}
          </div>
          {searchData && searchData.duration && <span>{format(searchData.duration / 1000)}</span>}
          {!searchData && searchData.duration && <span>00: 00</span>}
        </div>
        <div className={styles['controller']}>
          <div><i className='icon iconfont icon-aixin'></i></div>
          <div><i className='icon iconfont icon-zuo-02' onClick={() => previous('previous', currentIndex)}></i></div>
          <div><i className='icon iconfont icon-zanting-01' style={{ fontSize: 35 }}></i></div>
          <div><i className='icon iconfont icon-you-02' onClick={() => previous('next', currentIndex)}></i></div>
          <div><i className='icon iconfont icon-yinliang'></i></div>
        </div>
        <AudioController onDuration={handleDuration} src={songsUrl} onTimeUpdate={handleTimeUpdate}
                         ref={audioRef} autoplay={currentMusic?.autoplay}
                         onLoadedData={handleLoadedData}  onEnded={handleEnded} pause={handleOnPause} play={handleOnPlaying}/>
      </div>
      <div className={styles['player-lyrics']}>
        {lyricLoaing ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Skeleton />;
          </div>) : <Lyrics currentTime={currentTime} lyrics={lyricData}></Lyrics>}
      </div>
    </div>
  );v
};
*/
import React from 'react';


export const PlayerPage: React.FC = () => {
  return <div></div>
}