import React from 'react';
import styles from './index.module.scss';
import { Image } from '@/components';
import Color from 'color-thief-react';
interface PropsType {
  data: any[];
  type?: "artist" | ""
}

export const CommonGrid: React.FC<PropsType> = ({ data, type }) => {
  return <div className={styles.grid}>
    {data?.map(item => {
      return (
        <div style={{ position: 'relative' }}>
          <Color src={item.coverImgUrl || item.picUrl} crossOrigin='anonymous' format='hex'>
            {({ data }) => (
              <>
                <div className={styles.grid_content}>
                  <div>
                    <Image type='lazy' src={item.coverImgUrl || item.picUrl}></Image>
                  </div>
                  <p style={{ color: data }}>{item.name }</p>
                </div>
                <div className={styles.grid_mask}>
                  <i className={styles.grid_tage}>{item.updateFrequency || `${item.musicSize}首歌曲`}</i>
                  <div className={styles.grid_info_desc}>
                    {type !== "artist" && <p style={{ color: data }}>{item.description || '暂无描述'}</p>}
                    {type === "artist" && <p className={styles.gird_info_button}>
                      <button>查看Ta</button>
                      <button>喜欢</button>
                    </p>}
                  </div>
                </div>
              </>
            )}
          </Color>
        </div>
      );
    })}
  </div>;
};