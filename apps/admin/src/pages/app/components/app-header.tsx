import { LOCAL_ROLE, LOCAL_USER_PROFILE } from "@/constants/config";
import { authLoginPath, dashboardPathWithRole, searchPath } from "@/pages/router";
import { generateImage } from "@/utils/image";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Dropdown, MenuProps, Row, Space, Typography } from "antd";
import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";

import { NAVBAR_HEADER } from "../app.constants";
import styles from "./app-header.module.less";
import { UserProfile } from "./user-profile";

export const AppHeader: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "app" });
  const navigate = useNavigate();
  const [role] = useLocalStorage<string>(LOCAL_ROLE);
  const [userProfile] = useLocalStorage<any>(LOCAL_USER_PROFILE);
  const [openUser, setOpenUser] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "avatar",
      label: (
        <Space>
          <Avatar
            src={userProfile?.avatar_url ? generateImage(userProfile.avatar_url) : <UserOutlined />}
            style={{ backgroundColor: "#cccccc" }}
          />
          <Typography.Text>{userProfile?.full_name}</Typography.Text>
        </Space>
      ),
      onClick: handleOpenUser,
    },
    {
      key: "user-profile",
      icon: <UserOutlined />,
      label: "Thông tin người dùng",
      onClick: handleOpenUser,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Row className={styles.header} align="middle">
      <Col span={4}>
        <Link to={dashboardPathWithRole(role ?? "admin")}>
          <img className={styles.logo} src="/logo-header.jpg" alt="Logo" width={200} height={30} />
        </Link>
      </Col>
      <Col span={16} className={styles.navbar}>
        <Row justify="space-between" align="middle">
          {NAVBAR_HEADER.map(({ title, to, icon }) => (
            <Col key={to}>
              <NavLink to={to} title={t(title)} className={handleActive}>
                {icon}
              </NavLink>
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={4}>
        <Row justify="end" className={styles.userSetting}>
          {/* <SearchOutlined onClick={handlerNavigateSearch} className={styles.icon} /> */}
          <Dropdown menu={{ items }}>
            <Avatar
              src={
                userProfile?.avatar_url ? generateImage(userProfile.avatar_url) : <UserOutlined />
              }
              style={{ backgroundColor: "#cccccc" }}
            />
          </Dropdown>
        </Row>
      </Col>
      <UserProfile open={openUser} setOpen={setOpenUser} />
    </Row>
  );

  function handleActive({ isActive }: { isActive: boolean }) {
    return classNames(styles.link, { [styles.active]: isActive });
  }

  function handleLogout() {
    navigate(authLoginPath);
    localStorage.clear();
  }

  // function handlerNavigateSearch() {
  //   navigate(searchPath);
  // }

  function handleOpenUser() {
    setOpenUser(true);
  }
};
