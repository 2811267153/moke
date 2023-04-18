import React from 'react';
import styles from '@/page/recommendPage/index.module.scss';
import { Image } from '@/components';

interface PropsTypes {
  handelChangeSongs: Function,
  uiElement: any
  resourceExtInfo: any
  resources: any
}

export const FlexCol: React.FC<PropsTypes> = ({handelChangeSongs, uiElement, resourceExtInfo, resources}) => {
  return(
    <div className={styles.recommend_flex_c} onClick={() => handelChangeSongs(resourceExtInfo.songData, uiElement)}>
      <Image src={uiElement.image.imageUrl} style={{width: 50, height: 50, borderRadius: 10}} key={resources.resourceId} />
      <div className={styles.recommend_artist}>
        <p>{uiElement.mainTitle.title}</p>
        <p className={styles.artist_text}>
          {
              resourceExtInfo?.songData?.artists?.map((artist: any) => {
              return <span>{artist.name}</span>
            })
          }
        </p>
        {uiElement?.subTitle?.title?.length != 0 && uiElement?.subTitle?.title?.length < 8 && true &&<div className={styles.recommend_tage}>
          <i>{uiElement?.subTitle?.title || uiElement?.reason}</i>
        </div>}
      </div>
    </div>
  )
}