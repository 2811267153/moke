import hyRequest from '@/axios/axios';

enum Artist {
  toplistArtist = '/toplist/artist' //歌手排行榜
}

export function getToplistArtist(type: number) {
  return hyRequest.get({
    url: `${Artist.toplistArtist}?type=${type}`
  });
}