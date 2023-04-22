import React, { useEffect, useRef, useState } from 'react';

import styles from './Index.module.scss';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useSelector } from '@/redux/hooks';
import { setSearchKey } from '@/redux/TestRedux/slice';
import { songsSearch, songsSearch_c, updateKeyword } from '@/redux/musicDetailProduct/slice';
interface PropsType {
  height: number
}
export const Header: React.FC<PropsType> = ({height}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cookie = useSelector(state => state.loginUnikey.cookie) || ""
  const [value, setValue] = useState('');
  const [offset, setOffset] = useState(1);

  let t: NodeJS.Timeout | null = null
  const searchInputChange = (e: any) => {
    if(t != null) {
      clearTimeout(t)
    }
    t = setTimeout(() => {
      const { value } = e.target;
      setValue(value);

      dispatch(updateKeyword(value));
      dispatch(songsSearch_c({ value, offset }));
      dispatch(setSearchKey(value));

      navigate(`/searchPage/:${value}`);
    }, 1000)
  };

  useEffect(() => {
    console.log(cookie);
  }, [cookie]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      dispatch(songsSearch_c({ value, offset }));
      dispatch(setSearchKey(value));
      navigate(`/searchPage/:${value}`);
    }
  };
  return (
    <div className={styles['header-warp']} style={{height: height + "px", overflow: 'hidden'}}>
      <div className={styles['header-router']}>
        <button onClick={() => history.go(-1)} className='iconfont icon-zuo-01'></button>
        <button onClick={() => history.go(+1)} className='iconfont icon-you-01'></button>
      </div>
      <div className={styles['_id-search-warp']}>
        <div className={styles['_id-search']}>
          <div className={styles['search']}>
            <input className={styles['swing-in-right-bck']} onKeyDown={handleKeyDown} onInput={searchInputChange} />
            {/*搜索联想功能*/}
            {/*<div className={styles["search-result"]}>*/}
            {/*    {*/}
            {/*      songList.map(item => {*/}
            {/*        return <div className={styles["result-item"]} key={item.id}>*/}
            {/*          <div className={styles["result-info"]}>*/}
            {/*            */}
            {/*          </div>*/}
            {/*        </div>*/}
            {/*      })*/}
            {/*    }*/}
            {/*</div>*/}
          </div>
          <button className='icon iconfont icon-sousuoguanjianci'></button>
        </div>
      </div>
      <div className={styles['setting']}></div>
    </div>
  );
};
