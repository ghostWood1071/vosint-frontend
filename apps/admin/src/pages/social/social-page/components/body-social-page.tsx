import { Input, Radio } from "antd";
import React, { useState } from "react";

import { Post } from "../../components/post";
import { Statistic } from "../components/statistic";
import styles from "./body-social-page.module.less";

interface BodySocialPageProps {
  postData: any[];
  statisticData: any;
}

export const BodySocialPage: React.FC<BodySocialPageProps> = ({ postData, statisticData }) => {
  const [tabButton, setTabButton] = useState("baidang");
  function handleTabButton(type: string) {
    setTabButton(type);
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.topButtonContainer}>
        <div className={styles.tabButtonContainer}>
          <Radio.Group
            size={"large"}
            value={tabButton}
            buttonStyle="solid"
            onChange={(e) => {
              handleTabButton(e.target.value);
            }}
          >
            <Radio.Button value="baidang">Danh sách bài đăng</Radio.Button>
            <Radio.Button value="thongke">Thống kê</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.searchButton}>
          <Input.Search placeholder="Tìm kiếm" />
        </div>
      </div>
      <div className={styles.content}>
        {tabButton === "baidang" ? (
          <Post data={postData} pageSize={30} />
        ) : (
          <Statistic data={statisticData} />
        )}
      </div>
    </div>
  );
};
