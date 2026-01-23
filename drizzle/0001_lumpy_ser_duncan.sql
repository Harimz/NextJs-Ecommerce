CREATE TYPE "public"."department" AS ENUM('MEN', 'WOMEN', 'KIDS', 'UNISEX');--> statement-breakpoint
CREATE TYPE "public"."discount_type" AS ENUM('PERCENT', 'AMOUNT');--> statement-breakpoint
CREATE TYPE "public"."product_flag" AS ENUM('FEATURED', 'NEW_ARRIVAL', 'BESTSELLER');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('SHIRT', 'PANTS', 'DRESS', 'OUTERWEAR', 'SKIRT', 'SHORTS', 'SWEATER', 'HOODIE', 'ACCESSORY');--> statement-breakpoint
CREATE TYPE "public"."size_category" AS ENUM('TOP', 'BOTTOM', 'ONE_SIZE');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"parent_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_uq" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");