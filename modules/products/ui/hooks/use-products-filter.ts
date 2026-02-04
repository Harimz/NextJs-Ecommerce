"use client";

import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { departmentEnum, productTypeEnum } from "@/db/schema";

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";
export type Department = (typeof departmentEnum.enumValues)[number];
export type ProductType = (typeof productTypeEnum.enumValues)[number];

const deptSet = new Set<string>(departmentEnum.enumValues);
const typeSet = new Set<string>(productTypeEnum.enumValues);

const isSort = (v: string): v is SortOption =>
  v === "newest" || v === "price-asc" || v === "price-desc" || v === "rating";

export const useProductsFilter = () => {
  const [q, setQ] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      departments: parseAsArrayOf(parseAsString).withDefault([]),
      productTypes: parseAsArrayOf(parseAsString).withDefault([]),
      onSale: parseAsBoolean.withDefault(false),
      minPrice: parseAsInteger.withDefault(0),
      maxPrice: parseAsInteger.withDefault(50000),
      sort: parseAsString.withDefault("newest"),
    },
    { history: "push", shallow: true },
  );

  const departments = q.departments.filter((d): d is Department =>
    deptSet.has(d),
  );

  const productTypes = q.productTypes.filter((t): t is ProductType =>
    typeSet.has(t),
  );

  const sort: SortOption = isSort(q.sort) ? q.sort : "newest";

  return {
    filters: {
      ...q,
      departments,
      productTypes,
      sort,
    },
    setFilters: setQ,
  };
};
