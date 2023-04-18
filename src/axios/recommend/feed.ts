import hyRequest from '@/axios/axios';

enum Feed {
  topList = '/toplist', //获取所有榜单
  personalizedMv = '/mv/all?', //获取所有榜单
}

export function getTopList() {
  return hyRequest.get({
    url: `${Feed.topList}`
  });
}
// export function getRecommendMv() {
//   return hyRequest.get({
//     url: `${Feed.personalizedMv}`
//   });
// }

export function getRecommendMv(area: string, order: string, limit: number, offset: number) {
  return hyRequest.get({
    url: `${Feed.personalizedMv}area=${area}&order=${order}&limit=${limit}&offset=${offset}`
  });
}
