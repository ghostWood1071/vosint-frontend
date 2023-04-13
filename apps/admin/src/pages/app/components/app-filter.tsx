import { DoubleLeftOutlined, DoubleRightOutlined, MenuOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import { useSidebar } from "../app.store";
import styles from "./app-filter.module.less";

interface Props {
  children?: React.ReactNode;
}

export function AppFilter({ children }: Props): JSX.Element {
  const pinned = useSidebar((state) => state.pinned);
  const setPinned = useSidebar((state) => state.setPinned);
  const { t } = useTranslation("translation", { keyPrefix: "app" });

  return (
    <Row className={styles.filter} align="middle">
      <Col span={1} xl={4}>
        <div
          className={styles.containerIcon}
          title={!pinned ? t("open sidebar") : t("close sidebar")}
        >
          <MenuOutlined className={classNames(styles.menuIcon, styles.icon)} />
          {!pinned && (
            <DoubleRightOutlined
              className={classNames(styles.doubleIcon, styles.icon)}
              onClick={handlePin}
            />
          )}
          {pinned && (
            <DoubleLeftOutlined
              className={classNames(styles.doubleIcon, styles.icon)}
              onClick={handlePin}
            />
          )}
        </div>
      </Col>
      <Col span={23} xl={20}>
        {children}
      </Col>
    </Row>
  );

  function handlePin() {
    setPinned(!pinned);
  }
}
