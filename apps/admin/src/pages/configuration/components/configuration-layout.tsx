import { AppContainer } from "@/pages/app";
import {
  collectDataConfigPath,
  facebookConfigPath,
  newsAccountConfigPath,
  newsCategoryConfigPath,
  newsSourceConfigPath,
  pipelineListPath,
  proxyConfigPath,
  tiktokConfigPath,
  twitterConfigPath,
  userManagementPath,
} from "@/pages/router";
import { Menu, MenuProps } from "antd";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const ConfigurationLayout: React.FC = () => {
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
    { label: "CẤU HÌNH LĨNH VỰC TIN", key: newsCategoryConfigPath },
    {
      label: "CẤU HÌNH MẠNG XÃ HỘI",
      key: "ok",
      children: [
        { label: "FACEBOOK", key: facebookConfigPath },
        { label: "TWITTER", key: twitterConfigPath },
        { label: "TIKTOK", key: tiktokConfigPath },
        { label: "CÁC NGUỒN TỔNG HỢP", key: collectDataConfigPath },
      ],
    },
    { label: "DANH MỤC PROXY", key: proxyConfigPath },
    { label: "CÁC TÀI KHOẢN LẤY TIN", key: newsAccountConfigPath },
    { label: "DANH MỤC NGUỒN TIN", key: newsSourceConfigPath },
    { label: "THU THẬP TIN THEO PIPELINE", key: pipelineListPath },
    { label: "QUẢN LÝ NGƯỜI DÙNG", key: userManagementPath },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }
};
