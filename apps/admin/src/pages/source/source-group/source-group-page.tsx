import { AddIcon, DelIcon, ViewHideIcon, ViewIcon } from "@/assets/svg";
import { EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Input, Space, Table, TableColumnsType, Tooltip } from "antd";
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
                <DelIcon onClick={() => handleClickRemoveItem({ data: item, idGroup: idGroup })} />
              </Col>
            </Space>
          );
        },
      },
    ];
    return <Table columns={columns} dataSource={data ?? []} pagination={false} size={"small"} />;
  };

  const columns: TableColumnsType<any> = [
    { title: "Name", dataIndex: "source_name" },
    {
      align: "right",
      render: (item: any) => (
        <Space>
          <Col push={0}>
            <AddIcon onClick={() => handleClickEditGroup(item)} />
            <DelIcon onClick={() => handleClickDeleteGroup(item)} />
            {item.is_hide ? (
              <ViewHideIcon
                onClick={() => handleClickHideGroup(item)}
                className={styles.hideIcon}
              />
            ) : (
              <ViewIcon onClick={() => handleClickHideGroup(item)} />
            )}
          </Col>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.rootList}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <div className={styles.searchButton}>
            <Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} />
          </div>
        </div>
        <div className={styles.rightHeader}>
          <Button
            onClick={handleClickAddGroup}
            type="primary"
            className={styles.addButton}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (item) =>
            item.news[0] !== undefined ? expandedRow(item.news, item._id) : null,
          rowExpandable: (item) => item._id !== "Not Expandable",
          indentSize: 10,
        }}
        pagination={{
          position: ["bottomCenter"],
          total: data?.total_record,
          current: page ? +page : 1,
          onChange: handlePaginationChange,
          pageSize: pageSize ? +pageSize : 10,
          size: "default",
        }}
        rowKey="_id"
        dataSource={data?.data}
        showHeader={false}
        size={"small"}
      />
      {isOpenGroupModal ? (
        <AddGroupModal
          type={typeGroupModal}
          isOpen={isOpenGroupModal}
          setIsOpen={setIsOpenGroupModal}
          choosedGroupSource={choosedGroupSource}
          functionAdd={functionAdd}
          functionDelete={functionDelete}
          functionEdit={functionEdit}
          confirmLoading={isGroupSourceLoading}
        />
      ) : null}
    </div>
  );

  function handleSearch(value: string) {
    setSearchParams({
      text_search: value,
    });
  }

  function handleClickAddGroup() {
    setIsOpenGroupModal(true);
    setTypeGroupModal("add");
  }

  function handleClickDeleteGroup(value: any) {
    setIsOpenGroupModal(true);
    setTypeGroupModal("delete");
    setChoosedGroupSource(value);
  }

  function handleClickHideGroup(value: any) {
    functionEdit({ ...value, is_hide: !value.is_hide });
  }

  function handleClickRemoveItem(value: any) {
    const dataItem = data.data.find((e: any) => e._id === value.idGroup);
    const dataNewsResult = dataItem.news.filter((e: any) => e.id !== value.data.id);
    functionEdit({ ...dataItem, news: dataNewsResult });
  }
  function handleClickEditGroup(value: any) {
    setIsOpenGroupModal(true);
    setTypeGroupModal("edit");
    setChoosedGroupSource(value);
  }

  function functionAdd(value: any) {
    mutate({ ...value, action: "add" });
  }

  function functionEdit(value: any) {
    mutate({ ...value, action: "update" });
  }

  function functionDelete(value: any) {
    mutate({ ...value, action: "delete" });
  }

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
