import React, { useEffect, useState } from 'react';
import { HistoryPlay, RecommendedStation, RecommendPlayList } from '@/components';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { RecommendSongs } from '@/components/recommendSongs';
import { isShowLoading } from '@/redux/accountLogin/slice';
// import { recommendSongs } from '@/redux/recmmendSongs/slice';
import { Modal } from 'antd';
import { QRLogin } from '../loginPage';

export const HomePage: React.FC = () => {

  const dispatch = useAppDispatch()
  const showLoading = useSelector(state => state.loginUnikey.showLoading) || false;
  const getQrCookie = (data: any) => {
    // setModal2Open(false)
  }
  const handleClosure = () => {
    dispatch(isShowLoading(false))
  }
  return(
      <div>
          <HistoryPlay />
        <RecommendedStation />
        <Modal
          title="请打开网易云音乐扫码登录"
          centered
          open={showLoading}
          footer={null}
          onCancel={handleClosure}
        >
          <QRLogin getQrCookie={getQrCookie}></QRLogin>
        </Modal>
        <RecommendSongs />
        <RecommendPlayList />
      </div>
    )
}
