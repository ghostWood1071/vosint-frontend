import { AppContainer } from "@/pages/app";
import {
  categoryNewsConfigPath,
  facebookConfigPath,
  gatheringDataConfigPath,
  newsFromAccountsConfigPath,
  pipelineInformationGathering,
  proxyConfigPath,
  sourceNewsConfigPath,
  tiktokConfigPath,
  twitterConfigPath,
} from "@/pages/router";
import { Menu, MenuProps } from "antd";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const ConfigLayout: React.FC = () => {
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
    { label: "CẤU HÌNH LĨNH VỰC TIN", key: categoryNewsConfigPath },
    {
      label: "CẤU HÌNH MẠNG XÃ HỘI",
      key: "ok",
      children: [
        { label: "FACEBOOK", key: facebookConfigPath },
        { label: "TWITTER", key: twitterConfigPath },
        { label: "TIKTOK", key: tiktokConfigPath },
        { label: "CÁC NGUỒN TỔNG HỢP", key: gatheringDataConfigPath },
      ],
    },
    { label: "DANH MỤC PROXY", key: proxyConfigPath },
    { label: "CÁC TÀI KHOẢN LẤY TIN", key: newsFromAccountsConfigPath },
    { label: "DANH MỤC NGUỒN TIN", key: sourceNewsConfigPath },
    { label: "THU THẬP TIN THEO PIPELINE", key: pipelineInformationGathering },
  ];
  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;
};
