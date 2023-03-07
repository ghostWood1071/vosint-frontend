import { HttpStatusCode } from "@/constants/http-status";
import { Button, Result } from "antd";
import React from "react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

import { searchPath } from "../router";
import { NotFoundPage } from "./404";

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    if (error.status === HttpStatusCode.notfound) {
      return <NotFoundPage />;
    }
  }

  function handleResetError() {
    navigate(searchPath);
  }

  return (
    <Result
      status="500"
      title="Client Internal Error"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary" onClick={handleResetError}>
          Go home
        </Button>
      }
    />
  );
};
