import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  pgEnum,
  uuid,
  uniqueIndex,
  integer,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";

import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const productTypeEnum = pgEnum("product_type", [
  "SHIRT",
  "PANTS",
  "DRESS",
  "OUTERWEAR",
  "SKIRT",
  "SHORTS",
  "SWEATER",
  "HOODIE",
  "ACCESSORY",
]);

export const departmentEnum = pgEnum("department", [
  "MEN",
  "WOMEN",
  "KIDS",
  "UNISEX",
]);

export const sizeCategoryEnum = pgEnum("size_category", [
  "TOP",
  "BOTTOM",
  "ONE_SIZE",
]);

export const discountTypeEnum = pgEnum("discount_type", ["PERCENT", "AMOUNT"]);

export const productFlagEnum = pgEnum("product_flag", [
  "FEATURED",
  "NEW_ARRIVAL",
  "BESTSELLER",
]);

export const roles = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roles("role").default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Products

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("categories_slug_uq").on(t.slug),
    index("categories_parent_idx").on(t.parentId),
  ],
);

export const categoriesInsertSchema = createInsertSchema(categories);
export const categoriesUpdateSchema = createUpdateSchema(categories);
export const categoriesSelectSchema = createSelectSchema(categories);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    slug: text("slug").notNull(),

    description: text("description"),
    productType: productTypeEnum("product_type").notNull(),
    department: departmentEnum("department").notNull(),

    active: boolean("active").default(true).notNull(),
    featuredRank: integer("featured_rank"),

    minPriceCents: integer("min_price_cents"),
    maxPriceCents: integer("max_price_cents"),

    ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 })
      .default("0")
      .notNull(),
    ratingCount: integer("rating_count").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("products_slug_uq").on(t.slug),
    index("products_type_dept_idx").on(t.productType, t.department),
    index("products_active_idx").on(t.active),
    index("products_featured_idx").on(t.featuredRank),
  ],
);

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({
      columns: [t.productId, t.categoryId],
      name: "product_categories_pk",
    }),
    index("product_categories_category_idx").on(t.categoryId),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    // Cloudflare R2 key + public URL
    r2Key: text("r2_key").notNull(),
    url: text("url").notNull(),

    alt: text("alt"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const sizes = pgTable(
  "sizes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    category: sizeCategoryEnum("category").notNull(),

    code: text("code").notNull(),

    label: text("label").notNull(),

    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (t) => [
    uniqueIndex("sizes_category_code_uq").on(t.category, t.code),
    index("sizes_sort_idx").on(t.category, t.sortOrder),
  ],
);

export const colors = pgTable(
  "colors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    hex: text("hex"),
  },
  (t) => [uniqueIndex("colors_slug_uq").on(t.slug)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    sku: text("sku"),
    active: boolean("active").default(true).notNull(),

    sizeId: uuid("size_id").references(() => sizes.id),
    colorId: uuid("color_id").references(() => colors.id),

    priceCents: integer("price_cents").notNull(),
    compareAtPriceCents: integer("compare_at_price_cents"),
    inventory: integer("inventory").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("variants_product_idx").on(t.productId),
    index("variants_active_idx").on(t.active),
    uniqueIndex("variants_product_size_color_uq").on(
      t.productId,
      t.sizeId,
      t.colorId,
    ),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
  },
  (t) => [uniqueIndex("tags_slug_uq").on(t.slug)],
);

export const productTags = pgTable(
  "product_tags",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.tagId], name: "product_tags_pk" }),
    index("product_tags_tag_idx").on(t.tagId),
  ],
);

export const productFlags = pgTable(
  "product_flags",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    flag: productFlagEnum("flag").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.productId, t.flag], name: "product_flags_pk" }),
    index("product_flags_flag_idx").on(t.flag),
  ],
);

export const discounts = pgTable(
  "discounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code"),
    type: discountTypeEnum("type").notNull(),
    value: integer("value").notNull(),

    active: boolean("active").default(true).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("discounts_code_uq").on(t.code),
    index("discounts_active_idx").on(t.active),
  ],
);

export const productDiscounts = pgTable(
  "product_discounts",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discounts.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({
      columns: [t.productId, t.discountId],
      name: "product_discounts_pk",
    }),
    index("product_discounts_discount_idx").on(t.discountId),
  ],
);

export const productReviews = pgTable(
  "product_reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    userId: uuid("user_id").notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("product_reviews_product_user_uq").on(t.productId, t.userId),
    index("product_reviews_product_idx").on(t.productId),
  ],
);
