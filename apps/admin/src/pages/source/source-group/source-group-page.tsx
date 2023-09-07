import {
  DeleteOutlined,
  DownCircleOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Modal,
  PageHeader,
  Space,
  Table,
  TableColumnsType,
  message,
} from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AddGroupModal } from "./components/add-group-modal";
import styles from "./source-group-page.module.less";
import { useGroupSourceList, useMutationGroupSource } from "./source-group.loader";

export const ViewList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpenGroupModal, setIsOpenGroupModal] = useState(false);
  const [typeGroupModal, setTypeGroupModal] = useState("");
  const [choosedGroupSource, setChoosedGroupSource] = useState(null);
  const { data } = useGroupSourceList({
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const { mutate, isLoading: isGroupSourceLoading } = useMutationGroupSource();

  const expandedRow = (data: any, idGroup: any) => {
    const columns: TableColumnsType<any> = [
      { title: "Tên nguồn tin", dataIndex: "name", align: "left", width: "40%" },
      { title: "Tên miền", dataIndex: "host_name", width: "30%" },
      {
        title: "",
        align: "right",
        render: (item: any) => {
          return (
            <Space>
              <Col push={0}>
                <DeleteOutlined
                  className={styles.delete}
                  title={"Xoá nguồn tin"}
                  onClick={() => handleClickRemoveItem({ data: item, idGroup: idGroup })}
                />
              </Col>
            </Space>
          );
        },
      },
    ];
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data ?? []}
        pagination={false}
        size={"middle"}
      />
    );
  };

  const columns: TableColumnsType<any> = [
    { title: "Name", dataIndex: "source_name" },
    {
      align: "right",
      render: (item: any) => (
        <Space>
          <Col push={0}>
            <EditOutlined
              className={styles.edit}
              title={"Cập nhật nhóm nguồn tin"}
              onClick={() => handleClickEditGroup(item)}
            />
          </Col>
          <Col push={0}>
            <DeleteOutlined
              className={styles.delete}
              title={"Xoá nhóm nguồn tin"}
              onClick={() => handleClickDeleteGroup(item)}
            />
          </Col>
          <Col push={0}>
            {item.is_hide ? (
              <EyeInvisibleOutlined
                className={styles.hide}
                title="Ẩn"
                onClick={() => handleClickHideGroup(item)}
              />
            ) : (
              <EyeOutlined
                className={styles.hide}
                title="Hiện"
                onClick={() => handleClickHideGroup(item)}
              />
            )}
          </Col>
        </Space>
      ),
    },
  ];

  return (
    <PageHeader
      title="Danh sách nhóm nguồn tin"
      extra={[
        <Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} key="search" />,
        <Button
          onClick={handleClickAddGroup}
          type="primary"
          className={styles.addButton}
          icon={<PlusOutlined />}
          key="button"
        >
          Thêm
        </Button>,
      ]}
    >
      <div className={styles.rootList}>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: (item) =>
              item.news[0] !== undefined ? expandedRow(item.news, item._id) : null,
            rowExpandable: (item) => item._id !== "Not Expandable",
            indentSize: 10,
            expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UpCircleOutlined onClick={(e:any) => onExpand(record, e)} />
            ) : (
              <DownCircleOutlined onClick={(e:any) => onExpand(record, e)} />
            )
          }}
          pagination={{
            position: ["bottomCenter"],
            total: data?.total_record,
            current: page ? +page : 1,
            onChange: handlePaginationChange,
            pageSize: pageSize ? +pageSize : 10,
            size: "default",
            showSizeChanger: true,
          }}
          rowKey="_id"
          dataSource={data?.data}
          showHeader={false}
          size={"middle"}
        />
        {isOpenGroupModal ? (
          <AddGroupModal
            type={typeGroupModal}
            isOpen={isOpenGroupModal}
            setIsOpen={setIsOpenGroupModal}
            choosedGroupSource={choosedGroupSource}
            functionAdd={functionAdd}
            functionEdit={functionEdit}
            confirmLoading={isGroupSourceLoading}
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

  function handleClickAddGroup() {
    setIsOpenGroupModal(true);
    setTypeGroupModal("add");
  }

  function handleClickDeleteGroup(value: any) {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá nhóm nguồn tin này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        handleDelete({ _id: value._id });
      },
    });
  }

  function handleClickHideGroup(value: any) {
    mutate(
      { ...value, is_hide: !value.is_hide, action: "update" },
      {
        onSuccess: () => {
          message.success({
            content: (value.is_hide ? "Hiện" : "Ẩn") + " nhóm nguồn tin thành công",
          });
          setIsOpenGroupModal(false);
        },
      },
    );
  }

  function handleClickRemoveItem(value: any) {
    const dataItem = data.data.find((e: any) => e._id === value.idGroup);
    const dataNewsResult = dataItem.news.filter((e: any) => e.id !== value.data.id);
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá nguồn tin này?",
      okText: "Xoá",
      cancelText: "Huỷ",
      onOk: () => {
        handeDeleteItemSource({ ...dataItem, news: dataNewsResult });
      },
    });
  }
  function handleClickEditGroup(value: any) {
    setIsOpenGroupModal(true);
    setTypeGroupModal("edit");
    setChoosedGroupSource(value);
  }

  function functionAdd(value: any) {
    mutate(
      { ...value, action: "add" },
      {
        onSuccess: () => {
          message.success({
            content: "Thêm nhóm nguồn tin thành công",
          });
          setIsOpenGroupModal(false);
        },
      },
    );
  }

  function functionEdit(value: any) {
    mutate(
      { ...value, action: "update" },
      {
        onSuccess: () => {
          message.success({
            content: "Cập nhật nhóm nguồn tin thành công",
          });
          setIsOpenGroupModal(false);
        },
      },
    );
  }

  function handeDeleteItemSource(value: any) {
    mutate(
      { ...value, action: "update" },
      {
        onSuccess: () => {
          message.success({
            content: "Xoá nguồn tin thành công",
          });
          setIsOpenGroupModal(false);
        },
      },
    );
  }

  function handleDelete(value: any) {
    mutate(
      { ...value, action: "delete" },
      {
        onSuccess: () => {
          message.success({
            content: "Xoá nhóm nguồn tin thành công",
          });
          setIsOpenGroupModal(false);
        },
      },
    );
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
