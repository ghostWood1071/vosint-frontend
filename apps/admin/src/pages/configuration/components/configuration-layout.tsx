import { AppContainer } from "@/pages/app";
import {
  accountForMonitoringFacebookPath,
  accountForMonitoringTiktokPath,
  accountForMonitoringTwitterPath,
  collectDataConfigPath,
  countryCateConfigPath,
  facebookConfigPath,
  newsCategoryConfigPath,
  newsSourceConfigPath,
  objectCateConfigPath,
  organizationCateConfigPath,
  pipelineListPath,
  proxyConfigPath,
  tiktokConfigPath,
  twitterConfigPath,
  userManagementPath,
} from "@/pages/router";
import { Menu, MenuProps, Modal } from "antd";
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
      key: "social-config",
      children: [
        { label: "FACEBOOK", key: facebookConfigPath },
        { label: "TWITTER", key: twitterConfigPath },
        { label: "TIKTOK", key: tiktokConfigPath },
        { label: "CÁC NGUỒN TỔNG HỢP", key: collectDataConfigPath },
      ],
    },
    {
      label: "CẤU HÌNH KHÁC",
      key: "khac",
      children: [
        { label: "DANH MỤC PROXY", key: proxyConfigPath },
        {
          label: "CÁC TÀI KHOẢN LẤY TIN",
          key: "haha",
          children: [
            { label: "FACEBOOK", key: accountForMonitoringFacebookPath },
            { label: "TWITTER", key: accountForMonitoringTwitterPath },
            { label: "TIKTOK", key: accountForMonitoringTiktokPath },
          ],
        },
        { label: "DANH MỤC NGUỒN TIN", key: newsSourceConfigPath },
      ],
    },

    { label: "DANH MỤC TỔ CHỨC", key: organizationCateConfigPath },
    { label: "DANH MỤC QUỐC GIA", key: countryCateConfigPath },
    { label: "DANH MỤC ĐỐI TƯỢNG", key: objectCateConfigPath },
    { label: "THU THẬP TIN THEO PIPELINE", key: pipelineListPath },
    { label: "QUẢN LÝ NGƯỜI DÙNG", key: userManagementPath },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
    Modal.destroyAll();
  }
};
