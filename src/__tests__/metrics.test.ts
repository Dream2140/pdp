/**
 * @jest-environment node
 */
import { GET } from "@/app/api/metrics/route";

describe("GET /api/metrics", () => {
  it("returns prometheus metrics", async () => {
    const response = await GET();
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(body).toContain("process_cpu_user_seconds_total");
  });
});
