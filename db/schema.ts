import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const waitlist = mysqlTable(
  "waitlist",
  {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    role: varchar("role", { length: 100 }),
    interest: text("interest"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("email_idx").on(table.email),
  ]
);

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type NewWaitlistEntry = typeof waitlist.$inferInsert;
