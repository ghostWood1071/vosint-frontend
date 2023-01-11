import { FileTextOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Modal, PageHeader, Radio } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import styles from "./synthetic-report.module.less";

export const QuickReport: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div id="quick-report" className={classNames(styles.root, "modal-mount")}>
      <PageHeader
        title="Báo cáo 8:30, 22-11-2021"
        extra={[
          <Button icon={<SaveOutlined />}>Lưu báo cáo</Button>,
          <Button type="primary" icon={<FileTextOutlined />} onClick={showModal}>
            Xuất báo cáo
          </Button>,
        ]}
      />
      <Radio.Group className={styles.radioGroup} defaultValue="noi-bat">
        <Radio.Button value="noi-bat">Tin tức nổi bật</Radio.Button>
        <Radio.Button value="trong-nuoc">Tin tức trong nước</Radio.Button>
        <Radio.Button value="khu-vuc">Tin tức khu vực</Radio.Button>
        <Radio.Button value="quoc-te">Tin tức quốc tế</Radio.Button>
        <Radio.Button value="tin-nhanh">Tin nhanh</Radio.Button>
        <Radio.Button value="lich-su">Lịch sử thu thập</Radio.Button>
      </Radio.Group>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        getContainer="#quick-report"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};
