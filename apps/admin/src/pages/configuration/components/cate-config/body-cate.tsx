import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, List } from "antd";
import React, { useState } from "react";

import { AddCateComponent } from "./add-cate-component";
import styles from "./body-cate.module.less";
import { CateItem } from "./cate-item";
import { DetailCate } from "./detail-cate";

interface Props {
  title: string;
  dataTable: any[];
  functionAdd: (value: any) => void;
  functionEdit: (value: any) => void;
  functionDelete: (value: any) => void;
  confirmLoading?: any;
}

export const BodyCate: React.FC<Props> = ({
  title,
  dataTable,
  functionAdd,
  functionDelete,
  functionEdit,
  confirmLoading,
}) => {
  const [choosedCate, setChoosedCate] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const data = dataTable;

  function handleSearch(value: string) {
    // console.log(value);
    // const a = dataShow.filter((item) => {
    //   const itemdata = item.name ? item.name.toUpperCase() : "".toUpperCase;
    //   const textData = value.toUpperCase();
    //   return itemdata.indexOf(textData) > -1;
    // });
    // setData(a);
  }
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
              pageSize: 15,
              size: "default",
              position: "bottom",
            }}
            dataSource={data}
            renderItem={(item) => {
              return <CateItem functionEdit={functionEdit} item={item} onclick={setChoosedCate} />;
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
          functionAdd={functionAdd}
          functionDelete={functionDelete}
          functionEdit={functionEdit}
          confirmLoading={confirmLoading}
          setChoosedCate={setChoosedCate}
        />
      ) : null}
    </div>
  );
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
};
