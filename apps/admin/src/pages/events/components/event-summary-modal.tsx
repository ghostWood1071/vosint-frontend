import { RatioSummary } from "@/components/ratio/ratio";
import { useGetNewsSummaryLazy } from "@/pages/news/news.loader";
import { Alert, Button, Col, Modal, Row, Spin } from "antd";
import { useState } from "react";

import { useGetEventSummaryLazy } from "../event.loader";
import styles from "./event-summary-modal.module.less";

const EventSummaryModal = ({
  eventChoosedList,
  isUserEvent,
}: {
  eventChoosedList: any;
  isUserEvent: boolean;
}) => {
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false);

  const eventIds: string[] = eventChoosedList.map((event: any) => event?._id);

  const { mutate, isLoading } = useGetEventSummaryLazy({
    onSuccess: (data) => {
      setData(Object.values(data)[0]);
    },
  });
  // close modal
  const handleCancel = () => {
    setOpen(false);
  };

  // change ratio k
  const handleSummaryChange = (value: Number) => {
    setOpen(true);
    mutate({
      k: value + "",
      lang: "",
      paras: !isUserEvent
        ? eventChoosedList
            .map((event: any) => event?.["event_content"].replaceAll("..", ".\n") ?? "")
            .join("\n")
        : eventChoosedList
            .map(
              (event: any) =>
                JSON.parse(
                  event?.["event_content"],
                ).root?.children[0]?.children[0]?.text.replaceAll("..", ".\n") ?? "",
            )
            .join("\n"),
      title: eventChoosedList.map((event: any) => event?.["event_name"] ?? "").join("\n"),
    });
  };

  // click summary
  const handleEventSummary = () => {
    setOpen(true);
    mutate({
      k: "0.2",
      lang: "",
      paras: !isUserEvent
        ? eventChoosedList
            .map((event: any) => event?.["event_content"].replaceAll("..", ".\n") ?? "")
            .join("\n")
        : eventChoosedList
            .map(
              (event: any) =>
                JSON.parse(
                  event?.["event_content"],
                ).root?.children[0]?.children[0]?.text.replaceAll("..", ".\n") ?? "",
            )
            .join("\n"),
      title: eventChoosedList.map((event: any) => event?.["event_name"] ?? "").join("\n"),
    });
  };

  return (
    <>
      <Button
        className={styles.item}
        style={{ borderColor: eventIds.length === 0 ? "rgb(230,230,230)" : "#1890ff" }}
        disabled={eventIds.length === 0}
        onClick={handleEventSummary}
      >
        Tóm tắt đa sự kiện ({eventIds.length})
      </Button>
      <Modal
        title="Tóm tắt đa sự kiện"
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

export default EventSummaryModal;
