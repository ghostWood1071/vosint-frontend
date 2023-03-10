import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, List } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useMutationObjectCate, useObjectCate } from "../../config.loader";
import { AddCateComponent } from "./add-cate-component";
import styles from "./body-cate.module.less";
import { CateItem } from "./cate-item";
import { DetailCate } from "./detail-cate";

interface Props {
  title: string;
}

export const BodyCate: React.FC<Props> = ({ title }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [choosedCate, setChoosedCate] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const typeObject =
    title === "đối tượng" ? "Đối tượng" : title === "tổ chức" ? "Tổ chức" : "Quốc gia";
  const { data } = useObjectCate({
    type: typeObject,
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    name: searchParams.get("text_search") ?? "",
  });
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const { mutate, isLoading: isObjectCateLoading } = useMutationObjectCate();

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
        <div className={styles.listObject}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              current: page ? +page : 1,
              pageSize: pageSize ? +pageSize : 10,
              size: "default",
              position: "bottom",
              total: data?.total,
              onChange: handlePaginationChange,
            }}
            dataSource={data?.data}
            renderItem={(item) => {
              return <CateItem functionEdit={handleUpdate} item={item} onclick={setChoosedCate} />;
            }}
          />
        </div>
        {choosedCate !== null ? (
          <div className={styles.detailObject}>
            <DetailCate
              choosedCate={choosedCate}
              handleOpenDeleteModal={handleOpenDeleteCate}
              handleOpenEditModal={handleOpenEditCate}
              nameTitle={title}
            />
          </div>
        ) : null}
      </div>
      {isOpenModal ? (
        <AddCateComponent
          type={typeModal}
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          nameTitle={title}
          choosedCate={choosedCate}
          functionAdd={handleAdd}
          functionDelete={handleDelete}
          functionEdit={handleUpdate}
          confirmLoading={isObjectCateLoading}
          setChoosedCate={setChoosedCate}
          typeObject={typeObject}
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

  function handleOpenEditCate() {
    setIsOpenModal(true);
    setTypeModal("edit");
  }

  function handleOpenDeleteCate(value: any) {
    setIsOpenModal(true);
    setTypeModal("delete");
  }
  function handleAdd(value: any) {
    mutate({ ...value, action: "add", typeObject: typeObject, status: "enable" });
  }

  function handleUpdate(value: any) {
    mutate({ ...value, action: "update" });
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
