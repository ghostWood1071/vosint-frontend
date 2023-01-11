import {
  getReportQuickUrl,
  getReportSyntheticUrl,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticPath,
} from "@/pages/router";
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
  getItem("BÁO CÁO NHANH", reportQuickPath, null, [
    getItem("Báo cáo 8:30, 22-11-2021", getReportQuickUrl(1)),
    getItem("Báo cáo 8:30, 22-11-2021", getReportQuickUrl(2)),
  ]),
  getItem("BÁO CÁO ĐỊNH KỲ", reportPeriodicPath, null),
  getItem("PHÂN TÍCH TỔNG HỢP", reportSyntheticPath, null, [
    getItem("Phân tích tổng hợp 1", getReportSyntheticUrl(1)),
    getItem("Phân tích tổng hợp 2", getReportSyntheticUrl(2)),
    getItem("Phân tích tổng hợp 3", getReportSyntheticUrl(3)),
    getItem("Phân tích tổng hợp 4", getReportSyntheticUrl(4)),
  ]),
];

export const ReportLayout = () => {
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
