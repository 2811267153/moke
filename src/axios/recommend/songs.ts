import hyRequest from '@/axios/axios';

enum Songs {
  songsDetail = '/song/detail', //获取歌曲详情
  songsCheckState = '/check/music?', //获取歌曲状态
  songsUrls = '/song/url/v1?', //获取歌曲url
  songsSearch = '/search?', //获取搜索歌曲<简单版>
  songsSearch_c = '/cloudsearch?' //获取搜索歌曲<完整版>
}

export function getSongsInfo(id: number | string) {
  return hyRequest.get({
    url: `${Songs.songsDetail}?ids=${id}`
  });
}

export function getSongsCheckState(id: number, br = 999000) {
  return hyRequest.get({
    url: `${Songs.songsCheckState}id=${id}&br=${br}`
  });
}

export function getSongsUrl(id: string | number, level?: string | undefined, cookie?: string) {
  return hyRequest.get({
    url: `${Songs.songsUrls}id=${id}&level=${level}&cookie=${cookie}`
  });
}

export function getSongsSearch(keywords: any, offset: number, limit = 30) {
  return hyRequest.get({
    url: `${Songs.songsSearch}keywords=${keywords}&offset=${offset}&limit=${limit}`
  });
}

export function getSongsSearch_c(keywords: any, offset: number, limit: number = 30, actionCode = 1056402) {
  return hyRequest.get({
    url: `${Songs.songsSearch_c}keywords=${keywords}&offset=${offset}&limit=${limit}&actionCode=1056402`
  });
}