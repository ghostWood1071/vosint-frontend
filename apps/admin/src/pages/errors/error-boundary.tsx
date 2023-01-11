import { HttpStatusCode } from "@/constants/http-status";
import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { NotFoundPage } from "./404";

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === HttpStatusCode.notfound) {
      return <NotFoundPage />;
    }
  }

  return <div>ErrorBoundary</div>;
};
