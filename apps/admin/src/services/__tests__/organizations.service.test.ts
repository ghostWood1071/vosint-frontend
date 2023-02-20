import { getOrganizationsSidebar } from "../organizations.service";

describe("defined functions", () => {
  test("should defined functions", () => {
    expect(getOrganizationsSidebar).toBeDefined();
  });
});
