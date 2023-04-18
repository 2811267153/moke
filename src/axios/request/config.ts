let BASE_URL = 'https://netease-cloud-music-api-ecru-nu.vercel.app/';

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'https://netease-cloud-music-api-ecru-nu.vercel.app/';
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://netease-cloud-music-api-ecru-nu.vercel.app/';
}

export { BASE_URL };