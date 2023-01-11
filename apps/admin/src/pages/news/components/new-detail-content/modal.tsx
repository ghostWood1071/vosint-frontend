import { Button, Col, Modal, Row, Space } from "antd";
import React, { useState } from "react";
import classNames from "classnames";
import style from "./new-detail-content.module.less";
import styles from "../../../reports/views/synthetic-report.module.less";
import { NAVBAR_NEW } from "../new-detail-content/new.navbar";
import { BellIcon, StarIcon, HeartIcon, TickIcon, CartIcon } from "@/assets/svg";

export const NewDetailModal: React.FC = () => {
  const [modal1Open, setModal1Open] = useState(false);

  return (
    <>
      <div id="quick-report" className={classNames(styles.root, "modal-mount")}>
        <Button type="primary" onClick={() => setModal1Open(true)}>
          Show
        </Button>
        <Modal
          width={"100%"}
          visible={modal1Open}
          onOk={() => setModal1Open(false)}
          onCancel={() => setModal1Open(false)}
        >
          <div className={style.new_detail_container}>
            <div>
              <Row align="middle">
                <Col span={8}>
                  <Space size={24} wrap>
                    <HeartIcon />
                    <StarIcon />
                    <BellIcon />
                    <CartIcon />
                  </Space>
                </Col>
                <Col span={8}>Dự báo thời tiết 10/5: Mưa giông tiếp tục hoành hành miền Bắc</Col>
                <Col span={8} push={3}>
                  <Space wrap>
                    <div className={style.new_detail_url}>kienthuc.net.vn</div>
                    <div className={style.new_detail_date}>2022-05-10</div>
                    <div className={style.new_detail_option}>
                      <TickIcon />
                    </div>
                  </Space>
                </Col>
              </Row>
            </div>
            <hr style={{ color: "#A6A6A6" }} />
            <div>
              <NAVBAR_NEW />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
