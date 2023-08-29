import { MOCK_NEWS_SIDEBAR_REQUEST } from "../mocks/news.service.mock";
import { getNewsSidebar } from "../newsletter.service";

// import { getNewsSidebar } from "../news.service";

describe("defined functions", () => {
  test("should defined functions", () => {
    expect(getNewsSidebar).toBeDefined();
  });

  test("should get news sidebar", async () => {
    const response = await getNewsSidebar();
    expect(response).toStrictEqual(MOCK_NEWS_SIDEBAR_REQUEST);
  });
});
