import React from "react";
import { useSearchParams } from "react-router-dom";

// import { NewsCarousel } from "../components/news-carousel";
import { NewsTable } from "../components/news-table";
import { useNewsList } from "../news.loader";

interface Props {}

export const NewsListPage: React.FC<Props> = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useNewsList({
    order: "modified_at",
    skip: searchParams.get("page_number") ?? 1,
    limit: searchParams.get("page_size") ?? 10,
  });

  return (
    <>
      {/* <NewsCarousel data={Array.isArray(data) ? data : []} /> */}
      <NewsTable
        isLoading={isLoading}
        dataSource={data?.result}
        total_record={data?.total_record}
      />
    </>
  );
};
