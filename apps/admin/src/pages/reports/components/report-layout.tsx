import { ReportIcon } from "@/assets/svg";
import { EventProvider } from "@/components/editor/plugins/event-plugin/event-context";
import { EventsNode } from "@/components/editor/plugins/events-plugin/events-node";
import { AppContainer } from "@/pages/app/";
import {
  getReportQuickUrl,
  getSyntheticReportDetailUrl,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticCreatePath,
  reportSyntheticPath,
} from "@/pages/router";
import { EditorNodes, editorTheme } from "@aiacademy/editor";
import { PlusOutlined } from "@ant-design/icons";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { Button, Input, Menu, MenuProps, Pagination, Space, Spin } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useReports } from "../report.loader";
import styles from "./report-layout.module.less";

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
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    title: "",
  });
  const { data: dataReport, isLoading } = useReports(filter, {
    keepPreviousData: true,
  });

  const items: MenuProps["items"] = [
    {
      label: "Báo cáo nhanh",
      key: reportQuickPath,
      children: [
        { label: "Báo cáo 8:30, 22-11-2021", key: getReportQuickUrl(1) },
        { label: "Báo cáo 8:30, 23-11-2021", key: getReportQuickUrl(2) },
      ],
    },
    {
      label: "Báo cáo định kỳ",
      key: reportPeriodicPath,
    },
    {
      label: "Phân tích tổng hợp",
      key: reportSyntheticPath,
      icon: <ReportIcon />,
      className: styles.reportMenu,
      children: [
        {
          label: (
            <Space align="center">
              <Input.Search
                placeholder="Tìm kiếm báo cáo"
                onSearch={handleSearch}
                className={styles.input}
              />
              <Button
                icon={<PlusOutlined />}
                title="Thêm báo cáo"
                type="primary"
                onClick={navigateCreateReport}
              />
            </Space>
          ),
          key: "search",
          disabled: true,
          className: styles.search,
        },
        isLoading
          ? {
              label: <Spin />,
              key: "loading...",
              className: styles.loading,
            }
          : null,
        ...(dataReport?.data?.map((report) => ({
          label: report.title,
          key: getSyntheticReportDetailUrl(report._id),
          className: styles.reportItem,
        })) || []),
        {
          label: (
            <Pagination
              defaultCurrent={1}
              showSizeChanger={false}
              total={dataReport?.total || 0}
              current={filter.page}
              pageSize={filter.limit}
              onChange={handleChangePaginate}
              size="small"
            />
          ),
          key: "paginate",
          disabled: true,
          className: styles.pagination,
        },
      ],
    },
  ];

  return <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />;

  function handleClickMenu({ key }: { key: string }) {
    if (key.includes("search") || key.includes("paginate") || key.includes("loading")) {
      return;
    }

    navigate(key);
  }

  function handleSearch(value: string) {
    setFilter((prev) => ({ ...prev, title: value }));
  }

  function handleChangePaginate(page: number) {
    setFilter((prev) => ({ ...prev, page }));
  }

  function navigateCreateReport() {
    navigate(reportSyntheticCreatePath);
  }
};
