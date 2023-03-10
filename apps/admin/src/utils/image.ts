import { BASE_URL } from "@/constants/config";

export function generateImage(url: string, prefix = "/") {
  return BASE_URL + prefix + url;
}
