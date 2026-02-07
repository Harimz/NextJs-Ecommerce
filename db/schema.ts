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
  jsonb,
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

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // created, awaiting payment
  "paid", // paid via Stripe
  "fulfilled", // shipped/delivered
  "canceled",
  "refunded",
]);

export const paymentProviderEnum = pgEnum("payment_provider", ["stripe"]);

export const cartStatusEnum = pgEnum("cart_status", [
  "open",
  "converted",
  "abandoned",
]);

export const orderEventProviderEnum = pgEnum("order_event_provider", [
  "stripe",
]);

export const orderEventTypeEnum = pgEnum("order_event_type", [
  "checkout_session_created",
  "checkout_session_completed",
  "payment_succeeded",
  "payment_failed",
  "order_cancelled",
  "refund_created",
]);

export const roles = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
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
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
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
    id: uuid("id").defaultRandom().primaryKey(),
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
    uniqueIndex("categories_parent_slug_uq").on(t.parentId, t.slug),
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

export const productsInsertSchema = createInsertSchema(products);
export const productsUpdateSchema = createUpdateSchema(products);
export const productsSelectSchema = createSelectSchema(products);

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

export const productCategoriesInsertSchema =
  createInsertSchema(productCategories);
export const productCategoriesUpdateSchema =
  createUpdateSchema(productCategories);
export const productCategoriesSelectSchema =
  createSelectSchema(productCategories);

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

export const productImagesInsertSchema = createInsertSchema(productImages);
export const productImagesUpdateSchema = createUpdateSchema(productImages);
export const productImagesSelectSchema = createSelectSchema(productImages);

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

export const sizesInsertSchema = createInsertSchema(sizes);
export const sizesUpdateSchema = createUpdateSchema(sizes);
export const sizesSelectSchema = createSelectSchema(sizes);

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

export const colorsInsertSchema = createInsertSchema(colors);
export const colorsUpdateSchema = createUpdateSchema(colors);
export const colorsSelectSchema = createSelectSchema(colors);

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

export const productVariantsInsertSchema = createInsertSchema(productVariants);
export const productVariantsUpdateSchema = createUpdateSchema(productVariants);
export const productVariantsSelectSchema = createSelectSchema(productVariants);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
  },
  (t) => [uniqueIndex("tags_slug_uq").on(t.slug)],
);

export const tagsInsertSchema = createInsertSchema(tags);
export const tagsUpdateSchema = createUpdateSchema(tags);
export const tagsSelectSchema = createSelectSchema(tags);

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

export const productTagsInsertSchema = createInsertSchema(productTags);
export const productTagsUpdateSchema = createUpdateSchema(productTags);
export const productTagsSelectSchema = createSelectSchema(productTags);

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

export const productFlagsInsertSchema = createInsertSchema(productFlags);
export const productFlagsUpdateSchema = createUpdateSchema(productFlags);
export const productFlagsSelectSchema = createSelectSchema(productFlags);

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

export const discountsInsertSchema = createInsertSchema(discounts);
export const discountsUpdateSchema = createUpdateSchema(discounts);
export const discountsSelectSchema = createSelectSchema(discounts);

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

export const productDiscountsInsertSchema =
  createInsertSchema(productDiscounts);
export const productDiscountsUpdateSchema =
  createUpdateSchema(productDiscounts);
export const productDiscountsSelectSchema =
  createSelectSchema(productDiscounts);

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

export const productReviewsInsertSchema = createInsertSchema(productReviews);
export const productReviewsUpdateSchema = createUpdateSchema(productReviews);
export const productReviewsSelectSchema = createSelectSchema(productReviews);

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id"),
  status: cartStatusEnum("status").notNull().default("open"),

  currency: text("currency").notNull().default("usd"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cartsInsertSchema = createInsertSchema(carts);
export const cartsUpdateSchema = createUpdateSchema(carts);
export const cartsSelectSchema = createSelectSchema(carts);

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),

    quantity: integer("quantity").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("cart_items_cart_variant_uq").on(t.cartId, t.variantId)],
);

export const cartItemsInsertSchema = createInsertSchema(cartItems);
export const cartItemsUpdateSchema = createUpdateSchema(cartItems);
export const cartItemsSelectSchema = createSelectSchema(cartItems);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id"),
    email: text("email"),
    status: orderStatusEnum("status").notNull().default("pending"),

    currency: text("currency").notNull().default("usd"),

    subtotalCents: integer("subtotal_cents").notNull().default(0),
    discountCents: integer("discount_cents").notNull().default(0),
    shippingCents: integer("shipping_cents").notNull().default(0),
    taxCents: integer("tax_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull().default(0),

    paymentProvider: paymentProviderEnum("payment_provider")
      .notNull()
      .default("stripe"),

    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),

    shippingName: text("shipping_name"),
    shippingLine1: text("shipping_line1"),
    shippingLine2: text("shipping_line2"),
    shippingCity: text("shipping_city"),
    shippingState: text("shipping_state"),
    shippingPostal: text("shipping_postal"),
    shippingCountry: text("shipping_country"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("orders_stripe_session_uq").on(t.stripeCheckoutSessionId),
  ],
);

export const ordersInsertSchema = createInsertSchema(orders);
export const ordersUpdateSchema = createUpdateSchema(orders);
export const ordersSelectSchema = createSelectSchema(orders);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "restrict" }),

  nameSnapshot: text("name_snapshot").notNull(),
  variantSnapshot: text("variant_snapshot"),
  skuSnapshot: text("sku_snapshot"),
  unitPriceCentsSnapshot: integer("unit_price_cents_snapshot").notNull(),

  quantity: integer("quantity").notNull(),
  lineTotalCents: integer("line_total_cents").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const orderItemsInsertSchema = createInsertSchema(orderItems);
export const orderItemsUpdateSchema = createUpdateSchema(orderItems);
export const orderItemsSelectSchema = createSelectSchema(orderItems);

export const orderEvents = pgTable(
  "order_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    provider: orderEventProviderEnum("provider").notNull(),
    type: orderEventTypeEnum("type").notNull(),

    message: text("message"),

    payload: jsonb("payload").$type<Record<string, unknown>>(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("order_events_order_idx").on(t.orderId),
    index("order_events_type_idx").on(t.type),
  ],
);

export const orderEventsInsertSchema = createInsertSchema(orderEvents);
export const orderEventsUpdateSchema = createUpdateSchema(orderEvents);
export const orderEventsSelectSchema = createSelectSchema(orderEvents);
