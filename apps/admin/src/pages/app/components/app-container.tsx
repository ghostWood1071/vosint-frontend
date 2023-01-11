import { Col, Row } from "antd";
import React from "react";
import { useSidebar } from "../app.store";
import styles from "./app-container.module.less";

interface AppContainerProps {
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children, sidebar }) => {
  const pinned = useSidebar((state) => state.pinned);

  return (
    <Row className={styles.root} wrap={false}>
      {pinned && (
        <Col flex="0 0 270px" className={styles.sidebar}>
          {sidebar}
        </Col>
      )}
      <Col flex="1 1 auto" id="modal-mount" className={styles.content}>
        <div className={styles.container}>{children}</div>
      </Col>
    </Row>
  );
};
