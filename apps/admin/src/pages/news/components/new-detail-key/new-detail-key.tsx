import { Col, Row } from "antd";
import React from "react";

import KeyData from "./key.data.json";
import styles from "./new-detail-key.module.less";

interface ModalMainKey {
  isOpen: boolean;
  onClose: () => void;
}
export const NewKey: React.FC<ModalMainKey> = ({ isOpen, onClose }) => {
  const overLayrefMainContent = React.useRef(null);
  const handleOverlayClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === overLayrefMainContent.current) {
      onClose();
    }
  };
  return isOpen ? (
    <Row onClick={handleOverlayClick} ref={overLayrefMainContent} className={styles.key_body}>
      {KeyData.map((data) => {
        return (
          <Col
            className={styles.new_key}
            key={data.id}
            onClick={() => {
              console.log(data.title);
            }}
          >
            <p>{data.title}</p>
          </Col>
        );
      })}
    </Row>
  ) : null;
};
