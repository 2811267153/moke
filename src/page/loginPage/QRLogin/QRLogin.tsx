import React, { useEffect, useState } from 'react';
import { checkStatus, getLoginStatus, getUnikey, qrImage } from '@/axios/api';
import { ipcRenderer } from 'electron';
import styles from "./index.module.scss"
import { CaCheCookie, isShowLoading, monitorLoginStates } from '@/redux/accountLogin/slice';
import { useAppDispatch, useSelector } from '@/redux/hooks';
import db from '../../../../db';
import { userDataInfo } from '@/redux/accountLogin/accountSlice';


export const QRLogin: React.FC = () => {
  const dispatch = useAppDispatch()
  const [unikey, setUnikey] = useState('');
  const [cookie, setCookie] = useState('');
  const [qrImg, setQrImg] = useState('');
  const [loginState, setLoginState] = useState<any>("获取中");
  const accountData = useSelector(state => state.userSlice.accountInfoData);

  useEffect(() => {
    // 在组件中调用请求方法
    let timestamp = Date.now();
    getUnikey(timestamp).then(r => {
      setUnikey(r.unikey);
    });
  }, []);
  useEffect(() => {
    qrImage(unikey).then(r => {
      setQrImg(r.qrimg);
    });

    let timer: any = null;
    timer = setInterval(async () => {
      const statusRes  = await checkStatus(unikey);
      setLoginState(statusRes)
      if (statusRes?.code === 800) {
        setLoginState("二维码已过期请重新获取!")
        clearInterval(timer);
      }
      if (statusRes?.code === 803) {
        //清楚校友用户信息,
        db.remove({ key: "cookie" }, { multi: true }, function (err, numRemoved) {
          // 处理结果
          console.log("已完成");
        });
        // 这一步会返回cookie
        clearInterval(timer);
        setCookie(statusRes?.cookie);
        setLoginState("登录完成!")
        await getLoginStatus(statusRes?.cookie);
        dispatch(isShowLoading(false))
        dispatch(CaCheCookie(statusRes?.cookie))
      }
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [unikey]);

  useEffect(() => {
    if (cookie && accountData) {
      dispatch(monitorLoginStates(cookie));
      dispatch(userDataInfo(accountData));
    }
  }, [cookie, accountData]);

  return (
    <div className={styles["login-warp"]}>
      <div className={styles["login-erweima"]}>
        <img src={qrImg} alt='' />
      </div>
      <div className={styles["login-state"]}>
        <p>当前状态: {loginState?.message || JSON.stringify(loginState)}</p>
        {loginState.avatarUrl && <img src={loginState?.avatarUrl} alt='' />}
        <svg d="1679660282994" className={styles["rotate"]} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="5038" width="80" height="80">
          <path
            d="M512 431.36c43.946667 0 79.786667 35.84 79.786667 80.64 0 42.666667-35.84 78.933333-79.786667 78.933333S432.213333 554.666667 432.213333 512c0-44.8 35.84-80.64 79.786667-80.64M314.453333 853.333333c26.88 16.213333 85.76-8.533333 153.6-72.533333-22.186667-25.173333-43.946667-52.48-64.426666-81.066667a968.533333 968.533333 0 0 1-102.4-15.36c-21.76 91.306667-13.653333 154.026667 13.226666 168.96m30.293334-244.906666l-12.373334-21.76c-4.693333 12.373333-9.386667 24.746667-12.373333 36.693333 11.52 2.56 24.32 4.693333 37.546667 6.826667l-12.8-21.76m279.04-32.426667l34.56-64-34.56-64c-12.8-22.613333-26.453333-42.666667-38.826667-62.72C561.92 384 537.6 384 512 384s-49.92 0-72.96 1.28c-12.373333 20.053333-26.026667 40.106667-38.826667 62.72L365.653333 512l34.56 64c12.8 22.613333 26.453333 42.666667 38.826667 62.72 23.04 1.28 47.36 1.28 72.96 1.28s49.92 0 72.96-1.28c12.373333-20.053333 26.026667-40.106667 38.826667-62.72M512 289.28c-8.106667 9.386667-16.64 19.2-25.173333 30.72h50.346666c-8.533333-11.52-17.066667-21.333333-25.173333-30.72m0 445.44c8.106667-9.386667 16.64-19.2 25.173333-30.72h-50.346666c8.533333 11.52 17.066667 21.333333 25.173333 30.72M709.12 170.666667c-26.453333-16.213333-85.333333 8.533333-153.173333 72.533333 22.186667 25.173333 43.946667 52.48 64.426666 81.066667 34.986667 3.413333 69.546667 8.533333 102.4 15.36 21.76-91.306667 13.653333-154.026667-13.653333-168.96m-29.866667 244.906666l12.373334 21.76c4.693333-12.373333 9.386667-24.746667 12.373333-36.693333-11.52-2.56-24.32-4.693333-37.546667-6.826667l12.8 21.76m61.866667-300.8c62.72 35.84 69.546667 130.133333 43.093333 240.213334 108.373333 32 186.453333 84.906667 186.453334 157.013333s-78.08 125.013333-186.453334 157.013333c26.453333 110.08 19.626667 204.373333-43.093333 240.213334-62.293333 35.84-147.2-5.12-229.12-83.2-81.92 78.08-166.826667 119.04-229.546667 83.2-62.293333-35.84-69.12-130.133333-42.666666-240.213334-108.373333-32-186.453333-84.906667-186.453334-157.013333s78.08-125.013333 186.453334-157.013333c-26.453333-110.08-19.626667-204.373333 42.666666-240.213334 62.72-35.84 147.626667 5.12 229.546667 83.2 81.92-78.08 166.826667-119.04 229.12-83.2M728.746667 512c14.506667 32 27.306667 64 37.973333 96.426667 89.6-26.88 139.946667-65.28 139.946667-96.426667s-50.346667-69.546667-139.946667-96.426667c-10.666667 32.426667-23.466667 64.426667-37.973333 96.426667M295.253333 512c-14.506667-32-27.306667-64-37.973333-96.426667-89.6 26.88-139.946667 65.28-139.946667 96.426667s50.346667 69.546667 139.946667 96.426667c10.666667-32.426667 23.466667-64.426667 37.973333-96.426667m384 96.426667l-12.8 21.76c13.226667-2.133333 26.026667-4.266667 37.546667-6.826667-2.986667-11.946667-7.68-24.32-12.373333-36.693333l-12.373334 21.76m-123.306666 172.373333c67.84 64 126.72 88.746667 153.173333 72.533333 27.306667-14.933333 35.413333-77.653333 13.653333-168.96-32.853333 6.826667-67.413333 11.946667-102.4 15.36-20.48 28.586667-42.24 55.893333-64.426666 81.066667M344.746667 415.573333l12.8-21.76c-13.226667 2.133333-26.026667 4.266667-37.546667 6.826667 2.986667 11.946667 7.68 24.32 12.373333 36.693333l12.373334-21.76m123.306666-172.373333C400.213333 179.2 341.333333 154.453333 314.453333 170.666667c-26.88 14.933333-34.986667 77.653333-13.226666 168.96a968.533333 968.533333 0 0 1 102.4-15.36c20.48-28.586667 42.24-55.893333 64.426666-81.066667z"
            fill="#ff59a9" p-id="5039"></path>
        </svg>
        <div style={{paddingTop: 5}}>{loginState?.nickname || "加载中"}</div>
      </div>
    </div>
  );
};
