import { getNewsList } from "@/common/_helper";
import { useNewsSelection } from "@/components/news/news-state";
import { ControlOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Modal, Row, Spin, Tooltip, message } from "antd";
import { useState } from "react";

import { useGetNewsSummaryLazy } from "../news.loader";
import { RatioSummary } from "./news-detail/components/news-detail-summary/ratio";
import styles from "./news-filter.module.less";

const NewsEventSummaryModal = ({ item }: { item: any }) => {
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = useGetNewsSummaryLazy({
    onSuccess: (data) => {
      setData(data);
    },
  });

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSummaryChange = (value: number) => {
    setOpen(true);
    mutate({
      k: value + "",
      description: "",
      paras: newList.map((n: any) => n?.["data:content"] ?? "").join("\n"),
      title: newList.map((n: any) => n["data:title"] ?? "").join("\n"),
    });
  };

  function handleNewsSummary() {
    if (newList.length == 0) {
      message.success({
        content: "Sự kiện không thể tóm tắt đa tin vì chưa có nguồn tin",
      });
      return;
    }

    setOpen(true);
    mutate({
      k: "0.2",
      description: "",
      paras: newList.map((n: any) => n?.["data:content"] ?? "").join("\n"),
      title: newList.map((n: any) => n?.["data:title"] ?? "").join("\n"),
    });
  }

  const newList = item && getNewsList(item);

  return (
    <>
      {/* <Button
        className={styles.item}
        style={{ borderColor: newsSelectionIds.length === 0 ? "rgb(230,230,230)" : "#1890ff" }}
        disabled={newsSelectionIds.length === 0}
        onClick={handleNewsSummary}
      >
        Tóm tắt tin ({newsSelectionIds.length})
      </Button> */}
      <Tooltip title={"Tóm tắt"}>
        <ControlOutlined className={styles.iconFilterContent} onClick={handleNewsSummary} />
      </Tooltip>

      <Modal
        title="Tóm tắt đa tin"
        open={open}
        onCancel={handleCancel}
        footer={null}
        width={"50%"}
        destroyOnClose={true}
      >
        <Row className={styles.summary_top}>
          <Col span={12}>
            <div className={styles.ratio}>
              <div className={styles.ratio_text}>Tỉ lệ tóm tắt</div>
              <div className={styles.detail_ratio}>
                <RatioSummary onAfterChange={handleSummaryChange} defaultValue={0.2} />
              </div>
            </div>
          </Col>
        </Row>

        <div className={styles.summary_bottom}>
          <Spin spinning={isLoading}>
            <Alert
              message="Kéo thanh slider để xem văn bản tóm tắt"
              type="info"
              showIcon
              closable
            />
            <div className={styles.summary_detail}>{data}</div>
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default NewsEventSummaryModal;
