import React, { useEffect, useRef, useState } from 'react';

import styles from './Index.module.scss';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/redux/hooks';
import { setSearchKey } from '@/redux/TestRedux/slice';
import { songsSearch, updateKeyword } from '@/redux/musicDetailProduct/slice';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
      dispatch(songsSearch({ value, offset }));
      dispatch(setSearchKey(value));

      navigate(`/searchPage/:${value}`);
    }, 500)
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      dispatch(songsSearch({ value, offset }));
      dispatch(setSearchKey(value));

      navigate(`/searchPage/:${value}`);
    }
  };
  return (
    <div className={styles['header-warp']}>
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
