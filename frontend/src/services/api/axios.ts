import axios, { AxiosError } from 'axios';

const instance = axios.create({ baseURL: process.env.API_URL, withCredentials: true });

instance.interceptors.response.use((res) => res, (err) => {
  if (err instanceof AxiosError && err.response?.status === 401) {
    // window.location.href = '/sign-in';
  }

  return Promise.reject(err);
}, { runWhen: (config) => config.url !== '/users/me' });

export default instance;
