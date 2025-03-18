import { KEYS } from '@utils/constant';

const LocalStorage = {
  get: (key) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }

    return false;
  },

  getJSON: (key) => {
    if (typeof localStorage !== 'undefined') {
      const data = LocalStorage.get(key);

      return data && data !== 'undefined' ? JSON.parse(data) : '';
    }

    return false;
  },

  set: (...rest) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.setItem(...rest);
    }

    return false;
  },

  setJSON: (key, value) => {
    if (typeof localStorage !== 'undefined') {
      const data = JSON.stringify(value);

      return LocalStorage.set(key, data);
    }

    return false;
  },

  setToken: (token) => {
    LocalStorage.set(KEYS.AUTH_TOKEN, token);
  },

  setUser: (user) => {
    LocalStorage.set(KEYS.USER, JSON.stringify(user));
  },

  remove: (key) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.removeItem(key);
    }

    return false;
  },

  clean: (key) => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.clear(key);
    }

    return false;
  },
};

const getUserId = async () => {
  // checking if localStorage exits in case we're using ssr
  if (typeof localStorage !== 'undefined') {
    return LocalStorage.get(KEYS.REGISTER_ID);
  }

  return {};
};

const getToken = () => {
  // checking if localStorage exits in case we're using ssr
  if (typeof localStorage !== 'undefined') {
    return LocalStorage.get(KEYS.AUTH_TOKEN) || '';
  }

  return '';
};

const getUser = async () => {
  // checking if localStorage exits in case we're using ssr
  if (typeof localStorage !== 'undefined') {
    const encryptedUser = LocalStorage.get(KEYS.USER_DATA);
    return JSON.parse(encryptedUser);
  }

  return {};
};

const getSessionUser = () => {
  if (typeof sessionStorage !== 'undefined') {
    const encryptedUser = sessionStorage[KEYS.USER];

    return JSON.parse(encryptedUser);
  }

  return {};
};

export { LocalStorage, getUser, getToken, getSessionUser, getUserId };
