import { CategoryNode } from "../../domains/categories-schemas";

type FlatCategoryRow = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt: Date | string;

  productCount: number;
};

function toValidDate(value: Date | string) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    console.log("Bad createdAt value:", value);
    throw new Error(`Invalid createdAt: ${String(value)}`);
  }
  return d;
}

export function buildCategoryTree(rows: FlatCategoryRow[]) {
  const map = new Map<string, CategoryNode>();

  for (const r of rows) {
    map.set(r.id, {
      id: r.id,
      name: r.name,
      slug: r.slug,
      parentId: r.parentId,
      createdAt: toValidDate(r.createdAt),
      productCount: Number(r.productCount ?? 0),
      children: [],
    });
  }

  const roots: CategoryNode[] = [];
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export const slugify = (s: string) => {
  return s
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};
