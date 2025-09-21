import { relations } from "drizzle-orm";

import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  jsonb,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("invoice_status", [
  "paid",
  "unpaid",
  "overdue",
]);

/* SCHEMAS */
export const users = pgTable("users", {
  id: text("id").primaryKey(), // clerk userId
  email: text("email").notNull().unique(),
  profileData: jsonb("profile_data"), // store clerk profile data including clerk userId
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  invoiceNo: text("invoice_no").notNull().unique(),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address").notNull(),
  companyLogoUrl: text("company_logo_url"),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address").notNull(),
  clientEmail: text("client_email"),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: statusEnum("status").default("unpaid").notNull(),
  currency: text("currency").default("INR").notNull(),
  subTotal: decimal("sub_total", { precision: 10, scale: 2 }).notNull(), // Added precision/scale
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 })
    .default("0")
    .notNull(), // Tax should be optional
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 })
    .default("0")
    .notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id") // Fixed naming convention
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address"),
  companyLogoUrl: text("company_logo_url"),
  defaultCurrency: text("default_currency").default("INR").notNull(),
  defaultTaxRate: decimal("default_tax_rate", { precision: 5, scale: 2 })
    .default("0")
    .notNull(),
  notes: text("notes"),
  isDefault: boolean("is_default").default(false).notNull(), // user can have one default template
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* RELATION */

export const usersRelations = relations(users, ({ many }) => ({
  invoices: many(invoices),
  templates: many(templates),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  user: one(users, {
    fields: [templates.userId],
    references: [users.id],
  }),
}));

// export types for Type-Safety/TypeScript
export type User = typeof users.$inferSelect;
export type newUser = typeof users.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;
