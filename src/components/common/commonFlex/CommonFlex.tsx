import React from 'react';
import styles from './index.module.scss';
import {Image} from '@/components';
import { format, formatStr } from '@/utils';

interface PropsType {
  data: any[]
}
export const CommonFlex:React.FC<PropsType> = ({data}) => {

  return(
    <div className={styles.common_warp}>
      {
        data.map(item => {
          return <div className={styles.common_item}>
            <div style={{position: 'relative'}}>
              <Image src={item.cover}></Image>
              <p className={styles.timer}>
                <span><i className="icon iconfont icon-46bofang"></i>{formatStr(item.playCount)}</span>
                <span>{format(item.duration / 1000)}</span></p>
            </div>
            <p className={styles.name}>{item.name} - {item.artistName}</p>
          </div>
        })
      }
    </div>
  )
}