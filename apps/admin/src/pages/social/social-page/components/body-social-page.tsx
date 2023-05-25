import { Radio } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { Post } from "../../components/post";
import { CACHE_KEYS_SOCIAL, useInfiniteSocialPageList } from "../../social.loader";
import { Statistic } from "../components/statistic";
import styles from "./body-social-page.module.less";

interface BodySocialPageProps {
  type: string;
  statisticData: any;
}

export const BodySocialPage: React.FC<BodySocialPageProps> = ({ type, statisticData }) => {
  const { ref, inView } = useInView();
  const [pageNumber, setPageNumber] = useState(1);
  const queryClient = useQueryClient();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteSocialPageList({
    name: type,
  });

  const dataSource = unionBy(flatMap(data?.pages.map((a) => a?.result?.map((e: any) => e))), "_id");
  useEffect(() => {
    if (inView && pageNumber * 30 <= data?.pages[0].total_record) {
      setPageNumber(pageNumber + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS_SOCIAL.SocialPage]);
    setPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fetchNextPage({ pageParam: { page_number: pageNumber, page_size: 50 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);
  const [tabButton, setTabButton] = useState("baidang");
  function handleTabButton(type: string) {
    setTabButton(type);
  }
  return (
    <div className={styles.mainContainer}>
      <div className={styles.topButtonContainer}>
        <div className={styles.tabButtonContainer}>
          <Radio.Group
            size={"large"}
            value={tabButton}
            buttonStyle="solid"
            onChange={(e) => {
              handleTabButton(e.target.value);
            }}
          >
            <Radio.Button value="baidang">Danh sách bài đăng</Radio.Button>
            <Radio.Button value="thongke">Thống kê</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className={styles.content}>
        {tabButton === "baidang" ? (
          <>
            <Post data={dataSource} pageSize={30} />
            <div>
              {pageNumber >= 1 ? (
                <button
                  ref={ref}
                  disabled={!hasNextPage || isFetchingNextPage}
                  style={{ padding: 0, margin: 0, border: 0 }}
                >
                  {isFetchingNextPage ? "Đang lấy thêm tin..." : ""}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <Statistic data={statisticData} />
        )}
      </div>
    </div>
  );
};
