import React from "react";

import { Layout } from "./component/layout";

interface ListUserProps {
  items: any[];
  onChooseUser: (item: any) => void;
  itemChoosed: any;
}

export const ListUser: React.FC<ListUserProps> = ({ items, onChooseUser, itemChoosed }) => {
  return (
    <Layout
      title="DANH SÁCH ĐỐI TƯỢNG HOẠT ĐỘNG"
      itemChoosed={itemChoosed}
      items={items}
      onChooseItem={onChooseUser}
    />
  );
};
