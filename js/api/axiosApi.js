import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptors: apply changes to all req and res
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Attach token to req if exists
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error

    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data; // only get data from response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log('error response', error.response);
    if (!error.response) throw new Error('Network error!!');

    if (error.response.status === 404) console.log('File not found!');

    return Promise.reject(error);
  },
);

export default axiosClient;
