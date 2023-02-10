import { AppContainer } from "@/pages/app";
import {
  socialDashboardPath,
  socialFacebookPath,
  socialPriorityObjectPath,
  socialTiktokPath,
  socialTwitterPath,
} from "@/pages/router";
import { Menu, MenuProps } from "antd";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const SocialLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items: MenuProps["items"] = [
    { label: "THỐNG KÊ TIN", key: socialDashboardPath },
    { label: "ĐỐI TƯỢNG ƯU TIÊN", key: socialPriorityObjectPath },
    { label: "FACEBOOK", key: socialFacebookPath },
    { label: "TWITTER", key: socialTwitterPath },
    { label: "TIKTOK", key: socialTiktokPath },
  ];
  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;
};
