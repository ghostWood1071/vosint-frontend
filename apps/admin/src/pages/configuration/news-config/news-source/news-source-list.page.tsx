import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, PageHeader } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { AddNewsSourceComponent } from "./components/add-news-source";
import { SourceNewsTable } from "./components/news-source-table";
import styles from "./new-source-list.module.less";
import { useMutationNewsSource, useSourceNewsConfigList } from "./news-source.loader";

export const SourceNewsConfigList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useSourceNewsConfigList({
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    text_search: searchParams.get("text_search") ?? "",
  });
  const { mutate, isLoading: isNewsSourceLoading } = useMutationNewsSource();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [choosedNewsSource, setChoosedNewsSource] = useState(null);

  return (
    <PageHeader
      title="Danh sách cấu hình nguồn tin"
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
          <SourceNewsTable
            total_record={data?.total_record}
            data={data?.data}
            loading={isNewsSourceLoading}
            handleClickEdit={handleClickEdit}
            handleClickDelete={handleClickDelete}
          />
        </div>
        {isOpenModal ? (
          <AddNewsSourceComponent
            type={typeModal}
            isOpen={isOpenModal}
            setIsOpen={setIsOpenModal}
            choosedNewsSource={choosedNewsSource}
            functionAdd={handleAdd}
            functionEdit={handleUpdate}
            confirmLoading={isNewsSourceLoading}
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
    setChoosedNewsSource(value);
  }

  function handleClickDelete(value: any) {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá nguồn tin này?",
      okText: "Xoá",
      cancelText: "Thoát",
      onOk: () => {
        handleDelete({ _id: value._id });
      },
    });
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
};
