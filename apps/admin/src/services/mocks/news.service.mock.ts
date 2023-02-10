import { BASE_URL } from "@/constants/config";
import { rest } from "msw";

import { createFixResponseHandler } from "./mock-helper";

export const MOCK_NEWS_SIDEBAR_REQUEST = [
  {
    title: "TRUNG QUOC",
    key: "1",
    children: [
      {
        title: "Khac",
        key: "0-1",
      },
    ],
  },
  {
    title: "MY",
    key: "2",
    children: [
      {
        title: "Khac",
        key: "2-1",
      },
    ],
  },
  {
    title: "CHAU A",
    key: "3",
    children: [
      {
        title: "Khac",
        key: "3-1",
      },
    ],
  },
  {
    title: "CHAU AU",
    key: "4",
    children: [
      {
        title: "Khac",
        key: "4-1",
      },
    ],
  },
  {
    title: "NHAT BAN",
    key: "5",
    children: [
      {
        title: "Khac",
        key: "5-1",
      },
    ],
  },
];

export const handlers = [
  rest.get(`${BASE_URL}/news-sidebar`, createFixResponseHandler(MOCK_NEWS_SIDEBAR_REQUEST)),
];
