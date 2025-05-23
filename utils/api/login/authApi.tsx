import hitApi from 'utils/http';
import Cookies from 'js-cookie';
import {
  AUTH_TOKEN,
  AUTH_NAME,
  AUTH_ID,
  AUTH_ROLE,
  AUTH_EMAIL
} from 'utils/constants/cookies-keys';

const loginUser = async payload => {
  const result = await hitApi().post('/login', payload);
  return result.data;
};

const logoutUser = async () => {
  try {
    const result = await hitApi().get('/logout');

    Cookies.remove(AUTH_TOKEN);
    Cookies.remove(AUTH_NAME);
    Cookies.remove(AUTH_ROLE);
    Cookies.remove(AUTH_ID);
    Cookies.remove(AUTH_EMAIL);

    return result;
  } catch (e) {
    // console.log(e.response);
  }
};

const getProfile = async payload => {
  const result = await hitApi()
    .get('/user', payload)
    .then(data => {
      Cookies.set(AUTH_NAME, data.data.name);
      Cookies.set(AUTH_ROLE, data.data.role);
      Cookies.set(AUTH_EMAIL, data.data.email);
    });
};

export { loginUser, logoutUser, getProfile };
