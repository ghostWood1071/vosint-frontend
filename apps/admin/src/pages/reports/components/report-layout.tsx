import { EventProvider } from "@/components/editor/plugins/event-plugin/event-context";
import { EventsNode } from "@/components/editor/plugins/events-plugin/events-node";
import { AppContainer } from "@/pages/app/";
import {
  getReportQuickUrl,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticPath,
} from "@/pages/router";
import { EditorNodes, editorTheme } from "@aiacademy/editor";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { Menu, MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const ReportLayout = () => {
  const initialConfig: InitialConfigType = {
    namespace: "synthetic-report",
    onError: (error) => {
      console.error(error);
      throw new Error("synthetic-report?");
    },
    theme: editorTheme,
    nodes: [...EditorNodes, EventsNode],
  };

  return (
    <AppContainer sidebar={<Sidebar />}>
      <LexicalComposer initialConfig={initialConfig}>
        <EventProvider>
          <Outlet />
        </EventProvider>
      </LexicalComposer>
    </AppContainer>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items: MenuProps["items"] = [
    {
      label: "BÁO CÁO NHANH",
      key: reportQuickPath,
      children: [
        { label: "Báo cáo 8:30, 22-11-2021", key: getReportQuickUrl(1) },
        { label: "Báo cáo 8:30, 23-11-2021", key: getReportQuickUrl(2) },
      ],
    },
    {
      label: "BÁO CÁO ĐỊNH KỲ",
      key: reportPeriodicPath,
    },
    {
      label: "PHÂN TÍCH TỔNG HỢP",
      key: reportSyntheticPath,
    },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    navigate(key);
  }
};
