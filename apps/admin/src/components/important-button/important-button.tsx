import { Tooltip } from "antd";
import styles from "./important-button.module.less";

interface Props {
  item?: any;
  handleClickImportant?: () => void;
  style?: any;
}

const ImportantButton: React.FC<Props> = ({ item, handleClickImportant, style }) => {
  return (
    <>
      <Tooltip  
          title={item.isBell ? "Xoá khỏi tin quan trọng" : "Thêm vào tin quan trọng"}>
        <div
          className={`${styles.iconImportant} ${item.isBell ? styles.fill : styles.default}`}
          style={{
            backgroundSize: style && (item.isBell ? "24px" : style.backgroundSize),
            top: style && style.top,
            left: style && style.left,
          }}
          onClick={handleClickImportant}
        ></div>
      </Tooltip>
    </>
  );
};

export default ImportantButton;
