import { Radio } from "antd";
import { useState } from "react";

import { NewKey } from "../new-detail-key/new-detail-key";
import { NewDetailMainContent } from "../new-detail-main-content/new-detail-maincontent";
import { NewDetailSummary } from "../new-detail-summary/new-detail-summary";
import styles from "./new-navbar.module.less";

export const NAVBAR_NEW = () => {
  const [isModalOpen, setModalState] = useState("");
  const toggleModal = () => setModalState("");
  return (
    <>
      <div className={styles.new_nav_bar}>
        <Radio.Group className={styles.radioGroup} defaultValue="noi-dung">
          <Radio.Button value="noi-dung" onClick={() => setModalState("a")}>
            Nội dung
          </Radio.Button>
          <Radio.Button value="tom-tat" onClick={() => setModalState("b")}>
            Tóm tắt
          </Radio.Button>
          <Radio.Button value="mind-map">Mind map</Radio.Button>
          <Radio.Button value="tu-khoa" onClick={() => setModalState("c")}>
            Từ khóa
          </Radio.Button>
          <Radio.Button value="tin-lien-quan">Tin liên quan</Radio.Button>
        </Radio.Group>
      </div>

      <div>
        {isModalOpen === "a" && (
          <NewDetailMainContent isOpen={isModalOpen === "a"} onClose={toggleModal} />
        )}
        <NewDetailSummary isOpen={isModalOpen === "b"} onClose={toggleModal} />
        <NewKey isOpen={isModalOpen === "c"} onClose={toggleModal} />
      </div>
    </>
  );
};
