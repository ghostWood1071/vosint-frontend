import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppFilter } from "./app-filter";
import { AppHeader } from "./app-header";
import { useLocalStorage } from "react-use";
import { LOCAL_ROLE } from "@/constants/config";
import { authLoginPath } from "@/pages/router";

export const AppLayout: React.FC = () => {
  const [role] = useLocalStorage(LOCAL_ROLE);

  if (!role) return <Navigate to={authLoginPath} />;

  return (
    <>
      <AppHeader />
      <AppFilter />
      <Outlet />
    </>
  );
};
