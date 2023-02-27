import React from "react";

import { BodyCate } from "../components/cate-config/body-cate";
import { useMutationOrganizationCate, useOrganizationCate } from "../config.loader";

export const OrganizationCate = () => {
  const { data } = useOrganizationCate();
  const { mutate, isLoading: isOrganizationCateLoading } = useMutationOrganizationCate();
  return (
    <BodyCate
      title="tổ chức"
      dataTable={data}
      functionAdd={handleAdd}
      functionDelete={handleDelete}
      functionEdit={handleUpdate}
      confirmLoading={isOrganizationCateLoading}
    />
  );

  function handleAdd(value: any) {
    mutate({ ...value, action: "add" });
  }

  function handleUpdate(value: any) {
    mutate({ ...value, action: "update" });
  }

  function handleDelete(value: any) {
    mutate({ ...value, action: "delete" });
  }
};
