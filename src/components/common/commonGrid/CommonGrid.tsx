import React from 'react';
import styles from './index.module.scss';
import { Image } from '@/components';
import Color from 'color-thief-react';
interface PropsType {
  data: any[];
  type?: "artist" | ""
  handleToAlbum?: Function
}

export const CommonGrid: React.FC<PropsType> = ({ data, type, handleToAlbum }) => {
  const handleToAlbumSongs = (item: any) => {
    // @ts-ignore
    handleToAlbum(item);
  }
  return <div className={styles.grid}>
    {data?.map(item => {
      return (
        <div style={{ position: 'relative' }} onClick={() => handleToAlbumSongs(item)}>
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
                  {type !== "artist" && <div className={styles.grid_info_desc}>
                    <p style={{ color: data }}>{item.description || '暂无描述'}</p>
                  </div>}
                </div>
              </>
            )}
          </Color>
        </div>
      );
    })}
  </div>;
};