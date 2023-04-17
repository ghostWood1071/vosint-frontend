import { UserIcon } from "@/assets/svg";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import React, { useState } from "react";

import styles from "./detail-cate.module.less";

interface Props {
  choosedCate: any;
  handleOpenEditModal: (value: any) => void;
  handleOpenDeleteModal: (value: any) => void;
  nameTitle: string;
}

export const DetailCate: React.FC<Props> = ({
  choosedCate,
  handleOpenDeleteModal,
  handleOpenEditModal,
  nameTitle,
}) => {
  const [conditionValue, setConditionValue] = useState("vi");

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.leftHeader}>
          <div className={styles.iconUserContainer}>
            {choosedCate.avatar_url ? (
              <img
                src={choosedCate.avatar_url}
                className={styles.iconUser}
                alt={choosedCate.avatar_url}
              />
            ) : (
              <UserIcon className={styles.iconUser} />
            )}
          </div>
          <div className={styles.nameUser}>{choosedCate.name}</div>
        </div>
        <div className={styles.rightHeader}>
          <Space className={styles.spaceStyle}>
            <EditOutlined
              title={"Sửa " + nameTitle}
              onClick={handleOpenEditModal}
              className={styles.edit}
            />

            <DeleteOutlined
              title={"Xoá " + nameTitle}
              onClick={handleOpenDeleteModal}
              className={styles.delete}
            />
          </Space>
        </div>
      </div>
      <div className={styles.body}>
        <Items title={"Tên " + nameTitle + ":"} value={choosedCate.name} isNotLink={true} />
        {/* <Items title={"Loại cấu hình:"} value={choosedCate.status} isNotLink={true} /> */}
        <Items title={"Link Facebook:"} value={choosedCate.facebook_link} />
        <Items title={"Link Twitter:"} value={choosedCate.twitter_link} />
        <Items title={"Link Profile:"} value={choosedCate.profile_link} />
        <Items title={"Profile:"} value={choosedCate.profile} isNotLink={true} />
        <div className={styles.conditionContainer}>
          <div className={styles.titleConditionContainer}>Điều kiện:</div>
          <div className={styles.allOptionContainer}>
            <div className={styles.allItemCondition}>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "vi"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    setConditionValue("vi");
                  }}
                >
                  Tiếng Việt
                </div>
              </div>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "en"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    setConditionValue("en");
                  }}
                >
                  Tiếng Anh
                </div>
              </div>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "cn"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    setConditionValue("cn");
                  }}
                >
                  Tiếng Trung
                </div>
              </div>
              <div className={styles.conditionOptionContainer}>
                <div
                  className={
                    conditionValue === "ru"
                      ? styles.conditionOptionType1
                      : styles.conditionOptionType2
                  }
                  onClick={() => {
                    setConditionValue("ru");
                  }}
                >
                  Tiếng Nga
                </div>
              </div>
            </div>
            <div className={styles.detailOptionItemContainer}>
              <div className={styles.detailOptionItem}>
                {conditionValue === "vi"
                  ? choosedCate.keywords.vi
                  : conditionValue === "en"
                  ? choosedCate.keywords.en
                  : conditionValue === "cn"
                  ? choosedCate.keywords.cn
                  : conditionValue === "ru"
                  ? choosedCate.keywords.ru
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ItemProps {
  title: string;
  value: any;
  isNotLink?: boolean;
}

const Items: React.FC<ItemProps> = ({ title, value, isNotLink }) => {
  return (
    <div className={styles.itemContainer}>
      <div className={styles.titleItemContainer}>{title}</div>
      <div className={styles.valueItemContainer}>
        {isNotLink ? (
          <div className={styles.valueItem}>{value}</div>
        ) : (
          <a target="_blank" rel="noreferrer" href={value.toString()}>
            {value}
          </a>
        )}
      </div>
    </div>
  );
};
