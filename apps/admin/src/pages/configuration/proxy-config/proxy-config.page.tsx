import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, List } from "antd";
import React, { useState } from "react";

import { useMutationProxy, useProxyConfig } from "../config.loader";
import { AddProxyComponent } from "./components/add-proxy-component";
import { ProxyItem } from "./components/proxy-item";
import styles from "./proxy-config.module.less";

export const ProxyConfig = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [choosedProxy, setChoosedProxy] = useState(null);
  const { data } = useProxyConfig();
  const { mutate, isLoading: isProxyLoading } = useMutationProxy();
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
        <div className={styles.allTitleHeaderContainer}>
          <div className={styles.titleContainer}>Tên</div>
          <div className={styles.titleContainer}>IP</div>
          <div className={styles.titleContainer}>Cổng(port)</div>
          <div className={styles.titleContainer}>Ghi chú</div>
          <div className={styles.functionTitleContainer}></div>
        </div>
        <div className={styles.listObject}>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              pageSize: 15,
              size: "default",
              position: "bottom",
            }}
            dataSource={data === null ? [] : data}
            renderItem={(item) => {
              return (
                <ProxyItem
                  item={item}
                  handleClickDelete={handleClickDelete}
                  handleClickEdit={handleClickEdit}
                  setChoosedProxy={setChoosedProxy}
                />
              );
            }}
          />
        </div>
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
  );

  function handleSearch() {}
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
    mutate({ ...value, action: "add" });
  }

  function handleUpdate(value: any) {
    mutate({ ...value, action: "update" });
  }

  function handleDelete(value: any) {
    mutate({ ...value, action: "delete" });
  }
};
