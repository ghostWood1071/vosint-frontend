import { StatusNewsLoad } from "@/assets/svg";
import { useHotNewsToday } from "@/services/dashboard.loader";
import { Spin } from "antd";
import React from "react";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { SwiperItem } from "./component/swiper-item";
import styles from "./hot-news.module.less";

export const HotNews: React.FC = () => {
  const { data, isLoading } = useHotNewsToday();

  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Số lượng tin nóng trong ngày</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.numberHotNewsContainer}>
            <div className={styles.numberHotNews}>
              <div className={styles.number}>{data?.result?.length}</div>
              <div className={styles.statusNews}>
                <div>
                  <StatusNewsLoad />
                </div>
                <div className={styles.titleStatus}>tin</div>
              </div>
            </div>
          </div>
          <div className={styles.swiperNewsContainer}>
            <div className={styles.swiperContainer}>
              <Spin spinning={isLoading}>
                <Swiper
                  rewind={true}
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  navigation={true}
                  modules={[Autoplay, Navigation]}
                >
                  {data?.result?.map((item: any) => {
                    return (
                      <SwiperSlide key={item?.event_name}>
                        <SwiperItem
                          title={item?.event_name}
                          content={item?.event_content}
                          dateCreated={item?.date_created}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
