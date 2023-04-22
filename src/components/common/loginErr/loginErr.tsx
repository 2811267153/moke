import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss"
interface PropsType {
  message: string
  height: number,
  backgroundColor?: string
}

const imgPath = [
  'src/assets/image/benhua.png',
  'src/assets/image/benhua1-1.png',
  'src/assets/image/benhua1-2.png',
  'src/assets/image/benhua1-3.png',
  'src/assets/image/benhua1-4.png',
  'src/assets/image/benhua1-5.png',
  'src/assets/image/benhua1-6.png',
  'src/assets/image/benhua1-7.png',
  'src/assets/image/benhua1-8.png',
  'src/assets/image/paimeng.png',
  'src/assets/image/paimeng1-1.png',
  'src/assets/image/paimeng1-2.png',
  'src/assets/image/paimeng1-3.png',
  'src/assets/image/paimeng1-4.png',
]
export const LoginErr: React.FC<PropsType> = ({message, height,backgroundColor}) => {
  const [index, setIndex] = useState<number>();

  useEffect(() => {
    setIndex(Math.floor(Math.random() * imgPath.length - 1) + 1)
  }, []);

  return (
    <div style={{height, backgroundColor: backgroundColor}} className={styles.err_warp}>
      {message}
      <img src={imgPath[index!]} alt='' />
    </div>
  )
}