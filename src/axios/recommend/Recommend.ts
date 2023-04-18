import hyRequest from '@/axios/axios';
import { recommendAlbumListState } from '@/redux/recommendPlayList/slice';

enum Recommend {
  recommendSongsList = '/recommend/songs?cookie=', //推荐歌曲列表
  recommendNewPlayList = '/top/album?area=', //新碟上架
  recommendAlbumLis = '/personalized', //推荐歌单
  recommendUserList = '/simi/playlist?',  //推荐五位听过该歌曲的用户
  recommendDiscover = "/homepage/block/page?"
}

export function getRecommendSongsList(cookie: any) {
  return hyRequest.get({
    url: Recommend.recommendSongsList + encodeURIComponent(cookie)
  });
}
export function getRecommendNewPlayList(area: string) {
  return hyRequest.get({
    url: Recommend.recommendNewPlayList + encodeURIComponent(area)
  });
}
export function getRecommendAlbumList() {
  return hyRequest.get({
    url: Recommend.recommendAlbumLis
  });
}
export function getrecommendUserList(id: string | number, cookie: string) {
  return hyRequest.get({
    url: `${Recommend.recommendUserList}id=${id}&cookie=${cookie}`
  });
}
export function getRecommendDiscover( cookie: string) {
  return hyRequest.get({
    url: `${Recommend.recommendDiscover}cookie=${encodeURIComponent(cookie)}&refresh=false&timestamp=${Date.now()}`
  });
}