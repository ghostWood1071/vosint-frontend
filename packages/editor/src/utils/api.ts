import axios from "axios";

export const apiClient = axios.create({
  baseURL: `https://vosint.aiacademy.edu.vn/api`,
  // baseURL: `http://localhost:6082`,
  timeout: 1000 * 30,
  withCredentials: true,
});
