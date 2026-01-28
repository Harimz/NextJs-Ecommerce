import { CategoryNode } from "../../domains/categories-schemas";
import { CreateProductFormValues } from "../../domains/products-schemas";

type CategoryOption = { id: string; label: string };

export const flattenCategories = (
  nodes: CategoryNode[],
  depth = 0,
): CategoryOption[] => {
  const out: CategoryOption[] = [];

  for (const n of nodes) {
    out.push({
      id: n.id,
      label: `${"— ".repeat(depth)}${n.name}`,
    });

    if (n.children?.length) {
      out.push(...flattenCategories(n.children, depth + 1));
    }
  }

  return out;
};

export const getSizeCategory = (
  productType: CreateProductFormValues["productType"],
) => {
  switch (productType) {
    case "PANTS":
    case "SHORTS":
      return "BOTTOM" as const;
    case "ACCESSORY":
      return "ONE_SIZE" as const;
    default:
      return "TOP" as const;
  }
};

export const centsToDollars = (cents?: number | null) => {
  if (cents == null) return "";

  return (cents / 100).toFixed(2);
};

export const dollarsToCents = (input: string) => {
  if (!input) return 0;
  const n = Number(input);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.round(n * 100));
};
