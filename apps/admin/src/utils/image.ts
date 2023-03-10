import { BASE_URL } from "@/constants/config";

export function generateImage(url: string, prefix = "/v2/") {
  return BASE_URL + prefix + url;
}
