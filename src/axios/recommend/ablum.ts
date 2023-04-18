import hyRequest from '@/axios/axios';

enum ablum {
  ablumInfo = '/playlist/detail', //获取歌单详情,
  ablumAllSongs = '/playlist/track/all',//获取歌单内所有歌曲,
  dynamicAblumDetail = '/playlist/detail/dynamic', //获取歌单详情动态
  updatePlayList = "/playlist/update/playcount", //更新歌单播放量
  ablumId='/search?type=1000'
}

export function getAblumInfo(id: number | string, cookie: any) {
  return hyRequest.get({
    url: `${ablum.ablumInfo}?id=${id}&cookie=${encodeURIComponent(cookie)}`
  });
}export function getAblumId(key: string, cookie: any) {
  return hyRequest.get({
    url: `${ablum.ablumId}&keywords=${key}&cookie=${encodeURIComponent(cookie)}`
  });
}
export function getablumAllSongs(id: number, limit: number, offset: number ) {
  return hyRequest.get({
    url: `${ablum.ablumAllSongs}?id=${id}&limit=${limit}&offset=${offset}`
  });
}
export function getdynamicAblumDetail(id: number) {
  return hyRequest.get({
    url: `${ablum.dynamicAblumDetail}?id=${id}&limit=10`
  });
}
export function updatePlayList(id: number) {
  return hyRequest.get({
    url: `${ablum.updatePlayList}?id=${id}`
  });
}