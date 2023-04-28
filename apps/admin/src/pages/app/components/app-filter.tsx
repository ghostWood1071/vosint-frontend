import { DoubleLeftOutlined, DoubleRightOutlined, MenuOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { useSidebar } from "../app.store";
import styles from "./app-filter.module.less";

interface Props {
  children?: React.ReactNode;
}

export function AppFilter({ children }: Props): JSX.Element {
  return (
    <Row className={styles.filter} align="middle">
      <Col span={1} xl={4}></Col>
      <Col span={23} xl={20}>
        {children}
      </Col>
    </Row>
  );
}
