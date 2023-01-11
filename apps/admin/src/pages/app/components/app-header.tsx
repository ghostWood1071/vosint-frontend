import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Menu, Row } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authLoginPath, dashboardPathWithRole, searchPath } from "@/pages/router";
import { NAVBAR_HEADER } from "../app.constants";
import { useLocalStorage } from "react-use";
import styles from "./app-header.module.less";
import { LOCAL_ROLE } from "@/constants/config";

export const AppHeader: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "app" });
  const navigate = useNavigate();
  const [value, __, remove] = useLocalStorage<string>(LOCAL_ROLE);

  const menu = (
    <Menu
      items={[
        {
          key: "logout",
          label: <Button onClick={handleLogout}>Logout</Button>,
        },
      ]}
    />
  );

  return (
    <Row className={styles.header} align="middle">
      <Col span={4}>
        <Link to={dashboardPathWithRole(value ?? "admin")}>
          <img className={styles.logo} src="/logo-header.jpg" alt="Logo" width={200} height={30} />
        </Link>
      </Col>
      <Col span={16} className={styles.navbar}>
        <Row justify="space-between" align="middle">
          {NAVBAR_HEADER.map(({ title, to, icon }) => (
            <Col key={to}>
              <NavLink
                to={to}
                title={t(title)}
                className={({ isActive }) => classNames(styles.link, { [styles.active]: isActive })}
              >
                {icon}
              </NavLink>
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={4}>
        <Row justify="end" className={styles.userSetting}>
          <SearchOutlined
            onClick={() => {
              navigate(searchPath);
            }}
            className={styles.icon}
          />
          <Dropdown overlay={menu}>
            <UserOutlined className={styles.icon} />
          </Dropdown>
        </Row>
      </Col>
    </Row>
  );

  function handleLogout() {
    navigate(authLoginPath);
    remove();
  }
};
