import React from "react";
import { OrganizationsCarousel } from "../components/organizations-carousel";
import { OrganizationsTable } from "../components/organizations-table";
import { useNewsList } from "../organizations.loader";

interface Props {}

export const OrganizationsListPage: React.FC<Props> = () => {
  const { data } = useNewsList();

  return (
    <>
      <OrganizationsCarousel data={Array.isArray(data) ? data : []} />
      <OrganizationsTable dataSource={Array.isArray(data) ? data : []} />
    </>
  );
};
