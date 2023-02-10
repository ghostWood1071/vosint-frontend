import React from "react";

import { Layout } from "./component/layout";

interface ListGroupProps {
  items: any[];
  onChooseGroup: (item: any) => void;
  itemChoosed: any;
}

export const ListGroup: React.FC<ListGroupProps> = ({ items, onChooseGroup, itemChoosed }) => {
  return (
    <Layout
      title="DANH SÁCH GROUP HOẠT ĐỘNG"
      itemChoosed={itemChoosed}
      items={items}
      onChooseItem={onChooseGroup}
    />
  );
};
