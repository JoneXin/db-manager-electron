import { Axios } from 'axios';
import { UNKNOWN_ERROR } from '../../utils/constant';
import { message as $message } from 'ant-design-vue';

// 请求拦截
export const requestInterceptors = (axiosInstance: Axios) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      //各种校验
      return config; //
    },
    (error) => {
      Promise.reject(error);
    },
  );
};

// 响应拦截
export const responceInterceptors = (axiosInstance: Axios) => {
  axiosInstance.interceptors.response.use(
    ({ data: res }) => {
      if (res.code == 400) {
        $message.error(res.data.message, 10);
      }
      // 统一错误校验
      if (res.code !== 200) {
        // 其他错误校验
        // ...
        // throw other
        const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any };
        error.code = res.code;
        return Promise.reject(error);
      }

      return res;
    },
    (error) => {
      const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
      $message.error(errMsg);
      error.message = errMsg;
      return Promise.reject(error);
    },
  );
};
