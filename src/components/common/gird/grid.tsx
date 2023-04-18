import React from 'react';
import styles from '@/page/recommendPage/index.module.scss';
import Color from 'color-thief-react';



interface PropsTypes {
  handleToAlbum: Function;
  imgUrl: string[];
  resource: any;
  index: number;
  show?: string;
}

export const Grid: React.FC<PropsTypes> = ({ handleToAlbum, imgUrl, resource, index, show = '3px 5px 15px 1px ' }) => {
  return (
    <>
      <div onClick={() => handleToAlbum(resource.uiElement,resource)} className={styles.recommend_info_item}>
        <Color src={imgUrl[index]} crossOrigin='anonymous' format='rgbString'>
          {({ data }) => (
            <div className={styles.album_item_warp}>
              <img
                src={resource && resource.uiElement && resource.uiElement.image && resource.uiElement.image.imageUrl || resource.coverImgUrl}
                alt='' style={{ boxShadow: `${show} ${data}` }} />
              <p style={{ fontSize: 14 }}>{resource?.uiElement?.mainTitle?.title || resource.name}</p>
              <div className={styles.album_item_tage}>
                {
                  resource.resourceType === 'song' && <span style={{
                    backgroundColor: `rgba(255, 255, 255, 0.25)`,
                    color: data,
                    backdropFilter: 'blur( 50px )'
                  }}>歌曲</span>
                }
                {
                  resource.resourceType === 'album' && <span style={{
                    backgroundColor: `rgba(255, 255, 255, 0.25)`,
                    color: data,
                    backdropFilter: 'blur( 50px )'
                  }}>专辑</span>
                }
                {
                  resource.resourceType === 'digitalAlbum' && <span style={{
                    backgroundColor: `rgba(255, 255, 255, 0.25)`,
                    color: data,
                    backdropFilter: 'blur( 50px )'
                  }}>数字专辑</span>
                }
                {
                  resource.updateFrequency && <span style={{
                    backgroundColor: `rgba(255, 255, 255, 0.25)`,
                    color: data,
                    backdropFilter: 'blur( 50px )'
                  }}>{ resource.updateFrequency }</span>
                }
              </div>
              <div className={styles.album_item} style={{
                backgroundColor: `rgba(255, 255, 255, 0.25)`,
                color: data,
                backdropFilter: 'blur( 50px )'
              }}>
                <i className='icon iconfont icon-bofang'></i>
                <div className={styles.album_item_tags_warp}>
                  {resource?.uiElement?.labelTexts && resource?.uiElement?.labelTexts.map((item: string, index: number) => {
                    if (index <= 2) {
                      return <span style={{ border: `1px solid ${data}` }}>{item}</span>;
                    }
                  })}
                </div>
                {resource?.resourceExtInfo && <p>{resource?.resourceExtInfo?.songData?.alias[0]}</p>}
                {resource?.resourceExtInfo?.artists && <p>{resource?.resourceExtInfo?.artists[0].name}</p>}
                {resource?.uiElement?.subTitle && <p>{resource?.uiElement?.subTitle.title}</p>}
                {resource?.creativeType && <p>{resource?.uiElement?.mainTitle?.title}</p>}
              </div>
            </div>
          )}
        </Color>
      </div>
    </>
  );
};