import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HYRequestInterceptors<T = AxiosResponse> {
  //请求实例
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  //错误实例
  requestInterceptorCatch?: (error: any) => any;

  //返回实例拦截
  responseInterceptor?: (config: T) => T;
  //错误拦截
  responseInterceptorCatch?: (error: any) => any;
}

export interface HYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: HYRequestInterceptors<T>;
  showLoding?: boolean;
}