import axios from "axios";
import { BASE_URL } from "@/constants/config";
import { HttpStatusCode } from "@/constants/http-status";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 30,
});

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === HttpStatusCode.unauthorized) {
      // TODO: refresh token
    }
    return Promise.reject(error);
  },
);
