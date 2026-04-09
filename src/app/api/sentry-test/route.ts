import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Sentry test error from PDP News");
  } catch (e) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
    return NextResponse.json({ message: "Test error sent to Sentry" });
  }
}
