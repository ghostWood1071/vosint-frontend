import { apiClient } from "@/utils/api";

const getHotNewsToday = async () => {
  const result = await apiClient.get(`/dashboard/hot-news-today`);

  return result.data;
};

const getNewsCountryToday = async () => {
  const result = await apiClient.get(
    `/dashboard/news-country-today?${new URLSearchParams({
      start_day: "7",
    })}`,
  );

  return result.data;
};

const getNewsHoursToday = async () => {
  const result = await apiClient.get(`/dashboard/news-hours-today`);

  return result.data;
};

export {
  getHotNewsToday,
  getNewsCountryToday,
  getNewsHoursToday,
}
