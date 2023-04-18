import hyRequest from '@/axios/axios';

enum Account {
  accountInfo = '/user/account', //获取账号信息,
  userInfo = '/user/detail',//获取用户详情,
  userSubcount = '/user/subcount', //获取用户信息 , 歌单，收藏，mv, dj 数量
  userPlaylist = '/user/playlist', //获取用户歌单
  userDetail = '/user/detail', //获取用户详情
  userBinding = "/user/binding" //获取用户绑定信息
}
export function getAccountInfo(cookie: any) {
  return hyRequest.get({
    url: `${Account.accountInfo}?cookie=${cookie}`
  });
}export function getUserInfo(cookie: any) {
  return hyRequest.get({
    url: `${Account.userInfo}?cookie=${cookie}`
  });
}

export function getUserSubcount(cookie: any) {
  return hyRequest.get({
    url: `${Account.userSubcount}?cookie=${cookie}`
  });
}
export function getUserPlaylist(cookie: any) {
  return hyRequest.get({
    url: `${Account.userPlaylist}?cookie=${cookie}`
  });
}
export function getUserDetail(cookie: any) {
  return hyRequest.get({
    url: `${Account.userDetail}?cookie=${cookie}`
  });
}
export function getUserBinding(uid: number | string, limit: number = 10, offset: number = 1) {
  return hyRequest.get({
    url: `${Account.userBinding}?uid=${uid}&limit=${limit}&offset=${offset}`
  });
}