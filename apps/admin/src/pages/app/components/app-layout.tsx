import { LOCAL_ROLE } from "@/constants/config";
import { authLoginPath } from "@/pages/router";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocalStorage } from "react-use";

import { AppHeader } from "./app-header";

export const AppLayout: React.FC = () => {
  const [role] = useLocalStorage(LOCAL_ROLE);

  if (!role) return <Navigate to={authLoginPath} />;

  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
};
