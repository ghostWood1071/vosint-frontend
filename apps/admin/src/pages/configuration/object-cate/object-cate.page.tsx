import React from "react";

import { BodyCate } from "../components/cate-config/body-cate";
import { useMutationObjectCate, useObjectCate } from "../config.loader";

export const ObjectCate = () => {
  const { data } = useObjectCate();
  console.log("this is data", data);
  const { mutate, isLoading: isObjectCateLoading } = useMutationObjectCate();
  return (
    <BodyCate
      title={"đối tượng"}
      dataTable={data}
      functionAdd={handleAdd}
      functionDelete={handleDelete}
      functionEdit={handleUpdate}
      confirmLoading={isObjectCateLoading}
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
