import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://strictly-for-wagon-repairs.trycloudflare.com",
  // baseURL: 'http://ec2-16-16-76-165.eu-north-1.compute.amazonaws.com',
  // baseURL: 'https://previous-restricted-leslie-possibly.trycloudflare.com/',
  // baseURL:'https://endless-proudly-country-cartridge.trycloudflare.com',
  // baseURL:'http://192.168.1.111:8080',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export default instance;
