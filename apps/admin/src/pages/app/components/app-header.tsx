import { LOCAL_ROLE, LOCAL_USER_PROFILE } from "@/constants/config";
import { authLoginPath, dashboardPathWithRole } from "@/pages/router";
import { generateImage } from "@/utils/image";
import { DoubleLeftOutlined, DoubleRightOutlined, LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Dropdown, MenuProps, Row, Space, Typography } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { shallow } from "zustand/shallow";
import { NAVBAR_HEADER, NAVBAR_HEADER_ADMIN } from "../app.constants";
import { UserProfile } from "./user-profile";
import { useSidebar } from "../app.store";
import classNames from "classnames";
import styles from "./app-header.module.less";
import "../less/app.less";
import { useGetMe } from "@/pages/auth/auth.loader";

export const AppHeader: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "app" });
  const navigate = useNavigate();
  const [role] = useLocalStorage<string>(LOCAL_ROLE);
  const [userProfile] = useLocalStorage<any>(LOCAL_USER_PROFILE);
  const [openUser, setOpenUser] = useState(false);
  const [pinned, setPinned] = useSidebar((state) => [state.pinned, state.setPinned], shallow);

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
    <Row className={`${styles.header} app-header`} align="middle">
      <Col span={1}>
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
      <Col span={2}>
        <Link to={dashboardPathWithRole(role ?? "admin")}>
          <img
            className={styles.logo + " app-logo"}
            src="/images/logo-header.jpg"
            alt="Logo"
            width={200}
            height={30}
          />
        </Link>
      </Col>
      <Col span={18} push={1} className={styles.navbar}>
        <Row
          // justify="space-between"
          align="middle"
          className="app-header-middle"
        >
          {(role === "admin" ? NAVBAR_HEADER_ADMIN : NAVBAR_HEADER).map(({ title, to, icon }) => (
            <Col key={to}>
              <NavLink to={to} className={handleActive}>
                <div className={styles.tabContainer + " app-navbar-item"}>
                  {icon}
                  <div className={styles.title}>{t(title)}</div>
                </div>
              </NavLink>
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={2} push={1}>
        <Row justify="end" className={styles.userSetting}>
          <Dropdown menu={{ items }}>
            <Avatar
              src={
                userProfile?.avatar_url ? generateImage(userProfile.avatar_url) : <UserOutlined />
              }
              style={{ backgroundColor: "#cccccc" }}
              size="large"
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

  function handlePin() {
    setPinned(!pinned);
  }
};
