import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import { HomePage, QRLogin, RoutePage } from '@/page';
import { Layout, Space } from 'antd';
import { MenuBtn, Header, AudioPlayer } from './components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { SearchePage } from '@/page/searchPage/SearchePage';
import { PlayerPage } from '@/page/playerPage';
import { AlbumPage } from '@/page/albumPage';
import { ipcRenderer } from 'electron';
import { CheckCookie, monitorLoginStates } from '@/redux/accountLogin/slice';
import { currentMusicData, playingList, songHistoryListData } from '@/redux/audioDetail/slice';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { accountInfo, userDataInfo } from '@/redux/accountLogin/accountSlice';
import { ListPage } from '@/page/listPage';
import { RecommendPage } from '@/page/recommendPage';
import { FeedPage } from '@/page/feedPage';
import { ArtistPage } from '@/page/artistPage';
import { ClassifyPage } from '@/page/classifyPage';
import PubSub from 'pubsub-js';

const { Footer, Sider, Content } = Layout;


// 渲染进程发送事件===这个可以放到一个点击事件里面去触发
export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate()

  const cookie = useSelector(state => state.loginUnikey.cookie);
  const monitorLoginState = useSelector(state => state.loginUnikey.monitorLoginStates);
  const accountData = useSelector(state => state.userSlice.accountInfoData);
  const playList = useSelector(state => state.audioData.playingList);
  const isPlaying = useSelector(state => state.audioData.isPlaying);
  const isLoading = useSelector(state => state.audioData.isLoading)
  const [hidden, setHidden] = useState(false);
  const paddingBottom = hidden ? 0 : "80px"

  useEffect(() => {
    ipcRenderer.send('getCookie');
    ipcRenderer.send('getCurrentMusic');
    ipcRenderer.send('getSongHistoryListData');
    ipcRenderer.send('getSongplayingList');

    // 在渲染进程中接收来自主进程的响应
    ipcRenderer.on('getCookie', (event, arg) => {
      dispatch(CheckCookie(arg.getCookie));
    });
    ipcRenderer.on('currentMusic', (e, arg) => {
      dispatch(currentMusicData(arg));
    });
    ipcRenderer.on('getsongHistoryList', (e, data) => {
      dispatch(songHistoryListData(data));
    });
    ipcRenderer.on('getSongplayingListData', (e, data) => {
      dispatch(playingList(data));
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
    if (cookie && accountData) {
      dispatch(monitorLoginStates(cookie));
      dispatch(userDataInfo(accountData));
    }
  }, [cookie, accountData]);

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === '/' || location.pathname ==="/playerPage") {
      PubSub.publish('AudioCurretTime', [0, 0.000 / 1000, isLoading, isPlaying, playList[0]]);
      setHidden(true)
    }else {
      setHidden(false)
    }
  }, [location]);
  useEffect(() => {
    PubSub.publish('AudioCurrentMusic',  playList[0]);
  }, [playList]);

  useEffect(() => {
    if (monitorLoginState.code === 200 && monitorLoginState.account === null) {
      ipcRenderer.send('setCookie', '');
    } else {
      dispatch(accountInfo(cookie));
    }
  }, [cookie]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.getElementsByClassName(styles.Content)[0];

    PubSub.publish('AppChangeQueryCounts', scrollTop);
    if (scrollTop + clientHeight >= scrollHeight) {
      PubSub.publish('AppChangeQueryCount');
    }
  };

  const handleToPayerPage = () => {
    navigate('/playerPage')
  }

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
            <Header></Header>
            <div className={styles.Content} style={{paddingBottom}}>
              <Routes>
                <Route path='/login' element={<QRLogin />}></Route>
                <Route path='/searchPage/:searchKey' element={<SearchePage />}></Route>
                <Route path='/playerPage' element={<PlayerPage />}></Route>
                <Route path='/album/:albumid' element={<AlbumPage />}></Route>
                <Route path='/list' element={<ListPage />}></Route>
                <Route path='/recommend' element={<RecommendPage />}></Route>
                <Route path='/feed' element={<FeedPage />}></Route>
                <Route path='/artist' element={<ArtistPage />}></Route>
                <Route path='/classify' element={<ClassifyPage />}></Route>
                <Route path='/' element={<HomePage />} />
              </Routes>
            </div>
            <div className={hidden ? `${styles.hidden}` : styles.active}>
              <AudioPlayer handleToPayerPage={handleToPayerPage}/>
            </div>
          </Layout>
        </Layout>
      </Space>
    </div>
  );
};

