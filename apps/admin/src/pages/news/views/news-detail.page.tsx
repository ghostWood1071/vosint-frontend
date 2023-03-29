import { useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { Checkbox, List } from "antd";
import lodash from "lodash";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams, useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { NewsItem } from "../components/news-item";
import { useNewsFilter } from "../news.context";
import {
  useDeleteNewsInNewsletter,
  useInfiniteNewsByNewsletter,
  useNewsIdToNewsletter,
} from "../news.loader";
import styles from "./news-detail.module.less";

export const NewsDetailPage = () => {
  let { newsletterId } = useParams();
  const [searchParams] = useSearchParams();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const { ref, inView } = useInView();
  const skip = searchParams.get("page_number") ?? 1;

  const { data, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteNewsByNewsletter(
      newsletterId!,
      {
        skip: skip ?? 1,
        limit: 30,
      },
      {
        getNextPageParam: (lastPage: any) => {
          if (Number(skip) * 10 < lastPage.total_record) {
            return { skip: (Number(skip) + 1).toString(), limit: 30 };
          }
          return undefined;
        },
      },
    );
  const { data: dataIAm, isLoading: isLoadingIAm } = useGetMe();

  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const dataSource = lodash.unionBy(
    lodash.flatMap(
      data?.pages.map((a) =>
        a?.result?.map((e: any) => ({
          ...e,
          isStar: dataIAm?.news_bookmarks.includes(e._id),
          isBell: dataIAm?.vital_list.includes(e._id),
        })),
      ),
    ),
    "_id",
  );

  useEffect(() => {
    if (newsSelection.length === 0) {
      setCheckAll(false);
      setIndeterminate(false);
    } else if (newsSelection.length >= dataSource.length) {
      setCheckAll(true);
      setIndeterminate(false);
    } else {
      setCheckAll(false);
      setIndeterminate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsSelection, dataSource]);
  React.useEffect(() => {
    if (inView && skip !== undefined && data?.pages[0]?.result.length >= 10) {
      fetchNextPage();
      searchParams.set("page_number", (Number(skip) + 1).toString());
      console.log("hello");
    }
    console.log(inView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleListContainer}>
        <div className={styles.container1}></div>
        <div className={styles.container2}>
          <Checkbox indeterminate={indeterminate} checked={checkAll} onClick={handleCheckAllBox} />
        </div>
        <div className={styles.container3}>Hành động</div>
        <div className={styles.container5}>Tiêu đề</div>
        <div className={styles.container6}>Link</div>
        <div className={styles.container7}>Thời gian</div>
        <div className={styles.container8}></div>
      </div>
      <List
        itemLayout="vertical"
        size="small"
        dataSource={dataSource}
        renderItem={(item) => {
          return (
            <NewsItem
              item={item}
              type="edit"
              onDelete={handleDelete}
              onAdd={handleAdd}
              lengthDataSource={dataSource?.length}
              setIndeterminate={setIndeterminate}
            />
          );
        }}
        // loading={isLoading || isLoadingIAm}
      />
      <div>
        {skip >= 1 ? (
          <button
            ref={ref}
            onClick={() => {
              fetchNextPage();
              searchParams.set("page_number", (Number(skip) + 1).toString());
            }}
            disabled={!hasNextPage || isFetchingNextPage}
            style={{ padding: 0, margin: 0, border: 0 }}
          >
            {isFetchingNextPage ? "Loading more..." : ""}
          </button>
        ) : null}
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
      {/* <div className={styles.footer} /> */}
    </div>
  );

  function handleCheckAllBox() {
    if (checkAll) {
      setNewsSelection([]);
    } else {
      setNewsSelection(dataSource);
    }
    setIndeterminate(false);
    setCheckAll(!checkAll);
  }

  function handleDelete(newsId: string, tag = newsletterId) {
    // setNewsSelection([...newsSelection].filter((e) => e._id !== newsId));
    return mutateDelete(
      {
        newsId: [newsId],
        newsletterId: tag!,
      },
      {
        onSuccess: (data, variables) => {
          setNewsSelection([...newsSelection].filter((e) => e._id !== variables.newsId[0]));
        },
      },
    );
  }

  function handleAdd(newsId: string, tag = newsletterId) {
    return mutateAdd({
      newsIds: [newsId],
      newsletterId: tag!,
    });
  }
};
