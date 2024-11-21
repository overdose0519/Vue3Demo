import axios from 'axios';
import QS from 'qs';
import {
  ElMessage
} from 'element-plus';
// import store from '../store'
// import router from '../router'

// axios.defaults.baseURL = process.env.BASE_URL;
// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    console.log('config', config);
    if (config.url.startsWith('http://') || config.url.startsWith('/_default')) {
      if (config.method === 'put') {
        config.headers.post['Content-Type'] = 'multipart/form-data';
        config.timeout = 5 * 60000; // 5分钟 超时
      }
      config.baseURL = '';
      // if (config.url.startsWith("/_default")) {
      //     config.url = config.url.substr(1);
      // }
    } else if (config.url === '/static/static/element-ui.css' || config.url === '/static/mode') {
      config.baseURL = '';
      config.params = '';
    } else if (config.url === 'upload') {
      config.headers.post['Content-Type'] = 'multipart/form-data';
    }
    // console.log(config);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // console.log("response",response);
    if (response.config.url === '/static/mode') {
      return Promise.resolve(response);
    }
    if (response.config.baseURL === '') {
      // WebDav
      return Promise.resolve(response);
    }
    if (response.status === 200) {
      // console.log(response, response.config.url);
      if (response.config.url.lastIndexOf('/static/static/element-ui.css') >= 0) {
        return Promise.resolve(response);
      } else if (response.data.code === 0 || response.data.infocode === '10000') {
        // console.log("response", response,response.config);
        if (response.config.method === 'post' && (response.config.params === undefined || response.config.params.showmsg === undefined) && !response.data.data) {
          ElMessage.success({
            message: this.$root.$t('message.code_' + response.data.code),
            duration: 2000
          });
        }
        return Promise.resolve(response);
      } else {
        console.log('api error', response, this.$root);
        // if (response.config.params.showmsg === undefined) {
        ElMessage.error({
          message: this.$root.$t('message.code_' + response.data.code),
          duration: 2000
        });
        // }
        if (response.data.code === 1) {
          // store.commit('setToken', '');
          // store.commit('setUser', {});
          // router.push('/login');
        }
      }
      return Promise.reject(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.config.url === '/static/mode' || error.config.url.startsWith('/static/midis/')) {
      // console.log("mode error");
      return Promise.reject(error.response);
    }
    let errData;
    if (error.response) {
      errData = error.response.statusText;
    } else {
      errData = error.message;
    }
    // switch (error.response.status) {
    //     case 400:
    //         errData = "错误请求";
    //         break;
    //     case 401:
    //         errData = "未授权";
    //         break;
    //     case 403:
    //         errData = "禁止";
    //         break;
    //     case 404:
    //         errData = "未找到";
    //         break;
    //     case 405:
    //         errData = "方法禁用";
    //         break;
    //     case 406:
    //         errData = "不接受";
    //         break;
    //     case 407:
    //         errData = "需要代理授权";
    //         break;
    //     case 408:
    //         errData = "请求超时";
    //         break;
    //     case 409:
    //         errData = "冲突";
    //         break;
    //     case 410:
    //         errData = "已删除";
    //         break;
    //     case 411:
    //         errData = "需要有效长度";
    //         break;
    //     case 412:
    //         errData = "未满足前提条件";
    //         break;
    //     case 413:
    //         errData = "请求实体过大";
    //         break;
    //     case 414:
    //         errData = "请求的 URI 过长";
    //         break;
    //     case 415:
    //         errData = "不支持的媒体类型";
    //         break;
    //     case 416:
    //         errData = "请求范围不符合要求";
    //         break;
    //     case 417:
    //         errData = "未满足期望值";
    //         break;
    //     case 500:
    //         errData = "服务器内部错误";
    //         break;
    //     case 501:
    //         errData = "尚未实施";
    //         break;
    //     case 502:
    //         errData = "错误网关";
    //         break;
    //     case 503:
    //         errData = "服务不可用";
    //         break;
    //     case 504:
    //         errData = "网关超时";
    //         break;
    //     case 505:
    //         errData = "HTTP 版本不受支持";
    //         break;
    //     default:
    //         errData = "未知错误";
    //         break;
    // };

    ElMessage.error({
      message: errData,
      duration: 2000
    });
    return Promise.reject(error.response
      ? error.response
      : {
          data: errData
        });
  }
);
const makeParamToken = (params) => {
  // console.log("makeParamToken", store.getters.getToken);
  if (params === undefined) {
    // params = {
    //   token: store.getters.getToken
    // }
  } else {
    if (!params.hasOwnProperty('token')) {
      // params.token = store.getters.getToken;
    }
  }
  return params;
};
const getNeedResult = (params) => {
  if (params === undefined) {
    return false;
  }
  if (params.needResult === undefined) {
    return false;
  }
  return params.needResult;
};
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @return {Promise} Promise resolved when
 */
export function get(url, params) {
  const needResult = getNeedResult(params);

  params = makeParamToken(params);
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        if (needResult) {
          reject(err ? err.data : '');
        }
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @return {Promise} Promise resolved when
 */
export function post(url, params) {
  const needResult = getNeedResult(params);

  if (url !== 'upload') {
    params = QS.stringify(makeParamToken(params));
  }
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        // console.log("post", err);
        if (needResult) {
          reject(err ? err.data : '');
        }
        // else{
        //     reject(err ? err.data : '')
        // }
      });
  });
}

// WebDav
function WebDav_Http(method, url, token, params, process, dst) {
  return new Promise((resolve, reject) => {
    const p = {
      method,
      url,
      headers: {
        // Content-Type: 'multipart/form-data',
        Authorization: 'Bearer ' + token
      },
      onUploadProgress: process,
      data: params
    };
    if (dst) {
      p.headers.Destination = dst;
    }
    axios(p)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err ? err.data : '');
      });
  });
}

export function getex(url, token, params) {
  return WebDav_Http('get', url, token, params);
}

export function postex(url, token, params) {
  params = QS.stringify(params);
  return WebDav_Http('post', url, token, params);
}

export function del(url, token, params) {
  return WebDav_Http('delete', url, token, params);
}

export function mkcol(url, token, params) {
  return WebDav_Http('mkcol', url, token, params);
}

export function put(url, token, params, process) {
  return WebDav_Http('put', url, token, params, process);
}

export function copy(url, token, params, process, dst) {
  return WebDav_Http('copy', url, token, params, process, dst);
}

export function move(url, token, params, process, dst) {
  return WebDav_Http('move', url, token, params, process, dst);
}
