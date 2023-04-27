import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, PageHeader, Space, Table, TableColumnsType, Tooltip } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useMutationProxy, useProxyConfig } from "../config.loader";
import { AddProxyComponent } from "./components/add-proxy-component";
import styles from "./proxy-config.module.less";

export const ProxyConfig = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [choosedProxy, setChoosedProxy] = useState(null);
  const { data } = useProxyConfig({
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const { mutate, isLoading: isProxyLoading } = useMutationProxy();

  const columns: TableColumnsType<any> = [
    {
      title: "Tên",
      align: "left",
      dataIndex: "name",
    },
    {
      title: "IP",
      align: "left",
      dataIndex: "ip_address",
    },
    {
      title: "Cổng(port)",
      align: "left",
      dataIndex: "port",
    },
    {
      title: "Tên đăng nhập",
      align: "left",
      dataIndex: "username",
    },
    {
      title: "Mật khẩu",
      align: "left",
      dataIndex: "password",
    },
    {
      title: "Ghi chú",
      align: "left",
      dataIndex: "note",
    },
    {
      title: "",
      align: "center",
      render: (item: any) => {
        return (
          <Space className={styles.spaceStyle}>
            <Tooltip title={"Sửa proxy"}>
              <EditOutlined onClick={() => handleClickEdit(item)} className={styles.edit} />
            </Tooltip>
            <Tooltip title={"Xoá proxy"}>
              <DeleteOutlined onClick={() => handleClickDelete(item)} className={styles.delete} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return (
    <PageHeader
      title="Danh sách cấu hình proxy"
      extra={[
        <Input.Search
          placeholder="Tìm kiếm"
          onSearch={handleSearch}
          key="input"
          style={{ width: 300 }}
        />,
        <Button
          onClick={handleClickCreate}
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          key="button"
        >
          Thêm
        </Button>,
      ]}
    >
      <div className={styles.mainContainer}>
        <div className={styles.body}>
          <Table
            size={"middle"}
            columns={columns}
            dataSource={data?.data}
            rowKey="id"
            pagination={{
              position: ["bottomCenter"],
              total: data?.total_record,
              current: page ? +page : 1,
              onChange: handlePaginationChange,
              pageSize: pageSize ? +pageSize : 10,
              size: "default",
            }}
            loading={isProxyLoading}
          />
        </div>
        {isOpenModal ? (
          <AddProxyComponent
            type={typeModal}
            isOpen={isOpenModal}
            setIsOpen={setIsOpenModal}
            choosedProxy={choosedProxy}
            functionAdd={handleAdd}
            functionDelete={handleDelete}
            functionEdit={handleUpdate}
            confirmLoading={isProxyLoading}
          />
        ) : null}
      </div>
    </PageHeader>
  );

  function handleSearch(value: string) {
    setSearchParams({
      text_search: value.trim(),
    });
  }
  function handleClickCreate() {
    setIsOpenModal(true);
    setTypeModal("add");
  }

  function handleClickEdit(value: any) {
    setIsOpenModal(true);
    setTypeModal("edit");
    setChoosedProxy(value);
  }

  function handleClickDelete(value: any) {
    setIsOpenModal(true);
    setTypeModal("delete");
    setChoosedProxy(value);
  }

  function handleAdd(value: any) {
    mutate(
      { ...value, action: "add" },
      {
        onSuccess: () => {
          setIsOpenModal(false);
        },
      },
    );
  }

  function handleUpdate(value: any) {
    mutate(
      { ...value, action: "update" },
      {
        onSuccess: () => {
          setIsOpenModal(false);
        },
      },
    );
  }

  function handleDelete(value: any) {
    mutate({ ...value, action: "delete" });
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
