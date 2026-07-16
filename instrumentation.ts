// Next.js instrumentation hook — runs ONCE when the server starts up.
// This is the correct place for one-time side effects like DB initialization.
// See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

export async function register() {
  // Only run on the Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeDatabase } = await import("./db/seed");
    initializeDatabase();
  }
}
