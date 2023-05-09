import { AppContainer } from "@/pages/app";
import React from "react";
import { Outlet } from "react-router-dom";

export const EventLayout: React.FC = () => {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
};
