import { LOCAL_ROLE } from "@/constants/config";
import { AppContainer } from "@/pages/app";
import { AppHeader } from "@/pages/app/components/app-header";
import { authLoginPath } from "@/pages/router";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocalStorage } from "react-use";

export const DashboardLayout = () => {
  const [role] = useLocalStorage(LOCAL_ROLE);

  if (!role) return <Navigate to={authLoginPath} />;

  return (
    <>
      <AppHeader />
      <AppContainer>
        <Outlet />
      </AppContainer>
    </>
  );
};
