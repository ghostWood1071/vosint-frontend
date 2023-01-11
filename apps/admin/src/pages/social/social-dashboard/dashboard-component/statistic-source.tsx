import LineChart from "@/pages/social/components/line-chart";
import { ItemDashboardContainer } from "@/pages/social/social-dashboard/item-dashboard-container/item-dashboard-container";
import React, { useState, useEffect } from "react";
import { Select } from "antd";

interface StatisticSourceProps {
  data: any[];
}

export const StatisticSource: React.FC<StatisticSourceProps> = ({ data }) => {
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
      titleItem="THỐNG KÊ TƯƠNG TÁC 3 NGUỒN"
      chart={
        <div style={{ marginTop: 20, height: "95%" }}>
          <LineChart data={dataShow} smooth={false} point={true} color={["green", "blue", "red"]} />
        </div>
      }
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
