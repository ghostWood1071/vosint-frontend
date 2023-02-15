import React from "react";
import { useSearchParams } from "react-router-dom";

// import { NewsCarousel } from "../components/news-carousel";
import { NewsTable } from "../components/news-table";
import { useNewsList } from "../news.loader";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const [searchParams] = useSearchParams();
  const { data } = useNewsList({
    order: "modified_at",
    page_number: searchParams.get("page_number") ?? 1,
    page_size: searchParams.get("page_size") ?? 10,
  });

  return (
    <>
      {/* <NewsCarousel data={Array.isArray(data) ? data : []} /> */}
      <NewsTable dataSource={data?.result} total_record={data?.total_record} />
    </>
  );
};
