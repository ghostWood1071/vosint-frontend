import { EditTwoTone, PlusCircleTwoTone, SaveTwoTone } from "@ant-design/icons";
import { Button, Col, Image, Input, Modal, Row, Select, Space, message } from "antd";
import React, { useState } from "react";

import styles from "./relationship-graph.module.less";

export const RelationshipGraph = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Row className={styles.row}>
        <Col span={24} className={styles.col}>
          <Space size={20}>
            <Select placeholder="Đối tượng" />
            <Select placeholder="Quan hệ" />
            <Button icon={<PlusCircleTwoTone />} onClick={() => setOpen(true)}>
              Tạo mới
            </Button>
            <Button icon={<EditTwoTone />}>Sửa</Button>
            <Button icon={<SaveTwoTone />}>Lưu</Button>
          </Space>

          <Modal
            title="Thêm đồ thị"
            centered
            open={open}
            onCancel={() => setOpen(false)}
            okText="Thêm"
            onOk={handleOK}
          >
            <Input placeholder="Tên đồ thị" />
          </Modal>

          <h3 className={styles.title}>ĐỒ THỊ QUAN HỆ QUỐC TẾ</h3>
          <Image src="/images/1.png" preview={false} />
        </Col>
      </Row>
    </>
  );

  function handleOK() {
    message.success("Đã thêm vào danh sách đồ thị");
    setOpen(false);
  }
};
