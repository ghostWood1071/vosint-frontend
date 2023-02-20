import { Col, Input, List, Row } from "antd";
import React from "react";
import styles from "./graph-list.module.less";
const { Search } = Input;
const data = [
  {
    title: "Đồ thị 1",
  },
  {
    title: "Đồ thị 2",
  },
];

export const GraphList = () => {
  return (
    <>
      <Row className={styles.row}>
        <Col span={24}>
          <h3 className={styles.title}>DANH SÁCH ĐỒ THỊ</h3>

          <Search placeholder="Tìm kiếm" />

          <List
            size="small"
            dataSource={data}
            renderItem={(item) => <List.Item>{<a href=" ">{item.title}</a>}</List.Item>}
          />
        </Col>
      </Row>
    </>
  );
};
