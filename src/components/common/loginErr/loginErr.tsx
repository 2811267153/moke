import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss"
import { Image } from '@/components';
interface PropsType {
  message: string
  height: number,
  backgroundColor?: string
}

const imgPath = [
  'https://files.catbox.moe/chan2p.png',
  'https://files.catbox.moe/cq3ylh.png',
  'https://files.catbox.moe/dpb4k3.png',
  'https://files.catbox.moe/goalu7.png',
  'https://files.catbox.moe/yr2twh.png',
  'https://files.catbox.moe/vvgwqs.png',
  'https://files.catbox.moe/tit9h6.png',
  'https://files.catbox.moe/0rwofs.png',
  'https://files.catbox.moe/w8l5so.png',
  'https://files.catbox.moe/izeetd.png',
  'https://files.catbox.moe/b6pm8u.png',
  'https://files.catbox.moe/b6pm8u.png',
]

export const LoginErr: React.FC<PropsType> = ({message, height,backgroundColor}) => {
  const [index, setIndex] = useState<number>();

  useEffect(() => {
    setIndex(Math.floor(Math.random() * imgPath.length - 1) + 1)
  }, []);

  return (
    <div style={{height, backgroundColor: backgroundColor}} className={styles.err_warp}>
      {message}
      <Image src={imgPath[index!]} alt='' height={40} width={40} />
    </div>
  )
}