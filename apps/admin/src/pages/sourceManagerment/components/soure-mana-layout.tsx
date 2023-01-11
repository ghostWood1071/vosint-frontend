import { appPath, SourceListPath } from "@/pages/router";
import { Menu, MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContainer } from "@/pages/app/";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem("NHÓM NGUỒN TIN", appPath),
  getItem("DANH SÁCH NGUỒN TIN", SourceListPath),
];

export const SourceManaLayout = () => {
  return (
    <AppContainer sidebar={<Sidebar />}>
      <Outlet />
    </AppContainer>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  function handleClick({ key }: { key: string }) {
    navigate(key);
  }
  return <Menu mode="inline" items={items} onClick={handleClick} />;
};
