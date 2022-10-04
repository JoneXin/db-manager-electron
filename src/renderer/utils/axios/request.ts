import axios, { AxiosRequestConfig, type Axios } from 'axios';
import { RequestOptions } from './model';
import { requestInterceptors, responceInterceptors } from './interceptor';
import { message as $message } from 'ant-design-vue';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:4545/api/',
  timeout: 6000,
});

// 请求拦截
requestInterceptors(axiosInstance);
// 响应拦截
responceInterceptors(axiosInstance);

/**
 *
 * @param requestConf 请求方法体
 * @param options 其他选项
 */
export const request = async <T = any>(
  requestConf: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    // 参数
    const { successMsg, errorMsg, isGetDataDirectly = true } = options;
    const res = await axiosInstance.request(requestConf);

    // message tips
    successMsg && $message.success(successMsg);
    errorMsg && $message.error(errorMsg);
    // data format
    return isGetDataDirectly ? res.data : res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};
