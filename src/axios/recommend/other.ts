import hyRequest from '@/axios/axios';

enum Other {
  banner = '/banner?type=2',
  hotArtist= '/toplist/artist?',
  djBanner= "/dj/banner"
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