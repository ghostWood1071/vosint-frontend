import { PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
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
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <div className={styles.searchButton}>
            <Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} />
          </div>
        </div>
        <div className={styles.rightHeader}>
          <Button
            onClick={handleClickCreate}
            type="primary"
            className={styles.addButton}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        </div>
      </div>

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
          functionDelete={handleDelete}
          functionEdit={handleUpdate}
          confirmLoading={isNewsSourceLoading}
        />
      ) : null}
    </div>
  );
  function handleSearch(value: string) {
    setSearchParams({
      text_search: value,
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
    setIsOpenModal(true);
    setTypeModal("delete");
    setChoosedNewsSource(value);
  }

  function handleAdd(value: any) {
    mutate({ ...value, action: "add" });
  }

  function handleUpdate(value: any) {
    mutate({ ...value, action: "update" });
  }

  function handleDelete(value: any) {
    mutate({ ...value, action: "delete" });
  }
};
