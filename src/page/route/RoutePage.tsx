import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss"
import { useAppDispatch, useSelector } from '@/redux/hooks';
import { message } from 'antd/lib';
import { userInfo } from '@/redux/accountLogin/accountSlice';
import { isShowLoading } from '@/redux/accountLogin/slice';
import { useNavigate } from 'react-router-dom';

interface RouterItem {
  name?: string,
  icon?: string
  id: number
}
const RouterData: RouterItem[] = [
  {name: "首页", icon: "icon-shouye", id: 1},
  {name: "列表", icon: "icon-bofang-tongyong", id: 2},
  {name: "推荐", icon: "icon-calendar", id: 6},
  {name: "发现", icon: "icon-faxian2", id: 3},
  {name: "艺术家", icon: "icon-geren", id: 4},
  {name: "分类", icon: "icon-fenlei", id: 5},
]
const RouterPath = ['/', "/list", '/recommend', '/feed', '/artist', '/classify']

export const RoutePage: React.FC = () => {
  const userInfo = useSelector(state => state.userSlice.accountInfoData) || null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useAppDispatch()
  const navigate =  useNavigate()

  const handleItemCkick = (index: number) => {
    setCurrentIndex(index)
    navigate(RouterPath[index])
  }
  const handleAccountClick =  (type: string) => {
    if(type === "account") {
      dispatch(isShowLoading(true))
    }else if(type === "setting") {
      message.info({
        content: "内容还在完善中~"
      })
    }
  }
  return (
    <div className={styles["router-warp"]}>
      <div style={{position: 'relative', width: 170}}>
        {
          RouterData.map((item: RouterItem, index) => {
            const isActive = index === currentIndex;
            return <button  className={`${styles["router-item"]} ${isActive ? styles.action : ""}`} key={item.id} onClick={() => handleItemCkick(index)}>
              <i className={`icon iconfont ${item.icon}`}/> <span>{item.name}</span>
              <div className={styles.itemSolidButton}></div>
            </button>
          })
        }
        <div className={styles['account-info']}>
          <button className={styles["router-item"]} onClick={() => handleAccountClick("setting")}>
            <i className="icon iconfont icon-xitonggongnengguanli" /> 设置
          </button>
          {userInfo === null &&<button className={styles['router-item']} onClick={() => handleAccountClick('account')}>
            <i className='icon iconfont icon-yonghu-01' /> 请登录
          </button>}
          {userInfo !== null && <button className={styles['router-item']} onClick={() => handleAccountClick('account')}>
            <img src={userInfo.profile?.avatarUrl} alt='' /> <span>{userInfo.profile?.nickname}</span>
          </button>}
        </div>
      </div>
    </div>
  );
};