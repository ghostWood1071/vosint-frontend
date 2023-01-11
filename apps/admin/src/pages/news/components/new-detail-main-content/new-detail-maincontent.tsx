import React from "react";
import styles from "./detail-content.module.less";
interface ModalMainContent {
  isOpen: boolean;
  onClose: () => void;
}
export const NewDetailMainContent: React.FC<ModalMainContent> = ({ isOpen, onClose }) => {
  const overLayrefMainContent = React.useRef(null);
  const handleOverlayClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.target === overLayrefMainContent.current) {
      onClose();
    }
  };
  return isOpen ? (
    <>
      <div onClick={handleOverlayClick} ref={overLayrefMainContent}>
        <div className={styles.content_body}>
          <p>This is main content</p>
        </div>
      </div>
    </>
  ) : null;
};
