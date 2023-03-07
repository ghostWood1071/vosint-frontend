import { useGetNewsSummaryLazy } from "@/pages/news/news.loader";
import { Alert, Col, Row, Spin } from "antd";
import React, { useState } from "react";

import styles from "./news-detail-summary.module.less";
import { RatioSummary } from "./ratio";

interface Props {
  content?: string;
  title?: string;
}

export const NewDetailSummary: React.FC<Props> = ({ content, title }) => {
  const [dataSumm, setDataSumm] = useState("");

  const { mutate, isLoading } = useGetNewsSummaryLazy({
    onSuccess: (data) => {
      setDataSumm(data);
    },
  });

  return (
    <Row>
      <Col span={12}>
        <div className={styles.summary_top}>
          <Col span={12}>
            <p>Trích rút văn bản</p>
          </Col>
          <Col span={12}>
            <div className={styles.ratio}>
              <div className={styles.ratio_text}>Tỉ lệ tóm tắt</div>
              <div className={styles.detail_ratio}>
                <RatioSummary onAfterChange={handleSummChange} />
              </div>
            </div>
          </Col>
        </div>
        <div className={styles.summary_bottom}>
          <Spin spinning={isLoading}>
            <Alert
              message="Kéo thanh slider để xem văn bản được trích xuất"
              type="info"
              showIcon
              closable
            />
            <div className={styles.summary_detail}>{dataSumm}</div>
          </Spin>
        </div>
      </Col>
      <Col span={12}>
        <div className={styles.summary_top}>
          <Col span={12}>
            <p>Tóm tắt văn bản</p>
          </Col>
          <Col span={12}>
            <div className={styles.ratio}>
              <div className={styles.ratio_text}>Tỉ lệ tóm tắt</div>
              <div className={styles.detail_ratio}>
                <RatioSummary />
              </div>
            </div>
          </Col>
        </div>
        <div className={styles.summary_bottom}>
          <div className={styles.summary_detail}></div>
        </div>
      </Col>
    </Row>
  );

  function handleSummChange(value: number) {
    mutate({
      k: value + "",
      description: "",
      paras: content ?? "",
      title: title ?? "",
    });
  }
};
