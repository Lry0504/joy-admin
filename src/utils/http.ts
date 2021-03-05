import axios, { AxiosError } from 'axios';
import BaseConfig from '@/src/config';
import store from '@/src/store';
import { message, notification } from 'antd';
import { logout } from '../store/actions/user.antion';

interface ResponseData {
  success: boolean;
  errorCode: number;
  data?: any;
  msg?: string;
  [key: string]: any
}

let exiting: boolean = false;

const CancelToken = axios.CancelToken;

const handleError = (error: AxiosError) => {
  if (!axios.isCancel(error)) {
    const response = error.response;
    notification.error({
      message: `Error code: ${response?.status ?? -1}`,
      description: response?.statusText ?? '服务器开小差了'
    })
  }
}

const HttpInstance = axios.create({
  timeout: 6000,
  baseURL: BaseConfig.http.baseUrl
})

HttpInstance.defaults.headers.common.isLoading = true;
HttpInstance.defaults.headers.common.successAlert = false;
HttpInstance.defaults.headers.common.errorAlert = true;
Object.setPrototypeOf(HttpInstance, axios);

HttpInstance.interceptors.request.use(function (config) {
  const method = config.method;
  const url = config.url;
  const userState = store.getState().userReducer.userInfo;

  // Cancel duplicate request
  window.axiosCancelTokenStore.forEach( (store, index) => {
    if (
      config.headers.cancelRequest !== false &&
      store.url === url &&
      store.method === method
    ) {
      store.cancel();
      window.axiosCancelTokenStore.splice(index, 1);
    }
  })

  config.headers.token = userState.token;
  config.cancelToken = new CancelToken( cancel => {
    window.axiosCancelTokenStore.push({
      pathname: window.location.pathname,
      method,
      url,
      cancel
    })
  })

  const data: { [keys: string]: any } = {};

  if (method === 'post' || method === 'put') {
    if (config.data instanceof FormData) {
      for (let key in data) {
        config.data.append(key, data[key]);
      }
    } else {
      config.data = Object.assign(data, config.data);
    }
  }

  return config;
}, function (error) {
  handleError(error);
  return Promise.reject(error);
})

HttpInstance.interceptors.response.use(function(response) {
  const headers = response.config.headers;
  const data: ResponseData = response.data;
  
  if (!data.success && headers.errorAlert) {
    notification.error({
      message: `错误码: ${data.errorCode ?? -1}`,
      description: data.msg ?? '服务器开小差了'
    })
  }

  if (data.success && headers.successAlert) {
    message.success(data.msg ?? 'Success');
  }

  if (data.errorCode === 401 && !exiting) {
    exiting = true;
    setTimeout(logout, 2000);
  }

  return response;
}, function(error) {
  handleError(error);
  return Promise.reject(error);
})

export default HttpInstance;