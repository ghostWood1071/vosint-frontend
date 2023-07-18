import { Empty } from "antd";
import { flatMap, unionBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "react-query";

import { NewsFilterTTXVN } from "../components/news-filter-ttxvn";
import { NewsTableTTXVN } from "../components/news-table-ttxvn";
import { useNewsFilter } from "../news.context";
import { CACHE_KEYS, useGetNewsFromTTXVNInfinite } from "../news.loader";
import styles from "./news-ttxvn.module.less";

interface Props {}

export const NewsTTXVNPage: React.FC<Props> = () => {
  const [skip, setSkip] = useState(1);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const newsFilter = useNewsFilter();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetNewsFromTTXVNInfinite(newsFilter);

  const dataSource = unionBy(
    flatMap(
      data?.pages.map((a) =>
        a?.result?.map((e: any) => ({
          ...e,
        })),
      ),
    ),
    "_id",
  );

  useEffect(() => {
    queryClient.removeQueries([CACHE_KEYS.NewsList]);
    fetchNextPage({ pageParam: { page_number: 1, page_size: 50 } });
    setSkip(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsFilter]);

  useEffect(() => {
    if (inView && skip * 50 < data?.pages[data?.pages.length - 1].total_record) {
      fetchNextPage({ pageParam: { page_number: skip + 1, page_size: 50 } });
      setSkip(skip + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      <NewsFilterTTXVN />
      <div className={styles.mainContainer}>
        <div className={styles.bodyNews}>
          <table style={{ width: "100%" }}>
            <tbody>
              {dataSource[0] !== undefined ? (
                dataSource?.map((item) => <NewsTableTTXVN key={item?._id} item={item} />)
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Trống"} />
              )}
            </tbody>
          </table>
          <div>
            {skip >= 1 ? (
              <button
                ref={ref}
                disabled={!hasNextPage || isFetchingNextPage}
                style={{ padding: 0, margin: 0, border: 0 }}
              >
                {isFetchingNextPage ? "Đang lấy tin..." : ""}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
