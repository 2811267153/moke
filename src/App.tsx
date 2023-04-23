import React, { useEffect, useState } from 'react';
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
import {  playingList } from '@/redux/audioDetail/slice';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { accountInfo, userDataInfo } from '@/redux/accountLogin/accountSlice';
import { ListPage } from '@/page/listPage';
import { RecommendPage } from '@/page/recommendPage';
import { FeedPage } from '@/page/feedPage';
import { ArtistPage } from '@/page/artistPage';
import { ClassifyPage } from '@/page/classifyPage';
import PubSub from 'pubsub-js';
import db from '../db';
const { Sider } = Layout;
export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const cookie = useSelector(state => state.loginUnikey.cookie);
  const monitorLoginState = useSelector(state => state.loginUnikey.monitorLoginStates);
  const accountData = useSelector(state => state.userSlice.accountInfoData);
  const playList = useSelector(state => state.audioData.playingList);
  const isPlaying = useSelector(state => state.audioData.isPlaying);
  const isLoading = useSelector(state => state.audioData.isLoading)
  const [hidden, setHidden] = useState(false);
  const [header, setHeader] = useState(50);
  const paddingBottom = hidden ? 0 : "80px"
  const height = header ! == 0 ? "100vh" : "calc(100vh - 50px)"
  const showLoading = useSelector(state => state.loginUnikey.showLoading) || false;


  useEffect(() => {

    db.find({ type: "playinglist" }, (err: Error | null, data: ListItem[]) => {
      if(err !== null) {
        console.log(err);
        return
      }
      dispatch(playingList(data))
    })
    db.find({ key: "cookie" }).limit(1).exec((err, data) => {
      if (err) {
        message.info(`cookie is error: ${err.message}`, )
      } else {
        if(data.length !== 0) {
          dispatch(CheckCookie(data[0].value))
        }
      }
    });
    // //清楚校友用户信息,
    // db.remove({ key: "cookie" }, { multi: true }, function (err, numRemoved) {
    //   // 处理结果
    //   console.log("已完成");
    // });

    PubSub.subscribe('hiddenMenu', (_, data) => {
      setHeader(data)
    })
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
    if (location.pathname === '/' || location.pathname ==="/playerPage") {
      PubSub.publish('AudioCurretTime', [0, 0.000 / 1000, isLoading, isPlaying, playList[0]]);
      setHidden(true)
    }else {
      setHidden(false)
      setHeader(50)
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
  let t: NodeJS.Timeout | null = null

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.getElementsByClassName(styles.Content)[0];
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        if(t != null) {
          clearTimeout(t)
        }
        t = setTimeout(() => {
          PubSub.publish('AppChangeQueryCount', );
        }, 1000)
    }
  };
  const handleClosure = () => {
    dispatch(isShowLoading(false))
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
            <Header height={header}></Header>
            <div className={styles.Content} style={{paddingBottom, height:height}}>
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
              <AudioPlayer />
            </div>

            <Modal
              title="请打开网易云音乐扫码登录"
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

