import React from 'react';
import style from "./index.module.scss"

export const MenuBtn: React.FC = () => {

  const buttons = ['Button 1', 'Button 2', 'Button 3'];
  const handelMenuBtnClick =  (value: number) => {
    PubSub.publish("menuBtnMessage", value)
  }
  return (
    <div className={style["btn-warp"]}>
      {buttons.map((item, index) => {
        return <button key={index} onClick={() => handelMenuBtnClick(index)}></button>
      })}
    </div>
  )
}
