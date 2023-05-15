import React, { useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';
import { HomePage, QRLogin, RoutePage } from '@/page';
import { Layout, message, Modal, Space } from 'antd';
import { MenuBtn, Header, AudioPlayer, ListItem } from './components';
import { Route, Routes, useLocation } from 'react-router-dom';
import { SearchePage } from '@/page/searchPage/SearchePage';
import { PlayerPage } from '@/page/playerPage';
import { AlbumPage } from '@/page/albumPage';
import { ipcRenderer } from 'electron';
import { CheckCookie, isShowLoading, monitorLoginStates } from '@/redux/accountLogin/slice';
import { deleteAllFromPlayingList, musicListDispatch, playingList } from '@/redux/audioDetail/slice';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { accountInfo, userDataInfo } from '@/redux/accountLogin/accountSlice';
import { ListPage } from '@/page/listPage';
import { RecommendPage } from '@/page/recommendPage';
import { FeedPage } from '@/page/feedPage';
import { ArtistPage } from '@/page/artistPage';
import { ClassifyPage } from '@/page/classifyPage';
import PubSub from 'pubsub-js';
import db from '../db';
import { readdirSync } from 'fs';
import { songsSearch_c } from '@/redux/musicDetailProduct/slice';
import { getSongsInfoData } from '@/redux/albumInfo/slice';
import { FindFiles, getMusicListByIds } from '@/utils/findFiles';

const { Sider } = Layout;
export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const cookie = useSelector(state => state.loginUnikey.cookie);
  const monitorLoginState = useSelector(state => state.loginUnikey.monitorLoginStates);
  const accountData = useSelector(state => state.userSlice.accountInfoData);
  const playList = useSelector(state => state.audioData.playingList);
  const isPlaying = useSelector(state => state.audioData.isPlaying);
  const isLoading = useSelector(state => state.audioData.isLoading);
  const [hidden, setHidden] = useState(false);
  const [header, setHeader] = useState(50);
  const paddingBottom = hidden ? 0 : '80px';
  const height = header ! == 0 ? '100vh' : 'calc(100vh - 50px)';
  const showLoading = useSelector(state => state.loginUnikey.showLoading) || false;

  const [list, setList] = useState<ListItem[]>([]); //保存的未被初始化的音乐
  const listRef = useRef<ListItem[]>([]); // 保存不好喊img图片的歌曲信息
  const ablumAllSongsList = useSelector(state => state.musicAlbumDetail.songsInfoData.songs) || [];
  const search_cData = useSelector(state => state.musicDetailPage.searchSongs);
  const [musicList, setMusicList] = useState<ListItem[]>([]);
  const [aaaa, setAaaa] = useState();


  useEffect(() => {
    const { musicList, searchValues } = FindFiles('C:/Users/breeze/Music',)
    setMusicList(musicList)
    searchValues.map((item: string) => {
      const regex = /\s*\([^)]+\)/g; // 匹配括号及其内容，包括前面的空格
      const cleanedString = item.replace(regex, '');
      dispatch(songsSearch_c({ value: cleanedString, offset: 1, limit: 1 }));
    });

    dispatch(deleteAllFromPlayingList())
    db.find({ key: 'playlist' }, (err: Error | null, data: any) => {
      if (err !== null) {
        console.log(err);
        return;
      }
      dispatch(playingList(data[0].value));
    });
    db.find({ key: 'cookie' }).limit(1).exec((err, data) => {
      if (err) {
        message.info(`cookie is error: ${err.message}`);
      } else {
        if (data.length !== 0) {
          dispatch(CheckCookie(data[0].value));
          console.log("userInfo----------------",data);
        }
      }
    });

    PubSub.subscribe('hiddenMenu', (_, data) => {
      setHeader(data);
    });

    const contentElement = document.getElementsByClassName(styles.Content)[0] as HTMLDivElement;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      PubSub.subscribe('ArtistScrollTo', (_, scroll) => {
        contentElement.scrollTo({ top: scroll, behavior: 'smooth' });
      });
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    console.log("cookie", accountData);
    if (cookie && accountData) {
      dispatch(monitorLoginStates(cookie));
      dispatch(userDataInfo(accountData));
    }
  }, [cookie, accountData]);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/playerPage') {
      PubSub.publish('AudioCurretTime', [0, 0.000 / 1000, isLoading, isPlaying, playList[0]]);
      console.log('playlist', playList);
      setHidden(true);
    } else {
      setHidden(false);
      setHeader(50);
    }
    if(location.pathname === "/list/file"){
      PubSub.publish("ListPageData", aaaa);
    }
  }, [location]);
  useEffect(() => {
    PubSub.publish('AudioCurrentMusic', playList[0]);
  }, [playList]);

  useEffect(() => {
    if (monitorLoginState.code === 200 && monitorLoginState.account === null) {
      ipcRenderer.send('setCookie', '');
    } else {
      dispatch(accountInfo(cookie));
    }
  }, [cookie]);

  useEffect(() => {
    if (Array.isArray(search_cData.songs)) {
      //把添加的歌曲信息保存到本地
      const newList = [...listRef.current, ...search_cData.songs];
      listRef.current = newList;
      setList(newList);
    }
  }, [search_cData]);

  useEffect(() => {
    //过滤掉重复的数据保存所有的id
    const uniqueList = list.filter((item, index, arr) => {
      return arr.findIndex((t) => t.id === item.id) === index;
    });

    //讲所有保存的id保存为字符串 使用 ","分割
    const uniqueIdList = uniqueList.map(item => item.id).join(',');
    dispatch(getSongsInfoData(uniqueIdList));
  }, [list]);

  useEffect(() => {
    // 更新musicList
    const music = musicList.map((music: ListItem) => {
      const foundItem = ablumAllSongsList.find((item: ListItem) => item.name.includes(music.name?.slice(0, 2)));
      if (foundItem) {
        Object.keys(foundItem).forEach((key) => {
          if (!music.hasOwnProperty(key)) {
            // @ts-ignore
            music[key] = foundItem[key];
          }
        });
      }
      return music
    });
    // @ts-ignore
    setAaaa(music)

    if(location.pathname === "/list/file"){
      PubSub.publish("ListPageData", music);
    }
  }, [ablumAllSongsList]);

  let t: NodeJS.Timeout | null = null;

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.getElementsByClassName(styles.Content)[0];
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (t != null) {
        clearTimeout(t);
      }
      t = setTimeout(() => {
        PubSub.publish('AppChangeQueryCount');
      }, 1000);
    }
  };
  const handleClosure = () => {
    dispatch(isShowLoading(false));
  };

  return (
    <div className={styles.App}>
      <Space direction='vertical' style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Sider className={styles['sider']}>
            <MenuBtn></MenuBtn>
            <RoutePage></RoutePage>
          </Sider>
          {/*<Layout>*/}
          <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header height={header}></Header>
            <div className={styles.Content} style={{ paddingBottom, height: height }}>
              <Routes>
                <Route path='/login' element={<QRLogin />}></Route>
                <Route path='/searchPage/:searchKey' element={<SearchePage />}></Route>
                <Route path='/playerPage' element={<PlayerPage />}></Route>
                <Route path='/album/:albumid' element={<AlbumPage />}></Route>
                <Route path='/list/:type' element={<ListPage />}></Route>
                <Route path='/recommend' element={<RecommendPage />}></Route>
                <Route path='/feed' element={<FeedPage />}></Route>
                <Route path='/artist' element={<ArtistPage />}></Route>
                <Route path='/classify' element={<ClassifyPage />}></Route>
                <Route path='/' element={<HomePage />} />
              </Routes>
            </div>
            <div className={hidden ? `${styles.hidden}` : styles.active}>
              <AudioPlayer />
            </div>

            <Modal
              title='请打开网易云音乐扫码登录'
              centered
              open={showLoading}
              footer={null}
              onCancel={handleClosure}
            >
              <QRLogin />
            </Modal>
          </Layout>
        </Layout>
      </Space>
    </div>
  );
};

