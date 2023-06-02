import { ReportIcon } from "@/assets/svg";
import { Tree } from "@/components";
import { EventProvider } from "@/components/editor/plugins/event-plugin/event-context";
import { EventsNode } from "@/components/editor/plugins/events-plugin/events-node";
import { ETreeTag } from "@/components/news/news-state";
import { AppContainer } from "@/pages/app/";
import { useNewsSidebar } from "@/pages/news/news.loader";
import { buildTree } from "@/pages/news/news.utils";
import {
  getNewsDetailUrl,
  getPeriodicReportUrl,
  getReportQuickUrl,
  getSyntheticReportDetailUrl,
  reportPeriodicPath,
  reportQuickPath,
  reportSyntheticCreatePath,
  reportSyntheticPath,
} from "@/pages/router";
import { EditorNodes, editorTheme } from "@aiacademy/editor";
import { CaretRightOutlined, PlusOutlined } from "@ant-design/icons";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { Button, Input, Menu, MenuProps, Pagination, Row, Space, Spin } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { useReports } from "../report.loader";
import { DirectoryTree } from "./directory-tree";
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
  const { data: dataNewsLetter, isLoading: isLoadingNewsLetter } = useNewsSidebar();
  const dataWithDefaultParentId = dataNewsLetter?.linh_vuc.map((item: any) => ({
    ...item,
    parent_id: item.parent_id ?? null,
  }));
  const objectsWithNotParentId = dataNewsLetter?.linh_vuc?.filter(
    (obj: any) => !obj.hasOwnProperty("parent_id"),
  );
  //
  const { newsletterId } = useParams();

  const linhVucTree = dataNewsLetter?.linh_vuc && buildTree(dataNewsLetter.linh_vuc);

  const generateTree = (items: any, parentId = null) => {
    return (
      items?.length > 0 &&
      items
        .filter((item: any) => item.parent_id === parentId || item._id === null)
        .map((item: any, index: any) => {
          const { _id, title } = item;
          const children = generateTree(items, _id); // Đệ quy để tạo cây con
          const hasChildren = children.length > 0;
          return {
            key: getPeriodicReportUrl(_id),
            label: <div onClick={handleClickMenu}>{title}</div>, // Thay đổi thành hiển thị title của mục con
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
      label: "Báo cáo nhanh",
      key: reportQuickPath,
      children: [
        { label: "Báo cáo 8:30, 22-11-2021", key: getReportQuickUrl(1) },
        { label: "Báo cáo 8:30, 23-11-2021", key: getReportQuickUrl(2) },
      ],
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
    {
      label: <div onClick={handleClick}>Báo cáo định kỳ</div>,
      key: reportPeriodicPath,
      children: [
        // isLoadingNewsLetter
        //   ? {
        //       label: <Spin />,
        //       key: "loading...",
        //       className: styles.loading,
        //     }
        //   : null,
        // ...(generateTree(dataWithDefaultParentId, null) || []),
        // // ...(objectsWithNotParentId?.map((report: any) => ({
        // //   label: report.title,
        // //   key: getPeriodicReportUrl(report._id),
        // //   className: styles.reportItem,
        // // })) || []),
        // {
        //   label: (
        //     <Pagination
        //       defaultCurrent={1}
        //       showSizeChanger={false}
        //       total={objectsWithNotParentId?.total || 0}
        //       current={filter.page}
        //       pageSize={filter.limit}
        //       onChange={handleChangePaginate}
        //       size="small"
        //     />
        //   ),
        //   key: "paginate",
        //   disabled: true,
        //   className: styles.pagination,
        // },
      ],
    },
  ];
  const [showComponent, setShowComponent] = useState(false);

  return (
    <>
      <Menu mode="inline" items={items} selectedKeys={[pathname]} onClick={handleClickMenu} />
      <Row className={styles.report_periodic}>
        {showComponent && linhVucTree && (
          <Tree
            title=""
            treeData={linhVucTree}
            isSpinning={isLoading}
            onClickTitle={handleClickTitle}
            tag={ETreeTag.LINH_VUC}
            selectedKeys={newsletterId ? [newsletterId] : []}
          />
        )}
      </Row>
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
