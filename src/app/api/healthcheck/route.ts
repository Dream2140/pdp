import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET() {
  logger.info("Healthcheck requested");
  return NextResponse.json({ status: "ok" });
}
