import { showModal } from '../utils';
import axiosClient from './axiosApi';

const postApi = {
  getAll(params) {
    const url = '/posts';
    return axiosClient.get(url, { params });
  },

  getById(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts';
    axiosClient
      .post(url, data)
      .then((res) => {
        showModal();
        return res;
      })
      .catch((err) => {
        console.log('error', err);
      });
  },

  update(data) {
    const url = `/posts/${data.id}`;
    axiosClient
      .patch(url, data)
      .then((res) => {
        showModal();
        return res;
      })
      .catch((err) => {
        console.log('error', err);
      });
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
