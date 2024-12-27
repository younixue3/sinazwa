import axios from 'axios';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import {
  AUTH_TOKEN,
  AUTH_ID,
  AUTH_ROLE,
  AUTH_NAME
} from 'utils/constants/cookies-keys';

const hitApi = (version = 'v1') => {
  const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    paramsSerializer: params => {
      /**
       * Secara default array akan di-serialize menjadi array[]=1&array[]=2 dst.
       * dengan `queryString.stringify` kita bisa mengubahnya menjadi array=1&array=2 dst.
       */
      return queryString.stringify(params);
    }
  });

  instance.interceptors.request.use(config => {
    const token = Cookies.get(AUTH_TOKEN);
    if (!!token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  instance.interceptors.response.use(
    response => {
      return Promise.resolve(response);
    },
    err => {
      if (err.response.status === 401) {
        Cookies.remove(AUTH_NAME);
        Cookies.remove(AUTH_ROLE);
        Cookies.remove(AUTH_ID);
        Cookies.remove(AUTH_TOKEN);

        // if (window.location.pathname !== '/') {
        //   window.location.href = '/';
        // }
      }

      return Promise.reject(err);
    }
  );

  return instance;
};

export default hitApi;
