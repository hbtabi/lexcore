import { z } from "zod";
import { createRouter, publicQuery } from "../middleware.js";
import { env } from "../lib/env.js";
import { waitlistStore } from "../lib/waitlist-store.js";

export const waitlistRouter = createRouter({
  join: publicQuery
    .input(
      z.object({
        fullName: z.string().min(1, "Name is required").max(255),
        email: z.string().email("Invalid email address").max(255),
        company: z.string().max(255).optional(),
        role: z.string().max(100).optional(),
        interest: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Use file store when no database URL is configured
      if (!env.databaseUrl) {
        return waitlistStore.add({
          fullName: input.fullName,
          email: input.email,
          company: input.company,
          role: input.role,
          interest: input.interest,
        });
      }

      const { getDb } = await import("../queries/connection");
      const { waitlist } = await import("@db/schema");
      const { eq, count } = await import("drizzle-orm");
      const db = getDb();

      const existing = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        return { success: false, message: "This email is already on the waitlist." };
      }

      const result = await db.insert(waitlist).values({
        fullName: input.fullName,
        email: input.email,
        company: input.company || null,
        role: input.role || null,
        interest: input.interest || null,
      });

      return { success: true, message: "You've been added to the waitlist!", id: Number(result[0].insertId) };
    }),

  count: publicQuery.query(async () => {
    if (!env.databaseUrl) {
      return { count: waitlistStore.count() };
    }

    const { getDb } = await import("../queries/connection");
    const { waitlist } = await import("@db/schema");
    const { count } = await import("drizzle-orm");
    const db = getDb();
    const result = await db.select({ value: count() }).from(waitlist);
    return { count: result[0]?.value ?? 0 };
  }),

  list: publicQuery.query(async () => {
    if (!env.databaseUrl) {
      return waitlistStore.list();
    }

    const { getDb } = await import("../queries/connection");
    const { waitlist } = await import("@db/schema");
    const { sql } = await import("drizzle-orm");
    const db = getDb();
    return db.select().from(waitlist).orderBy(sql`${waitlist.createdAt} DESC`);
  }),
});
