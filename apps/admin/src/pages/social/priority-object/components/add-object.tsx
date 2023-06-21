import { useSocialObjectList } from "@/pages/configuration/config.loader";
import { Avatar, Col, Input, Modal, Row, Select, notification } from "antd";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./add-object.module.less";

interface Props {
  type: string;
  confirmLoading?: boolean;
  isOpen: boolean;
  setIsOpen: (value: any) => void;
  functionAdd: (value: any) => void;
  nameType: string;
}

export const AddObjectModal: React.FC<Props> = ({
  type,
  confirmLoading,
  isOpen,
  setIsOpen,
  functionAdd,
  nameType,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [value, setValue] = useState<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [socialMedia, setSocialMedia] = useState<any>();
  const [avatarUrl, setAvatarUrl] = useState<any>();
  const [accountLink, setAccountLink] = useState<any>();
  const [valiName, setValiName] = useState<any>(false);

  const { data } = useSocialObjectList({
    skip: 1,
    limit: 50,
    type: nameType === "đối tượng" ? "Object" : nameType === "nhóm" ? "Group" : "Fanpage",
    social_name: searchParams.get("text_search") ?? "",
  });

  const openNotification = (placement: any, type: any) => {
    if (type === "invalid") {
      api.info({
        message: `Thông báo`,
        description: "Đối tượng không tồn tại.",
        placement,
      });
    }
  };

  function handleCancel() {
    setIsOpen(false);
  }
  async function handleAdd() {
    const item = data.data.find((e: any) => e._id === value);
    if (item === undefined) {
      setValiName(true);
      return;
    }
    const addData = {
      id: item._id,
    };
    functionAdd(addData);
    setIsOpen(false);
  }

  function handleSearch(value: any) {
    setSearchParams({
      text_search: value.trim(),
    });
  }

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setValiName(false);
    const item = data.data.find((e: any) => e._id === newValue);
    if (item !== undefined) {
      setAvatarUrl(item.avatar_url);
      setSocialMedia(item.social_media);
      setAccountLink(item.account_link);
      return;
    }
    openNotification("top", "invalid");
  };

  if (type === "add") {
    return (
      <Modal
        title={"Thêm mới " + nameType}
        open={isOpen}
        destroyOnClose
        confirmLoading={confirmLoading}
        onOk={handleAdd}
        onCancel={handleCancel}
        width={800}
        closable={false}
        maskClosable={false}
      >
        {contextHolder}

        <div className={styles.mainContainer}>
          <Row justify={"end"} wrap={true}>
            <Col span={4}>
              <div className={styles.title}>
                <span className={styles.requied}>*</span>Tên {nameType}:
              </div>
            </Col>
            <Col span={19}>
              <div className={styles.inputContainer}>
                <Select
                  showSearch
                  value={value}
                  placeholder={"Nhập tên"}
                  className={styles.nameSelect}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  notFoundContent={null}
                  options={(data?.data || []).map((d: any) => ({
                    value: d._id,
                    label: d.social_name,
                  }))}
                />
                {valiName && <span className={styles.requied}>Vui lòng nhập tên {nameType}</span>}
              </div>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Col span={3}>
              <div className={styles.title}>Mạng xã hội:</div>
            </Col>
            <Col span={19}>
              <div className={styles.inputContainer}>
                <Input disabled={true} value={socialMedia} />
              </div>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Col span={2}>
              <div className={styles.title}> Avatar:</div>
            </Col>
            <Col span={19}>
              <div className={styles.inputContainer}>
                <Avatar src={avatarUrl} className={styles.image} />
                {/* <Input disabled={true} value={avatarUrl} /> */}
              </div>
            </Col>
          </Row>
          <Row justify={"end"}>
            <Col span={3}>
              <div className={styles.title}>Account Link:</div>
            </Col>
            <Col span={19}>
              <div className={styles.inputContainer}>
                <Input disabled={true} value={accountLink} />
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }

  return null;
};
