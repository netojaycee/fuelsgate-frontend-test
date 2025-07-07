import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/v1/';

/**
 * Public HTTP client for API requests that don't require authentication.
 * Use this for public facing pages and components.
 */
const publicHttp = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

publicHttp.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});

publicHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Just reject the promise without redirecting to login
    return Promise.reject(error);
  },
);

export default publicHttp;
