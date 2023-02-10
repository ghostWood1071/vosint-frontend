import { AppContainer } from "@/pages/app/";
import { sourceConfigPath, userManagerListPath } from "@/pages/router";
import { Menu, MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const SourceConfigLayout = () => {
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
    { label: "Quản lý tin theo nguồn", key: sourceConfigPath },
    { label: "Quản lý người dùng", key: userManagerListPath },
  ];

  return <Menu items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }
};
