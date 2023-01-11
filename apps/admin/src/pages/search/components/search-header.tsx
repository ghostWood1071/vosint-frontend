import React from "react";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";
import styles from "./search-header.module.less";
import { UserOutlined } from "@ant-design/icons";
import { dashboardPathWithRole } from "@/pages/router";
import { useLocalStorage } from "react-use";
import { LOCAL_ROLE } from "@/constants/config";

interface SearchHeaderProps {}

export const SearchHeader: React.FC<SearchHeaderProps> = () => {
  const [value] = useLocalStorage<string>(LOCAL_ROLE);

  return (
    <Row className={styles.header} align="middle">
      <Col span={4}>
        <Link to={dashboardPathWithRole(value ?? "admin")}>
          <img className={styles.logo} src="/logo-header.jpg" alt="Logo" width={200} height={30} />
        </Link>
      </Col>
      <Col span={16} className={styles.navbar}></Col>
      <Col span={4}>
        <Row justify="end" className={styles.userSetting}>
          <UserOutlined className={styles.icon} />
        </Row>
      </Col>
    </Row>
  );
};
