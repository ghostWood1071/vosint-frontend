import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { homePath } from "../router";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  function handleResetError() {
    navigate(homePath);
  }

  return (
    <Result
      status="404"
      title="Not Found"
      subTitle="Sorry, something went wrong."
      extra={
        <Button type="primary" onClick={handleResetError}>
          Go home
        </Button>
      }
    />
  );
};
