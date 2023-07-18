import { useNewsSelection } from "@/components/news/news-state";
import { Alert, Button, Col, Modal, Row, Spin } from "antd";
import { useState } from "react";

import { useGetNewsSummaryLazy } from "../news.loader";
import { RatioSummary } from "./news-detail/components/news-detail-summary/ratio";
import styles from "./news-filter.module.less";

export function NewsSummaryModal(): JSX.Element {
  const [dataSumms, setDataSumms] = useState("");
  const [newsSelection] = useNewsSelection((state) => [state.newsSelection]);
  const newsSelectionIds: string[] = newsSelection.map((i) => i?._id);

  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = useGetNewsSummaryLazy({
    onSuccess: (data) => {
      setDataSumms(data);
    },
  });

  return (
    <>
      <Button
        className={styles.item}
        style={{ borderColor: newsSelectionIds.length === 0 ? "rgb(230,230,230)" : "#1890ff" }}
        disabled={newsSelectionIds.length === 0}
        onClick={handleNewsSummary}
      >
        Tóm tắt tin ({newsSelectionIds.length})
      </Button>
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
                <RatioSummary onAfterChange={handleSummsChange} defaultValue={0.2} />
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
            <div className={styles.summary_detail}>{dataSumms}</div>
          </Spin>
        </div>
      </Modal>
    </>
  );

  function handleCancel() {
    setOpen(false);
  }

  function handleSummsChange(value: number) {
    setOpen(true);
    mutate({
      k: value + "",
      description: "",
      paras: newsSelection.map((n) => n?.["data:content"] ?? "").join("\n"),
      title: newsSelection.map((n) => n["data:title"] ?? "").join("\n"),
    });
  }

  function handleNewsSummary() {
    setOpen(true);
    mutate({
      k: "0.2",
      description: "",
      paras: newsSelection.map((n) => n?.["data:content"] ?? "").join("\n"),
      title: newsSelection.map((n) => n?.["data:title"] ?? "").join("\n"),
    });
  }
}
