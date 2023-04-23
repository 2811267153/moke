import React, { useEffect, useState } from 'react';
import styles from "./index.module.scss"
import { Image } from '@/components';
interface PropsType {
  message: string
  height: number,
  backgroundColor?: string
}

const imgPath = [
  'https://i.imgtg.com/2023/04/23/Ik4rM.webp',
  'https://i.imgtg.com/2023/04/23/IkPsc.webp',
  'https://i.imgtg.com/2023/04/23/Iktor.webp',
  'https://i.imgtg.com/2023/04/23/IkDGG.webp',
  'https://i.imgtg.com/2023/04/23/IkJgq.webp',
  'https://i.imgtg.com/2023/04/23/IkH31.webp',
  'https://i.imgtg.com/2023/04/23/IkEhI.webp',
  'https://i.imgtg.com/2023/04/23/IkGtD.webp',
  'https://i.imgtg.com/2023/04/23/IkQ2F.webp',
  'https://i.imgtg.com/2023/04/23/Ik0W6.webp',
  'https://i.imgtg.com/2023/04/23/IkcgP.webp',
  'https://i.imgtg.com/2023/04/23/IkdVb.webp',
  'https://i.imgtg.com/2023/04/23/IkVol.webp',
  'https://i.imgtg.com/2023/04/23/IkYrg.webp',
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