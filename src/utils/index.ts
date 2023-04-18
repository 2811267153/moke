import * as assert from 'assert';
import { retry } from '@reduxjs/toolkit/query';

export function throttle(this: any, func: any, limit: number) {
  let lastFunc: any;
  let lastRan: number;
  return () => {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}


export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
}



export function format(time: any) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
export function parseLyric(text: string): Array<[number, string]> {
  //先按行分割
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g;
  let match: RegExpExecArray | null;
  const result: [number, string][] = [];
  while ((match = regex.exec(text))) {
    const [, minutes, seconds, milliseconds, text] = match;
    const time =
      parseInt(minutes, 10) * 60 * 1000 +
      parseInt(seconds, 10) * 1000 +
      parseInt(milliseconds, 10);
    result.push([time, text]);
  }
  return result;
}
export function getDateNow(time: number ) {
  const now = new Date().getTime();
  const diff = now - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '一分钟内';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}分钟前`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}小时前`;
  } else {
    const days = Math.floor(diff / day);
    return `${days}天前`;
  }
}

export function formatTimeDate(timestamp = +new Date()) {
  if (timestamp) {
   const time = new Date(timestamp);
   const y = time.getFullYear();
   const M = time.getMonth() + 1;
   const d = time.getDate();
    return y + '-' + addZero(M) + '-' + addZero(d) + ' '
  } else {
    return '';
  }
}
function addZero(m: any) {
  return m < 10 ? '0' + m : m;
}

export function formatStr(str: number) {
  return str < 10000 ? str : (str / 10000).toFixed(1) + " 万";
}

export function copyWritableProperties(source: any, target: any) {
  Object.keys(source).forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    if (descriptor?.writable) {
      target[key] = source[key];
    }
  });
}

export function deepClone(obj: any) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let clone = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    // @ts-ignore
    clone[key] = deepClone(obj[key]);
  }

  return clone;
}

interface Replacements {
  [key: string]: string;
}


export function formatTimestamp(timestamp: number, format: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  const replacements: Replacements  = {
    'YYYY': year,
    'MM': month,
    'DD': day,
    'HH': hours,
    'mm': minutes,
    'ss': seconds,
    'SSS': milliseconds
  };

  let formatted = format;
  for (const key in replacements) {
    if (replacements.hasOwnProperty(key)) {
      formatted = formatted.replace(key, replacements[key]);
    }
  }

  return formatted;
}

// 判断元素是否在可视区域内的函数
export function isInViewport(element: HTMLElement) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function animate(obj: any,target: number,callback?: Function){

  clearInterval(obj.timer)  //每次调用前先清除定时器 防止在未调用间隔定义多个定时器
  //但是当它为正的时候 不能带有小数 应该向上取整 10 9 8 7 6
  //但是为 负数的时候应该向下取整 -10 -8 -7 -> 0
  return obj.timer = setInterval(function () {

    let step = (target-obj.offsetLeft)/10
    step = step > 0?Math.ceil(step):Math.floor(step);

    if(obj.offsetLeft == target){  //函数完成 清除定时器 回调函数
      clearInterval(obj.timer);
      callback&&callback();  //回调函数存在即调用
    }
    obj.style.left = obj.offsetLeft+step+'px'
    // return obj.offsetLeft+step
  },20)

}