import React from "react";

import { BodySocialPage } from "../components/body-social-page";

const postData = [
  {
    id: "p019",
    name_user: "Nguyen van A",
    content: "Singapore mở cửa sau 2 năm vì COVID-19.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    image_url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 3,
    numberOfLike: 13,
    numberOfShare: 10,
  },
];

const statisticData = {
  lineChartData: [
    { name: "Like", day: "20/10/2022", value: 0 },
    { name: "Like", day: "21/10/2022", value: 50 },
    { name: "Like", day: "22/10/2022", value: 25 },
    { name: "Like", day: "23/10/2022", value: 25 },
    { name: "Like", day: "24/10/2022", value: 60 },
    { name: "Like", day: "25/10/2022", value: 29 },
    { name: "Like", day: "26/10/2022", value: 35 },
    { name: "Share", day: "20/10/2022", value: 10 },
    { name: "Share", day: "21/10/2022", value: 90 },
    { name: "Share", day: "22/10/2022", value: 20 },
    { name: "Share", day: "23/10/2022", value: 360 },
    { name: "Share", day: "24/10/2022", value: 80 },
    { name: "Share", day: "25/10/2022", value: 60 },
    { name: "Share", day: "26/10/2022", value: 20 },
    { name: "Comments", day: "20/10/2022", value: 35 },
    { name: "Comments", day: "21/10/2022", value: 60 },
    { name: "Comments", day: "22/10/2022", value: 10 },
    { name: "Comments", day: "23/10/2022", value: 50 },
    { name: "Comments", day: "24/10/2022", value: 80 },
    { name: "Comments", day: "25/10/2022", value: 60 },
    { name: "Comments", day: "26/10/2022", value: 25 },
    { name: "Tương tác", day: "20/10/2022", value: 350 },
    { name: "Tương tác", day: "21/10/2022", value: 600 },
    { name: "Tương tác", day: "22/10/2022", value: 100 },
    { name: "Tương tác", day: "23/10/2022", value: 500 },
    { name: "Tương tác", day: "24/10/2022", value: 800 },
    { name: "Tương tác", day: "25/10/2022", value: 600 },
    { name: "Tương tác", day: "26/10/2022", value: 250 },
  ],
  partner: [
    {
      id: "F01",
      type: "top1",
      fullName: "Nguyen Van B",
    },
    {
      id: "F02",
      type: "top2",
      fullName: "Nguyen Van C",
    },
    {
      id: "F03",
      type: "top3",
      fullName: "Nguyen Van D",
    },
    {
      id: "F04",
      type: "no",
      fullName: "Nguyen Van E",
    },
    {
      id: "F05",
      type: "no",
      fullName: "Nguyen Van F",
    },
    {
      id: "F06",
      type: "no",
      fullName: "Nguyen Van G",
    },
    {
      id: "F07",
      type: "no",
      fullName: "Nguyen Van H",
    },
    {
      id: "F08",
      type: "no",
      fullName: "Nguyen Van I",
    },
    {
      id: "F09",
      type: "no",
      fullName: "Nguyen Van K",
    },
    {
      id: "F10",
      type: "no",
      fullName: "Nguyen Van L",
    },
  ],
};
export const Facebook = () => {
  return <BodySocialPage type={"facebook"} statisticData={statisticData} />;
};
