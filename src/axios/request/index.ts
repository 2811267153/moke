import axios, { AxiosInstance } from 'axios';
import { HYRequestInterceptors, HYRequestConfig } from './type';

const DEFAULT_LODING = true;

class Request {
  instance: AxiosInstance;
  interceptors?: HYRequestInterceptors;
  loading?: any;
  showLoding?: boolean;

  constructor(config: { baseURL: string; timeout: number; interceptors: { responseInterceptor(response: any): any; requestInterceptorCatch(error: any): any; responseInterceptorCatch(error: any): any; requestInterceptor: (config: any) => void } }) {
    this.instance = axios.create(config);

    //单个实例的拦截器
    this.instance.interceptors.request.use(
      // this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    //全局拦截器
    this.instance.interceptors.request.use(
      (config) => {

        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        const data = res.data;
        this.loading?.close();
        if (data.returnCode === '-1001') {
          console.log('请求出错， 请重试');
        } else {
          return data;
        }
      },
      (err) => {
        this.loading?.close();
        return err;
      }
    );
  }

  request<T = any>(config: HYRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }
      if (!config.showLoding) {
        this.showLoding = config.showLoding && true;
      }

      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          this.showLoding = DEFAULT_LODING;
          resolve(res);
        })
        .catch((e) => {
          this.showLoding = DEFAULT_LODING;
          reject(e);
          return e;
        });
    });
  }

  get<T = any>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'get',
      withCredentials: true});
  }
  post<T = any>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'post' });
  }
  delete<T = any>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'delete' });
  }
  put<T = any>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'put' });
  }
  patch<T = any>(config: HYRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'patch' });
  }
}

export default Request;