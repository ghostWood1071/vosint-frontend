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
    { label: "Cấu hình lĩnh vực tin", key: newsCategoryConfigPath },
    {
      label: "Cấu hình mạng xã hội",
      key: "social-config",
      children: [
        { label: "Facebook", key: facebookConfigPath },
        { label: "Twitter", key: twitterConfigPath },
        { label: "Tiktok", key: tiktokConfigPath },
        { label: "Các nguồn tổng hợp", key: collectDataConfigPath },
      ],
    },
    {
      label: "Cấu hình khác",
      key: "khac",
      children: [
        { label: "Danh mục proxy", key: proxyConfigPath },
        {
          label: "Các tài khoản lấy tin",
          key: "haha",
          children: [
            { label: "Facebook", key: accountForMonitoringFacebookPath },
            { label: "Twitter", key: accountForMonitoringTwitterPath },
            { label: "Tiktok", key: accountForMonitoringTiktokPath },
          ],
        },
        { label: "Danh mục nguồn tin", key: newsSourceConfigPath },
      ],
    },

    { label: "Danh mục tổ chức", key: organizationCateConfigPath },
    { label: "Danh mục quốc gia", key: countryCateConfigPath },
    { label: "Danh mục đối tượng", key: objectCateConfigPath },
    { label: "Thu thập tin theo pipeline", key: pipelineListPath },
    { label: "Quản lý người dùng", key: userManagementPath },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
    Modal.destroyAll();
  }
};
