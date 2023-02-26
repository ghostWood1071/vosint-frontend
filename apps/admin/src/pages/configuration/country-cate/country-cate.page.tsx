import React from "react";

import { BodyCate } from "../components/cate-config/body-cate";
import { useCountryCate, useMutationCountryCate } from "../config.loader";

export const CountryCate = () => {
  const { data } = useCountryCate();
  const { mutate, isLoading: isCountryCateLoading } = useMutationCountryCate();
  return (
    <BodyCate
      title={"quốc gia"}
      dataTable={data}
      functionAdd={handleAdd}
      functionDelete={handleDelete}
      functionEdit={handleUpdate}
      confirmLoading={isCountryCateLoading}
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
