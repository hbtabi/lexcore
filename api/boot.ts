import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";
import { env } from "./lib/env.js";
import { handleLegalCounsel } from "./routers/legalCounsel.js";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// AI Legal Counsel endpoint
app.post("/api/legal-counsel", async (c) => {
  try {
    const body = await c.req.json<{ message?: string }>();
    if (!body.message || typeof body.message !== "string" || !body.message.trim()) {
      return c.json({ success: false, error: "Please provide a message describing your legal situation." }, 400);
    }
    const result = await handleLegalCounsel(body.message.trim());
    if (!result.success) {
      return c.json({ success: false, error: result.error || "Unknown error" }, 500);
    }
    return c.json({ success: true, response: result.response });
  } catch (err) {
    return c.json({ success: false, error: "Invalid request body. Expected JSON with a 'message' field." }, 400);
  }
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite.js");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
