import { Col, Row } from "antd";
import React from "react";

import KeyData from "./key.data.json";
import styles from "./news-detail-key.module.less";

interface Props {}

export const NewsDetailKey: React.FC<Props> = () => {
  return (
    <Row className={styles.key_body}>
      {KeyData.map((data) => {
        return (
          <Col
            className={styles.new_key}
            key={data.id}
            onClick={() => {
              console.log(data.title);
            }}
          >
            <p>{data.title}</p>
          </Col>
        );
      })}
    </Row>
  );
};
