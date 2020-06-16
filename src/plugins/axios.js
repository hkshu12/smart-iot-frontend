/* eslint-disable */
import Vue from 'vue';
import axios from 'axios';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: 'http://101.37.80.37:8081',
  timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (config) =>
    // Do something before request is sent
    config,
  (error) => {
    // Do something with request error
    Vue.prototype.$message.error('响应出错', 3);
    console.error(error);
    return Promise.reject(error);
  },
);

// Add a response interceptor
_axios.interceptors.response.use(
  (response) =>
    // Do something with response data
    response.data,
  (error) => {
    // Do something with response error
    Vue.prototype.$message.error('请求出错', 3);
    console.error(error);
    return Promise.reject(error);
  },

);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
