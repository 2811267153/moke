import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ResponseData {
  cookie: string ;
  code: number;
  data: any;
  message: string;
}

class Axios {
  private axiosInstance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.axiosInstance = axios.create(config);
    this.initInterceptors();
  }

  private initInterceptors = () => {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Do something before sending the request
        return config;
      },
      (error) => {
        // Do something with the request error
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Do something with the response data
        return response.data;
      },
      (error) => {
        // Do something with the response error
        return Promise.reject(error);
      }
    );
  };

  public get = (url: string, config?: AxiosRequestConfig): Promise<ResponseData> => {
    return this.axiosInstance.get(url, config);
  };

  public post = (url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData> => {
    return this.axiosInstance.post(url, data, config);
  };

  public put = (url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseData> => {
    return this.axiosInstance.put(url, data, config);
  };

  public delete = (url: string, config?: AxiosRequestConfig): Promise<ResponseData> => {
    return this.axiosInstance.delete(url, config);
  };
}

export default new Axios({
  baseURL: 'https://service-n69e4aqo-1259570890.gz.apigw.tencentcs.com/release/',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});