import { Col, Row } from "antd";
import dayjs from "dayjs";
import React from "react";

import { ColumnTopChart } from "../components/column-top-chart/column-top-chart";
import { HotNews } from "../components/hot-news/hot-news";
import { useNewsCountryToday } from "../dashboard.loader";
import { CircleBottomChart } from "./component/circle-bottom-chart/circle-bottom-chart";
import { ColumnBottomChart } from "./component/column-bottom-chart/column-bottom-chart";
import { SuperviseUser } from "./component/supervise-user/supervise-user";
import styles from "./leader.module.less";

export const LeaderLayout: React.FC = () => {
  const { data: dataCountryToday } = useNewsCountryToday();

  //fake data supervise user
  const mostNewsReader = [
    {
      id: "u001",
      fullName: "David",
      image:
        "https://media.nngroup.com/media/people/photos/2022-portrait-page-3.jpg.600x600_q75_autocrop_crop-smart_upscale.jpg",
      address: "Son La",
      online: true,
      numberOfReadedNews: 24,
    },
    {
      id: "u002",
      fullName: "Linda",
      image: "https://dwpdigital.blog.gov.uk/wp-content/uploads/sites/197/2016/07/P1090594-1.jpeg",
      address: "Ha Noi",
      online: false,
      numberOfReadedNews: 16,
    },
    {
      id: "u003",
      fullName: "Hoang Khai",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      address: "Ha Nam",
      online: false,
      numberOfReadedNews: 12,
    },
  ];

  const lessNewsReader = [
    {
      id: "u004",
      fullName: "Nguyen Quang Truong",
      image:
        "https://media.nngroup.com/media/people/photos/2022-portrait-page-3.jpg.600x600_q75_autocrop_crop-smart_upscale.jpg",
      address: "Son La",
      online: true,
      numberOfReadedNews: 0,
    },
    {
      id: "u005",
      fullName: "Trang",
      image: "https://dwpdigital.blog.gov.uk/wp-content/uploads/sites/197/2016/07/P1090594-1.jpeg",
      address: "Ha Noi",
      online: false,
      numberOfReadedNews: 2,
    },
    {
      id: "u006",
      fullName: "Ronaldo",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      address: "Indonesia",
      online: false,
      numberOfReadedNews: 3,
    },
  ];

  const dataBottomColumn = [
    {
      type: "ANH",
      value: 280,
    },
    {
      type: "MỸ",
      value: 500,
    },
    {
      type: "TRUNG QUỐC",
      value: 750,
    },
    {
      type: "NGA",
      value: 350,
    },
    {
      type: "BRAZIL",
      value: 650,
    },
  ];

  const numberOfUserOnline = 40;
  const numberOfAllUser = 200;

  const dataCircle = [
    {
      type: "Trí tuệ nhân tạo",
      value: 27,
    },
    {
      type: "Công nghệ thông tin",
      value: 25,
    },
    {
      type: "COVID ",
      value: 18,
    },
    {
      type: "Chủ đề 1",
      value: 15,
    },
    {
      type: "COVID Thế giới",
      value: 10,
    },
    {
      type: "Các chủ đề khác",
      value: 5,
    },
  ];

  return (
    <div className={styles.root}>
      <Row gutter={[16, 16]} className={styles.row1}>
        <Col className={styles.column1Row1} xs={24} xl={9}>
          <div className={styles.columnRow1Level1Body}>
            <ColumnTopChart
              data={
                dataCountryToday
                  ?.map(({ date, value }: { date: string; value: string }) => ({
                    date: dayjs(date).format("DD/MM/YYYY"),
                    value,
                  }))
                  .reverse() ?? []
              }
            />
          </div>
        </Col>
        <Col className={styles.column2Row1} xs={24} xl={15}>
          <div className={styles.columnRow1Level1Body}>
            <HotNews />
          </div>
        </Col>
        <Col className={styles.column1Row2} xs={24} xl={9}>
          <div className={styles.columnRow1Level2Body}>
            <SuperviseUser
              mostNewsReader={mostNewsReader}
              lessNewsReader={lessNewsReader}
              numberOfUserOnline={numberOfUserOnline}
              numberOfAllUser={numberOfAllUser}
            />
          </div>
        </Col>
        <Col className={styles.column2Row2} xs={24} xl={15}>
          <Row gutter={[16, 16]} className={styles.rowLevel2}>
            <Col className={styles.columnLevel2} xs={24} xl={11}>
              <div className={styles.columnRow1Level2Body}>
                <CircleBottomChart data={dataCircle} />
              </div>
            </Col>
            <Col className={styles.columnLevel2} xs={24} xl={13}>
              <div className={styles.columnRow1Level2Body}>
                <ColumnBottomChart data={dataBottomColumn} />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
