let BASE_URL = 'https://service-n69e4aqo-1259570890.gz.apigw.tencentcs.com/release/';

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'https://service-n69e4aqo-1259570890.gz.apigw.tencentcs.com/release/';
} else if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://service-n69e4aqo-1259570890.gz.apigw.tencentcs.com/release/';
}

export { BASE_URL };