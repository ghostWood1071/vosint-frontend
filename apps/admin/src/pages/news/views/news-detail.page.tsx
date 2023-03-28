import { useNewsSelection } from "@/components/news/news-state";
import { useGetMe } from "@/pages/auth/auth.loader";
import { Checkbox, List } from "antd";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { shallow } from "zustand/shallow";

import { NewsItem } from "../components/news-item";
import { useNewsFilter } from "../news.context";
import {
  useDeleteNewsInNewsletter,
  useNewsByNewsletter,
  useNewsIdToNewsletter,
} from "../news.loader";
import styles from "./news-detail.module.less";

export const NewsDetailPage = () => {
  let { newsletterId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newsSelection, setNewsSelection] = useNewsSelection(
    (state) => [state.newsSelection, state.setNewsSelection],
    shallow,
  );
  const newsFilter = useNewsFilter();
  const [filter, setFilter] = useState<Record<string, any>>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilter(newsFilter);
    }, 800);
    return () => clearTimeout(timeout);
  }, [newsFilter]);

  const { data, isLoading } = useNewsByNewsletter(newsletterId!, {
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
    ...filter,
  });
  const { data: dataIAm, isLoading: isLoadingIAm } = useGetMe();

  const { mutateAsync: mutateDelete } = useDeleteNewsInNewsletter();
  const { mutate: mutateAdd } = useNewsIdToNewsletter();
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const page = searchParams.get("page_number");
  const pageSize = searchParams.get("page_size");
  const dataSource = data?.result.map((e: any) => ({
    ...e,
    isStar: dataIAm?.news_bookmarks.includes(e._id),
    isBell: dataIAm?.vital_list.includes(e._id),
  }));

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
        pagination={{
          position: "bottom",
          onChange: handlePaginationChange,
          current: page ? +page : 1,
          pageSize: pageSize ? +pageSize : 10,
          size: "default",
          total: data?.total_record,
        }}
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
        loading={isLoading || isLoadingIAm}
      />
      <div className={styles.footer} />
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

  function handlePaginationChange(page: number, pageSize: number) {
    searchParams.set("page_number", page + "");
    searchParams.set("page_size", pageSize + "");
    setSearchParams(searchParams);
  }
};
