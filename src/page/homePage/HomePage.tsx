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
  const getQrCookie = (data: any) => {
    // setModal2Open(false)
  }

  return(
      <div>
          <HistoryPlay />
        <RecommendedStation />
        <RecommendSongs />
        <RecommendPlayList />
      </div>
    )
}
