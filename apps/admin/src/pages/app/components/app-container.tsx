import { Col, Row } from "antd";
import classNames from "classnames";
import React from "react";

import { useSidebar } from "../app.store";
import styles from "./app-container.module.less";

interface AppContainerProps {
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
  filter?: React.ReactNode;
}

export const AppContainer: React.FC<AppContainerProps> = ({ children, sidebar, filter }) => {
  const pinned = useSidebar((state) => state.pinned);

  return (
    <>
      <Row className={styles.root} wrap={false}>
        {pinned && (
          <Col flex="0 0 270px" className={classNames(styles.sidebar, "scrollbar")}>
            {sidebar}
          </Col>
        )}
        <Col flex="1 1 auto" id="modal-mount">
          <div className={classNames(styles.container, "scrollbar")} id="container">
            {children}
          </div>
        </Col>
      </Row>
    </>
  );
};
