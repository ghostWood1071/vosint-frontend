import { Col, Row } from "antd";
import React from "react";

import styles from "./news-detail-summary.module.less";
import { RatioSummary } from "./ratio";

interface ModalSummary {}
export const NewDetailSummary: React.FC<ModalSummary> = () => {
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
                <RatioSummary />
              </div>
            </div>
          </Col>
        </div>
        <div className={styles.summary_bottom}>
          <div className={styles.summary_detail}>
            Dự báo thời tiết ngày 10/5, mưa giông tiếp tục hoành hành nhiều khu vực ở miền Bắc, đặc
            biệt vào chiều tối.Theo Trung tâm dự báo khí tượng thủy văn quốc gia, từ hôm nay (10/5)
            đến ngày mai, ở Bắc Bộ tiếp tục có mưa rào và giông, cục bộ có mưa vừa, mưa to, với
            lượng mưa khoảng 30-60mm/24h, có nơi trên 80mm/24h.Nguy cơ xảy ra lũ quét, sạt lở đất
            tại các tỉnh miền núi và ngập úng tại các khu vực trũng, thấp.Hà Nội và nhiều tỉnh,
            thành trên cả nước tiếp tục có mưa giông vài rải rác.Dự báo thời tiết các vùng trên cả
            nước ngày 10/5: Phía Tây Bắc Bộ Nhiều mây, chiều tối có mưa rào và giông rải rác, ngày
            có mưa rào và giông vài nơi.
          </div>
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
          <div className={styles.summary_detail}>
            Dự báo thời tiết ngày 10/5 mưa giông tiếp tục hoành hành nhiều khu vực ở miền bắc đặc
            biệt vào chiều tối. Hà nội và nhiều tỉnh thành trên cả nước tiếp tục có mưa giông vài
            rải rác. Dự báo thời tiết các vùng trên cả nước ngày 10/5:
            <br /> phía tây bắc bộ
            <br /> nhiều mây chiều tối có mưa rào và giông rải rác ngày có mưa rào và giông vài nơi.
            Phía đông bắc bộ
            <br />
            nhiều mây chiều tối có mưa rào và giông rải rác ngày có mưa rào và giông vài nơi.
          </div>
        </div>
      </Col>
    </Row>
  );
};
