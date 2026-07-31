import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  // baseURL:'http://192.168.1.111:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
export default instance;
