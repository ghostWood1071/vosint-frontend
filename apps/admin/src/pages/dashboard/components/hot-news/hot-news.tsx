import { StatusNewsLoad } from "@/assets/svg";
import React from "react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { SwiperItem } from "./component/swiper-item";
import styles from "./hot-news.module.less";

interface HotNewsProps {
  dataSwiper: object[];
  numberItemSwiper: number;
}

export const HotNews: React.FC<HotNewsProps> = ({ dataSwiper, numberItemSwiper }) => {
  return (
    <div className={styles.mainBody}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>Số lượng tin nóng trong ngày</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          <div className={styles.numberHotNewsContainer}>
            <div className={styles.numberHotNews}>
              <div className={styles.number}>10</div>
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
              <Swiper
                slidesPerView={numberItemSwiper}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation, Pagination]}
                className={styles.swiper}
              >
                {dataSwiper.map((item: any, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <SwiperItem index={index} title={item.title} imageUrl={item.imageUrl} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
