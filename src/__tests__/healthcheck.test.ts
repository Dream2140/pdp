/**
 * @jest-environment node
 */
import { GET } from "@/app/api/healthcheck/route";

describe("GET /api/healthcheck", () => {
  it("returns status ok", async () => {
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok" });
  });
});
