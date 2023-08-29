import { BASE_URL, BASE_URL_SUM } from "@/constants/config";
import { ISummaryDTO } from "@/models/summary.type";
import { apiClient } from "@/utils/api";

// const getNewsSummary = async ({ k, ...data }: INewsSummaryDTO) => {
//   const query = new URLSearchParams({ k });

//   return apiClient
//     .post(`${BASE_URL_SUM}/summary/?${query.toString()}`, data)
//     .then((res) => res.data);
// };

const getSummary = async (data: ISummaryDTO) => {
  const result = apiClient.post(`${BASE_URL}/nlp/summarize`, data).then((res) => res.data);

  return result;
};

export { getSummary };
