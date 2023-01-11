import { CircleChart } from "@/pages/social/social-dashboard/dashboard-component/circle-chart/circle-chart";
import { ItemDashboardContainer } from "@/pages/social/social-dashboard/item-dashboard-container/item-dashboard-container";
import React, { useState, useEffect } from "react";
import { Select } from "antd";

interface CompareManySourceProps {
  data: any[];
}

export const CompareManySource: React.FC<CompareManySourceProps> = ({ data }) => {
  const [typeShow, setTypeShow] = useState("Facebook");
  const [dataShow, setDataShow] = useState(data[0].data);

  const handleChange = (value: string) => {
    setTypeShow(value);
  };

  function getData() {
    data.find((e) => {
      if (e.type === typeShow) {
        setDataShow(e.data);
      }
      return null;
    });
  }

  useEffect(() => {
    getData();
  }, [typeShow]);
  return (
    <ItemDashboardContainer
      titleItem="TOP 5 ĐỐI TƯỢNG ĐĂNG BÀI NHIỀU NHẤT"
      chart={<CircleChart data={dataShow} />}
      rightComponent={
        <Select
          defaultValue="Facebook"
          bordered={true}
          style={{
            width: 120,
          }}
          onChange={handleChange}
          options={[
            {
              value: "Facebook",
              label: "Facebook",
            },
            {
              value: "Twitter",
              label: "Twitter",
            },
            {
              value: "Tiktok",
              label: "Tiktok",
            },
          ]}
        />
      }
    />
  );
};
