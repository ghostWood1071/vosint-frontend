import { AppContainer } from "@/pages/app";
import {
  pipelineDashboardPath,
  pipelineDataProcessingPath,
  pipelineInformationGathering,
} from "@/pages/router";
import { Menu, MenuProps } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const PipelineLayout: React.FC = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation("translation", { keyPrefix: "pipeline" });

  const items: MenuProps["items"] = [
    { label: t("dashboard"), key: pipelineDashboardPath },
    { label: t("information_gathering"), key: pipelineInformationGathering },
    { label: t("data_processing"), key: pipelineDataProcessingPath },
  ];

  return <Menu items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }
};
