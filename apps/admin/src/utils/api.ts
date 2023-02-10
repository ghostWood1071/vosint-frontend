import { BASE_URL } from "@/constants/config";
import { HttpStatusCode } from "@/constants/http-status";
import axios from "axios";

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

export const filterEmptyString = (params: Record<string, any>) => {
  const result: Record<string, any> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "") {
      result[key] = value;
    }
  });

  return result;
};
