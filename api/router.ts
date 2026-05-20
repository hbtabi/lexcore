import { createRouter, publicQuery } from "./middleware";
import { waitlistRouter } from "./routers/waitlist";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  waitlist: waitlistRouter,
});

export type AppRouter = typeof appRouter;
