import { BASE_URL } from "@/constants/config";
import { HttpStatusCode } from "@/constants/http-status";
import axios from "axios";
import { identity, pickBy } from "lodash";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 30,
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },

});

apiClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      (error.response.status === HttpStatusCode.unprocessableentity &&
        error?.response?.data?.detail === "Signature has expired") ||
      error.response.status === HttpStatusCode.unauthorized
    ) {
      localStorage.clear();
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
    return Promise.reject(error);
  },
);

export const filterEmptyString = (params: Record<string, any>) => {
  const result: Record<string, any> = {};

  Object.entries(pickBy(params, identity)).forEach(([key, value]) => {
    if (value !== "") {
      if (typeof value === "string") {
        result[key] = value.trim();
      } else {
        result[key] = value;
      }
    }
  });

  return result;
};
