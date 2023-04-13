import { getSyntheticReportDetailUrl, reportSyntheticCreatePath } from "@/pages/router";
import { TReport } from "@/services/report-type";
import { useLexicalComposerContext } from "@aiacademy/editor";
import { Button, Input, PageHeader, Table, TableProps } from "antd";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useReports } from "../report.loader";
import styles from "./synthetic-report.module.less";

export const SyntheticReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const skip = searchParams.get("skip") ?? 1;
  const limit = searchParams.get("limit") ?? 10;
  const title = searchParams.get("title") ?? "";
  const [editor] = useLexicalComposerContext();

  const { data, isLoading } = useReports(
    {
      skip,
      limit,
      title,
    },
    {
      keepPreviousData: true,
    },
  );

  const columns: TableProps<TReport>["columns"] = [
    {
      title: "Tên báo cáo",
      dataIndex: "title",
      key: "title",
      render: (title, record) => <Link to={getSyntheticReportDetailUrl(record._id)}>{title}</Link>,
    },
  ];

  return (
    <PageHeader
      className={styles.pageHeader}
      title="Báo cáo phân tích tổng hợp"
      extra={[
        <Input.Search
          placeholder="Tìm kiếm theo tên báo cáo"
          key="input"
          onSearch={handleSearch}
        />,
        <Button type="primary" onClick={handleNavigateCreate}>
          Tạo báo cáo mới
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={data?.data}
        loading={isLoading}
        pagination={{
          position: ["bottomCenter"],
          total: data?.total,
          current: skip ? +skip : 1,
          onChange: handlePaginationChange,
          pageSize: limit ? +limit : 10,
        }}
      />
    </PageHeader>
  );

  function handleNavigateCreate() {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    editor.focus();
    navigate(reportSyntheticCreatePath);
  }

  function handleSearch(title: string) {
    searchParams.set("title", title);
    searchParams.delete("skip");
    searchParams.delete("limit");
    setSearchParams(searchParams);
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("skip", page.toString());
    searchParams.set("limit", pageSize.toString());
    setSearchParams(searchParams);
  }
};
