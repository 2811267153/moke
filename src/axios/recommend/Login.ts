import hyRequest from '@/axios/axios';

enum Login {
  unikey = '/login/qr/key?timestamp=', //推荐歌曲列表
  qrImage = '/login/qr/create', //二维码地址
  loginState = `/login/status?timestamp=`, //登陆状态
  checkStatus = '/login/qr/check',
  loginData = "/login/status"
}

export function getLoginUnikey() {
  return hyRequest.get({
    url: Login.unikey + Date.now()
  });
}
export function getLoginQrImage(key: string, time: string | number) {
  return hyRequest.get({
    url: `${Login.qrImage}?key=${key}&qrimg=true&timestamp=${time}`
  });
}
export function getLoginState() {
  return hyRequest.get({
    url: Login.loginState + Date.now()
  });
}
export function getLoginCheckStates(key: string, time: string | number) {
  return hyRequest.get({
    url: Login.checkStatus + Date.now()
  });
}
export function getLoginStateData(cookie: string) {
  return hyRequest.get({
    url: `${Login.loginData}?cookie=${cookie}`
  });
}