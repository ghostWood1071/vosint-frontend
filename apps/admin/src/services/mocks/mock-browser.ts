import { setupWorker } from "msw";

import { handlers as apiNews } from "./news.service.mock";

export const worker = setupWorker(...apiNews);
