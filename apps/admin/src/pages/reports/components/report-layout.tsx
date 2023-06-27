import { ReportIcon } from "@/assets/svg";
import { Tree } from "@/components";
import { EventNodes, EventPlugin } from "@/components/editor/plugins/event-plugin";
import {
  EventEditorConfig,
  EventProvider,
} from "@/components/editor/plugins/event-plugin/event-context";
import { EventFilterNode } from "@/components/editor/plugins/event-plugin/event-filter-node";
import { EventNode } from "@/components/editor/plugins/event-plugin/event-node";
import { ETreeTag } from "@/components/news/news-state";
import { AppContainer } from "@/pages/app/";
import { useNewsSidebar } from "@/pages/news/news.loader";
import { buildTree } from "@/pages/news/news.utils";
import {
  getPeriodicReportUrl,
  getReportQuickUrl,
  getSyntheticReportDetailUrl,
  reportPeriodicPath,
  reportQuickCreatePath,
  reportQuickPath,
  reportSyntheticCreatePath,
  reportSyntheticPath,
} from "@/pages/router";
import { ContentEditable, EditorNodes, editorTheme } from "@aiacademy/editor";
import "@aiacademy/editor/style.css";
import { ContainerFilled, FundFilled, PlusOutlined } from "@ant-design/icons";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { Button, Col, Input, Menu, MenuProps, Pagination, Row, Space, Spin } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { useQuickReports, useReports } from "../report.loader";
import styles from "./report-layout.module.less";

export const ReportLayout = () => {
  const initialConfig: InitialConfigType = {
    namespace: "quick-report",
    onError: (error) => {
      console.error(error);
      throw new Error("quick-report?");
    },
    theme: editorTheme,
    nodes: [...EditorNodes, EventNode, EventFilterNode],
  };

  const eventConfig: EventEditorConfig = {
    namespace: "quick-report",
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
          <EventPlugin eventEditorConfig={eventConfig}>
            <HistoryPlugin />
            <RichTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <TabIndentationPlugin />
          </EventPlugin>
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
  const [quickFilter, setQuickFilter] = useState({
    page: 1,
    limit: 10,
    title: "",
  });
  const { data: dataReport, isLoading } = useReports(filter, {
    keepPreviousData: true,
  });

  const { data: dataQuickReport, isLoading: isQuickReportLoading } = useQuickReports(quickFilter, {
    keepPreviousData: true,
  });

  const { data: dataNewsLetter } = useNewsSidebar();

  const { id } = useParams();
  const linhVucTree = dataNewsLetter?.linh_vuc && buildTree(dataNewsLetter.linh_vuc);

  const _generateTree = (items: any, parentId = null) => {
    return (
      items?.length > 0 &&
      items
        .filter((item: any) => item.parent_id === parentId || item._id === null)
        .map((item: any, index: any) => {
          const { _id, title } = item;
          const children = _generateTree(items, _id); // Đệ quy để tạo cây con
          const hasChildren = children.length > 0;
          return {
            key: getPeriodicReportUrl(_id),
            label: (
              <div className={styles.title} onClick={handleClickMenu}>
                {title}
              </div>
            ), // Thay đổi thành hiển thị title của mục con
            children: hasChildren ? children : null,
            selectable: false, // Ẩn chọn cho nút có con
          };
          function handleClickMenu() {
            // if (children.length > 0) {
            //   // Nếu có con, thì không cho phép mở rộng/collapse node khi click vào label
            //   return;
            // }
            navigate(getPeriodicReportUrl(_id));
          }
        })
    );
  };

  const items: MenuProps["items"] = [
    {
      label: "BÁO CÁO NHANH",
      icon: <FundFilled />,
      className: styles.reportMenu,
      key: reportQuickPath,
      children: [
        {
          label: (
            <Space align="center">
              <Input.Search
                placeholder="Tìm kiếm báo cáo nhanh"
                onSearch={handleQuickSearch}
                className={styles.input}
              />
              <Button
                icon={<PlusOutlined />}
                title="Thêm báo cáo nhanh"
                type="primary"
                onClick={navigateCreateQuickReport}
              />
            </Space>
          ),
          key: "quick-search",
          disabled: true,
          className: styles.search,
        },
        isQuickReportLoading
          ? {
              label: <Spin />,
              key: "quick-loading",
              className: styles.loading,
            }
          : null,
        ...(dataQuickReport?.data?.map((report) => ({
          label: report.title,
          key: getReportQuickUrl(report._id),
          className: styles.reportItem,
        })) || []),
        {
          label: (
            <Pagination
              defaultCurrent={1}
              showSizeChanger={false}
              total={dataQuickReport?.total || 0}
              current={quickFilter.page}
              pageSize={quickFilter.limit}
              onChange={handleQuickChangePaginate}
              size="small"
            />
          ),
          key: "quick-pagination",
          disabled: true,
          className: styles.pagination,
        },
      ],
    },

    {
      label: "PHÂN TÍCH TỔNG HỢP",
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
              key: "loading",
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
    {
      label: <div onClick={handleClick}>BÁO CÁO ĐỊNH KỲ</div>,
      icon: <ContainerFilled />,
      className: styles.reportMenu,
      key: reportPeriodicPath,
      children: [],
    },
  ];
  const [showComponent, setShowComponent] = useState(false);

  return (
    <>
      <Col className={styles.listReport}>
        <Row>
          <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />
        </Row>
        <div className={styles.report_periodic}>
          {showComponent && linhVucTree && (
            <Tree
              title=""
              treeData={linhVucTree}
              isSpinning={isLoading}
              onClickTitle={handleClickTitle}
              tag={ETreeTag.LINH_VUC}
              selectedKeys={id ? [id] : []}
            />
          )}
        </div>
      </Col>
    </>
  );

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

  function handleQuickSearch(value: string) {
    setQuickFilter((prev) => ({ ...prev, title: value }));
  }

  function handleQuickChangePaginate(page: number) {
    setQuickFilter((prev) => ({ ...prev, page }));
  }

  function navigateCreateQuickReport() {
    navigate(reportQuickCreatePath);
  }

  function navigateCreateReport() {
    navigate(reportSyntheticCreatePath);
  }

  function handleClickTitle(newsletterId: string, tag: ETreeTag) {
    navigate(getPeriodicReportUrl(newsletterId));
  }

  function handleClick() {
    setShowComponent(!showComponent);
  }
};
