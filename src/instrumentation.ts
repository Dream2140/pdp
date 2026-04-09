export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: "https://5ac18524b3454ecdd2e14c270f87067c@o4511189751693312.ingest.de.sentry.io/4511189754183760",
      tracesSampleRate: 1.0,
    });
  }
}
