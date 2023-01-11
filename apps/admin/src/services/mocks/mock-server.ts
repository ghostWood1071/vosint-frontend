import { setupServer } from "msw/node";
import { handlers as apiNews } from "./news.service.mock";

export const server = setupServer(...apiNews);
