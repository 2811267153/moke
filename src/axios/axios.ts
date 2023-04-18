///统一的网络出口

import { BASE_URL } from './request/config';
import Request from './request/index';

const hyRequest = new Request({
  baseURL: BASE_URL,
  timeout: 15000,
  interceptors: {
    requestInterceptor: (config: any) => {
      return config;
    },
    requestInterceptorCatch(error: any) {
      return error;
    },
    responseInterceptor(response: any) {
      return response;
    },
    responseInterceptorCatch(error: any) {
      return error;
    }
  }
});

export default hyRequest;