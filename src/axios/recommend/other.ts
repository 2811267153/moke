import hyRequest from '@/axios/axios';

enum Other {
  banner = '/banner?type=2',
  hotArtist= '/toplist/artist?',
  djBanner= "/dj/banner",
  lyric= "/lyric?", //普通歌词
  lyricNew= "/lyric/new?", //逐字歌词
}
export function getBannerUrl() {
  return hyRequest.get({
    url: Other.banner
  })
}
export function getHotArtistUrl(type: number) {
  return hyRequest.get({
    url: `${Other.hotArtist}type=${type}`
  })
}
export function getDjBanner() {
  return hyRequest.get({
    url: `${Other.djBanner}`
  })
}
export function getLyric(id: string | number) {
  return hyRequest.get({
    url: `${Other.lyric}id=${id}`
  })
}
export function getNewLyric(id: string | number) {
  return hyRequest.get({
    url: `${Other.lyricNew}id=${id}`
  })
}