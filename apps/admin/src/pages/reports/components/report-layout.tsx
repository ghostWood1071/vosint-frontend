import { EventNodes, EventPlugin } from "@/components/editor/plugins/event-plugin";
import {
  EventEditorConfig,
  EventProvider,
} from "@/components/editor/plugins/event-plugin/event-context";
import { EventFilterNode } from "@/components/editor/plugins/event-plugin/event-filter-node";
import { EventNode } from "@/components/editor/plugins/event-plugin/event-node";
import { AppContainer } from "@/pages/app/";
import {
  getReportQuickUrl,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticPath,
} from "@/pages/router";
import { ContentEditable, EditorNodes, editorTheme } from "@aiacademy/editor";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
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
    nodes: [...EditorNodes, EventNode, EventFilterNode],
  };

  const eventConfig: EventEditorConfig = {
    namespace: "synthetic-report",
    onError: (error) => {
      console.error(error);
      throw new Error("synthetic-event?");
    },
    theme: editorTheme,
    nodes: [...EventNodes],
  };

  return (
    <AppContainer sidebar={<Sidebar />}>
      <LexicalComposer initialConfig={initialConfig}>
        <EventProvider>
          <Outlet />
          <EventPlugin eventEditorConfig={eventConfig}>
            <HistoryPlugin />
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <TabIndentationPlugin />
          </EventPlugin>
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
