import { AppContainer } from "@/pages/app/";
import { appPath } from "@/pages/router";
import { Menu, MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const ListAppLayout = () => {
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
    { label: "Quản lý tin theo nguồn", key: appPath },
    // { label: "Quản lý người dùng", key: sourceListPath },
  ];

  return <Menu items={items} selectedKeys={[pathname]} onClick={handleClick} />;

  function handleClick({ key }: { key: string }) {
    navigate(key);
  }
};
