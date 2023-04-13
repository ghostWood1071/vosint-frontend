import { apiClient } from "@/utils/api";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Input, Modal, Table, TableColumnsType, Typography } from "antd";
import { $getNodeByKey } from "lexical";
import { compact } from "lodash";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { $isEventNode } from "../plugins/event-plugin/event-node";
import { useNews } from "./store";

export function NewsList(): JSX.Element {
  const [open, setOpen] = useNews((state) => [state.open, state.setOpen], shallow);
  const [newsList, setNewsList] = useNews((state) => [state.newsList, state.setNewsList], shallow);
  const [data, setData] = useState<{
    result: any[];
    total_record: number;
  }>({
    result: [],
    total_record: 0,
  });
  const [loading, setLoading] = useState(false);
  const [paginate, setPaginate] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [title, setTitle] = useState("");
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const response = await apiClient.get("/news", {
        params: {
          skip: paginate.pageNumber,
          limit: paginate.pageSize,
          title,
        },
      });
      setData(response.data);
      setLoading(false);
    }
    fetchData();
  }, [paginate.pageNumber, paginate.pageSize, title]);

  const rowSelection = {
    onChange: (_: any, selectedRows: any[]) => {
      setNewsList(compact(selectedRows));
    },
    getCheckboxProps: (record: any) => ({
      disabled: false,
      name: record.title,
    }),
    selectedRowKeys: newsList.map((i: any) => i?._id),
    preserveSelectedRowKeys: true,
  };

  const columns: TableColumnsType<any> = [
    {
      key: "data:title",
      dataIndex: "data:title",
      render: (_, record) => (
        <Typography.Link target="_blank" href={record?.["data:url"]} rel="noreferrer">
          {record?.["data:title"]}
        </Typography.Link>
      ),
    },
    {
      key: "data:time",
      dataIndex: "data:time",
    },
  ];

  return (
    <Modal
      open={!!open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="Thêm tin mẫu"
      style={{ top: 20 }}
      width="75%"
      getContainer="#modal-mount"
      zIndex={1001}
      destroyOnClose
      closable={false}
    >
      <Input.Search placeholder="Từ khoá" style={{ marginBottom: 8 }} onSearch={handleSearch} />

      <Table
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          total: data?.total_record,
          current: paginate.pageNumber,
          pageSize: paginate.pageSize,
          onChange: handlePaginate,
        }}
        columns={columns}
        dataSource={data?.result}
        rowSelection={rowSelection}
        loading={loading}
      />
    </Modal>
  );

  function handleSearch(value: string) {
    setTitle(value);
  }

  function handlePaginate(page: number, pageSize: number) {
    setPaginate({
      pageSize: pageSize,
      pageNumber: page,
    });
  }

  function handleCancel() {
    setOpen(null);
    setPaginate({
      pageNumber: 1,
      pageSize: 10,
    });
    setTitle("");
  }

  function handleOk() {
    if (open) {
      editor.update(() => {
        const node = $getNodeByKey(open);
        if (node && $isEventNode(node)) {
          node.setNewsList(newsList);
        }
      });
    }

    setOpen(null);
    setPaginate({
      pageNumber: 1,
      pageSize: 10,
    });
    setTitle("");
    setNewsList([]);
  }
}
