import { useEffect, useRef, useState } from 'react';
import styles from "./index.module.scss"
import * as PubSub from 'pubsub-js';


interface LyricsProps {
  lyrics: LyricItem[];
  currentTime: number;
}
type LyricItem = [number, string];

export function Lyrics({ lyrics, currentTime }: LyricsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [marginTop, setMarginTop] = useState(20);
  useEffect(() => {
    const nextIndex = lyrics.findIndex(([time]) => (time / 1000) > currentTime)
    if (nextIndex !== currentIndex && nextIndex !== -1) {
      setCurrentIndex( nextIndex -1);
    }
  }, [currentTime]);
  const handleItemClick = (time: string | number) => {
    PubSub.publish('upDataCurrentTime', time);
  }


  useEffect(() => {
    setMarginTop( -(currentIndex * 27))
  }, [currentIndex]);
  return (
    <div className={styles["lyrics"]}>
      {
        lyrics.length != 0 ? (<div style={{marginTop: marginTop}}>
          {lyrics.map((line, i) => (
            <div
              key={i}
              className={i === currentIndex ? `${styles["lyrics-item"]} ${styles['active']} `: `${styles["lyrics-item"]}`}
              onClick={() => handleItemClick(line[0])}
            >
              {line[1]}
            </div>
          ))}
        </div>) : <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>很抱歉 暂时没有找到歌词哦</div>
      }
    </div>
  );
}

