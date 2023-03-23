import React from "react";

import { BodySocialPage } from "../components/body-social-page";

const postData = [
  {
    id: "p001",
    name_user: "Nguyen van A",
    content:
      "Thành phố Odessa là hải cảng quan trọng nhất của Ukraine. Nằm bên bờ Biển Đen và chỉ cách biên giới Moldova khoảng 35km, thành phố này có vị trí chiến lược trong không chỉ thế trận phòng thủ mà còn với toàn bộ nền kinh tế Ukraine. Đây là con đường xuất khẩu chủ lực của nông sản và hàng hóa Ukraine ra thị trường quốc tế.Trước đó, thành phố này đã liên tục trở thành mục tiêu tập kích của các tên lửa được phóng từ Biển Đen cùng UAV cảm tử của Nga. Vào cuối tháng 12/2022 và đầu tháng 2/2023, hạ tầng năng lượng tại Odessa đã gần như bị đánh sập sau một vụ tập kích quy mô lớn của quân đội Nga.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    image_url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 3,
    numberOfLike: 13,
    numberOfShare: 10,
  },
  {
    id: "p002",
    name_user: "Nguyen van A",
    title: "Bai viet so hai",
    content:
      "Tối 21/3 theo giờ địa phương, các tiếng nổ dữ dội đã được ghi nhận tại khu vực thành phố cảng Odessa của Ukraine. Vào khoảng 7 rưỡi tối, còi báo động đã vang khắp thành phố miền Nam này.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p003",
    name_user: "Nguyen van A",
    content:
      "Nhà chức trách Ukraine sau đó lên tiếng cáo buộc quân đội Nga đã tiến hành một vụ tập kích tên lửa vào Odessa. Theo đó, ít nhất 4 tên lửa hành trình đã đánh trúng các mục tiêu tại thành phố này.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p004",
    name_user: "Nguyen van A",
    content:
      '"Một tòa nhà 3 tầng trong khuôn viên của một tu viện đã bị phá hỏng, ít nhất 3 người bị thương", ông Andriy Yermak, người đứng đầu Văn phòng Tổng thống Ukraine xác nhận trên trang Telegram cá nhân',
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p005",
    name_user: "Nguyen van A",
    content:
      '"Một tòa nhà 3 tầng trong khuôn viên của một tu viện đã bị phá hỏng, ít nhất 3 người bị thương", ông Andriy Yermak, người đứng đầu Văn phòng Tổng thống Ukraine xác nhận trên trang Telegram cá nhân',
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p006",
    name_user: "Nguyen van A",
    content:
      '"Một tòa nhà 3 tầng trong khuôn viên của một tu viện đã bị phá hỏng, ít nhất 3 người bị thương", ông Andriy Yermak, người đứng đầu Văn phòng Tổng thống Ukraine xác nhận trên trang Telegram cá nhân',
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p007",
    name_user: "Nguyen van A",
    content:
      '"Một tòa nhà 3 tầng trong khuôn viên của một tu viện đã bị phá hỏng, ít nhất 3 người bị thương", ông Andriy Yermak, người đứng đầu Văn phòng Tổng thống Ukraine xác nhận trên trang Telegram cá nhân',
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p008",
    name_user: "Nguyen van Awe",
    content:
      "Không quân Ukraine tuyên bố đã bắn hạ ít nhất 2 tên lửa Kh-59 được phóng đi từ các tiêm kích Su-35 của Nga",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p009",
    name_user: "Nguyen van A ewr",
    content: "Singapore mở cửa sau 2 năm vì COVID-19.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    image_url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 3,
    numberOfLike: 13,
    numberOfShare: 10,
  },
  {
    id: "p010",
    name_user: "Nguyen van Ar wer wer fdsfs dfs",
    title: "Bai viet so hai",
    content:
      "Không quân Ukraine tuyên bố đã bắn hạ ít nhất 2 tên lửa Kh-59 được phóng đi từ các tiêm kích Su-35 của Nga",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p011",
    name_user: "Nguyen van Awer",
    content: "Singapore mở cửa sau 2 năm vì COVID-19.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    image_url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 3,
    numberOfLike: 13,
    numberOfShare: 10,
  },
  {
    id: "p012",
    name_user: "Nguyen van A",
    title: "Bai viet so hai",
    content:
      "Không quân Ukraine tuyên bố đã bắn hạ ít nhất 2 tên lửa Kh-59 được phóng đi từ các tiêm kích Su-35 của Nga",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p013",
    name_user: "Nguyen van Awer wer",
    content:
      "Không quân Ukraine tuyên bố đã bắn hạ ít nhất 2 tên lửa Kh-59 được phóng đi từ các tiêm kích Su-35 của Nga",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p014",
    name_user: "Nguyen van A",
    content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p015",
    name_user: "Nguyen van A",
    content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p016",
    name_user: "Nguyen van Aw erw wer",
    content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: true,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p017",
    name_user: "Nguyen van A sdf asdf",
    content:
      "Thương vong và thiệt hại chi tiết của vụ tập kích tối 21/3 tại Odessa hiện đang được nhà chức trách khẩn trương thống kê. Vụ tập kích này diễn ra trong bối cảnh Thủ tướng Nhật Bản Fumio Kishida đang có chuyến thăm tới thủ đô Kiev của Ukraine",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
  {
    id: "p018",
    name_user: "Nguyen van A",
    content:
      "Thương vong và thiệt hại chi tiết của vụ tập kích tối 21/3 tại Odessa hiện đang được nhà chức trách khẩn trương thống kê. Vụ tập kích này diễn ra trong bối cảnh Thủ tướng Nhật Bản Fumio Kishida đang có chuyến thăm tới thủ đô Kiev của Ukraine",
    avatar: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
    goodPost: false,
    postDate: "2022-12-02",
    numberOfComment: 5,
    numberOfLike: 20,
    numberOfShare: 0,
    clonedDate: "2022-12-02",
  },
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
  return <BodySocialPage postData={postData} statisticData={statisticData} />;
};
