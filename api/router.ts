import { createRouter, publicQuery } from "./middleware.js";
import { waitlistRouter } from "./routers/waitlist.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  waitlist: waitlistRouter,
});

export type AppRouter = typeof appRouter;
