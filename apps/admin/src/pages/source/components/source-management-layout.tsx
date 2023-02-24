import { AppContainer } from "@/pages/app";
import { sourceGroupPath, sourceListPath } from "@/pages/router";
import { Menu, MenuProps } from "antd";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const SourceManagementLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items: MenuProps["items"] = [
    { label: "Nhóm nguồn tin", key: sourceGroupPath },
    { label: "Danh sách nguồn tin", key: sourceListPath },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }
};
