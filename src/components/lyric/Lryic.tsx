import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from "./index.module.scss"
import { animate } from '@/utils';
interface LyricsProps {
  lyrics: LyricItem[];
  currentTime: number;
}
type LyricItem = [number, string];
export function Lyrics({ lyrics, currentTime }: LyricsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [marginTop, setMarginTop] = useState(20);
  const [lineHeight, setLineHeight] = useState(0);
  const lyricRef = useRef<HTMLDivElement>(null)
  const ContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ContainerRef.current) {
      const { height } = ContainerRef.current.getBoundingClientRect();
      const { length } = lyrics;
      const lineHeight = height / length;
      setLineHeight(lineHeight);
    }
  }, [lyrics]);

  useEffect(() => {
    const nextIndex = lyrics.findIndex(([time]) => (time / 1000) > currentTime);
    if (nextIndex !== currentIndex && nextIndex !== -1) {
      setCurrentIndex(nextIndex - 1);
    }
  }, [currentTime]);

  useEffect(() => {
    setMarginTop(-(currentIndex * lineHeight));
  }, [currentIndex, lineHeight]);


  const handleItemClick = (time: string | number) => {
    PubSub.publish("UpDataTime", time)
  }
  return (
    <div className={styles["lyrics"]}>
      {
        lyrics.length != 0 ? (<div ref={ContainerRef}  style={{ marginTop }} className={styles.lyrics_container}>
          {lyrics.map((line, i) => (
            <div
              key={i}
              ref={lyricRef}
              className={i === currentIndex ? `${styles["lyrics-item"]} ${styles['active']} `: `${styles["lyrics-item"]}`}
              onClick={() => handleItemClick(line[0])}
            >
              {line[1]}
            </div>
          ))}
        </div>) : <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>null</div>
      }
    </div>
  );
}

