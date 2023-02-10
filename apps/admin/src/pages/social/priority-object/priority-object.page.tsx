import { Radio } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Post } from "../components/post";
import { ListGroup, ListUser } from "./priority-object-component/name-object";
import { Statistic } from "./priority-object-component/statistic";
import styles from "./priority-object.module.less";

const listUserData = [
  {
    id: "U01",
    name: "Nguyen Van A",
    numberUser: 450,
    type: "user",
    friends: [
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
    likeAndShare: [
      { name: "Like", day: "20/10/2022", value: 10 },
      { name: "Like", day: "21/10/2022", value: 20 },
      { name: "Like", day: "22/10/2022", value: 5 },
      { name: "Like", day: "23/10/2022", value: 40 },
      { name: "Like", day: "24/10/2022", value: 60 },
      { name: "Like", day: "25/10/2022", value: 20 },
      { name: "Like", day: "26/10/2022", value: 30 },
      { name: "Share", day: "20/10/2022", value: 5 },
      { name: "Share", day: "21/10/2022", value: 30 },
      { name: "Share", day: "22/10/2022", value: 10 },
      { name: "Share", day: "23/10/2022", value: 20 },
      { name: "Share", day: "24/10/2022", value: 50 },
      { name: "Share", day: "25/10/2022", value: 60 },
      { name: "Share", day: "26/10/2022", value: 2 },
      { name: "Comments", day: "20/10/2022", value: 35 },
      { name: "Comments", day: "21/10/2022", value: 60 },
      { name: "Comments", day: "22/10/2022", value: 10 },
      { name: "Comments", day: "23/10/2022", value: 50 },
      { name: "Comments", day: "24/10/2022", value: 80 },
      { name: "Comments", day: "25/10/2022", value: 60 },
      { name: "Comments", day: "26/10/2022", value: 25 },
      { name: "Tương tác", day: "20/10/2022", value: 10 },
      { name: "Tương tác", day: "21/10/2022", value: 90 },
      { name: "Tương tác", day: "22/10/2022", value: 20 },
      { name: "Tương tác", day: "23/10/2022", value: 360 },
      { name: "Tương tác", day: "24/10/2022", value: 80 },
      { name: "Tương tác", day: "25/10/2022", value: 60 },
      { name: "Tương tác", day: "26/10/2022", value: 20 },
    ],
    listPosts: [
      {
        id: "p001",
        title: "Bai viet dau tien",
        summary: "Singapore mở cửa sau 2 năm vì COVID-19.",
        content: "Singapore mở cửa sau 2 năm vì COVID-19.",
        goodPost: true,
        postDate: "2022-12-02",
        numberOfComment: 3,
        numberOfLike: 13,
        numberOfShare: 10,
        clonedDate: "2022-12-02",
      },
      {
        id: "p002",
        title: "Bai viet so hai",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p003",
        title: "Bai viet so ba",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: true,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p004",
        title: "Bai viet so bon",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p005",
        title: "Bai viet so num",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p006",
        title: "Bai viet so sau",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: true,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p007",
        title: "Bai viet so bay",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p008",
        title: "Bai viet so tam",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
    ],
  },
];
const listGroupData = [
  {
    id: "L01",
    name: "Nguyen Van A",
    numberUser: 450,
    type: "group",
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
    likeAndShare: [
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
    listPosts: [
      {
        id: "p001",
        title: "Bai viet dau tien",
        summary: "Singapore mở cửa sau 2 năm vì COVID-19.",
        content: "Singapore mở cửa sau 2 năm vì COVID-19.",
        goodPost: true,
        postDate: "2022-12-02",
        numberOfComment: 3,
        numberOfLike: 13,
        numberOfShare: 10,
        clonedDate: "2022-12-02",
      },
      {
        id: "p002",
        title: "Bai viet so hai",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p003",
        title: "Bai viet so ba",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: true,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p004",
        title: "Bai viet so bon",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p005",
        title: "Bai viet so num",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p006",
        title: "Bai viet so sau",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: true,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p007",
        title: "Bai viet so bay",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
      {
        id: "p008",
        title: "Bai viet so tam",
        summary: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        content: "Indonesia mở cửa sau 2 năm vì COVID-19.",
        goodPost: false,
        postDate: "2022-12-02",
        numberOfComment: 5,
        numberOfLike: 20,
        numberOfShare: 0,
        clonedDate: "2022-12-02",
      },
    ],
  },
];

export const PriorityObject = () => {
  let [searchParams] = useSearchParams();
  const [objectChoosed, setObjectChoosed] = useState<any>({ id: searchParams.get("id") });
  const [tabButton, setTabButton] = useState("thongke");

  function onChooseUser(item: any) {
    setObjectChoosed(item);
    setTabButton("thongke");
  }
  function onChooseGroup(item: any) {
    setObjectChoosed(item);
    setTabButton("thongke");
  }

  function handleTabButton(type: string) {
    setTabButton(type);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.nameObject}>
        <div className={styles.user}>
          <ListUser
            items={listUserData}
            itemChoosed={objectChoosed}
            onChooseUser={(item: any) => {
              onChooseUser(item);
            }}
          />
        </div>
        <div className={styles.group}>
          <ListGroup
            items={listGroupData}
            itemChoosed={objectChoosed}
            onChooseGroup={(item: any) => {
              onChooseGroup(item);
            }}
          />
        </div>
      </div>
      {objectChoosed.name !== undefined ? (
        <div className={styles.content}>
          <div className={styles.allTabButtonContainer}>
            {objectChoosed.type === "group" ? (
              <div className={styles.tabButtonContainer}>
                <Radio.Group
                  size={"large"}
                  value={tabButton}
                  buttonStyle="solid"
                  onChange={(e) => {
                    handleTabButton(e.target.value);
                  }}
                >
                  <Radio.Button value="thongke">Thống kê</Radio.Button>
                  <Radio.Button value="baidang">Bài đăng</Radio.Button>
                  <Radio.Button value="thanhvien">Thành viên</Radio.Button>
                  <Radio.Button value="thongtindoituong">Thông tin đối tượng</Radio.Button>
                </Radio.Group>
              </div>
            ) : (
              <div className={styles.tabButtonContainer}>
                <Radio.Group
                  size={"large"}
                  value={tabButton}
                  buttonStyle="solid"
                  onChange={(e) => {
                    handleTabButton(e.target.value);
                  }}
                >
                  <Radio.Button value="thongke">Thống kê</Radio.Button>
                  <Radio.Button value="baidang">Bài đăng</Radio.Button>
                  <Radio.Button value="banbe">Bạn bè</Radio.Button>
                  <Radio.Button value="nhomthamgia">Nhóm tham gia</Radio.Button>
                  <Radio.Button value="thongtindoituong">Thông tin đối tượng</Radio.Button>
                </Radio.Group>
              </div>
            )}
          </div>
          {tabButton === "thongke" ? (
            <Statistic objectChoosed={objectChoosed} />
          ) : tabButton === "baidang" ? (
            <Post data={objectChoosed.listPosts} pageSize={6} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
