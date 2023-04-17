import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import cookie from 'cookie'
import { deCrypto } from './crypt';

const instance: AxiosInstance = axios.create({
  timeout: 10000,
  headers: { 'X-Custom-Header': 'foobar' }
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，比如加入token
    const cookies = cookie.parse(config.headers.cookie || ''); // 从请求头的 cookie 字段中解析出 cookie
    const key = cookies.chatKey || ''; // 获取 key

    if (key) {
      const openaiKey = deCrypto(key);
      config.headers['Authorization'] = `Bearer ${openaiKey}`;
    }
    config.headers['Content-type'] = `application/json`;

    return config;
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做些什么，只返回有用的响应数据
    return response.data;
  },
  (error: any) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default instance;
