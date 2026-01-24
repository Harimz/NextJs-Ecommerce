import { CategoryNode } from "../../domains/categories-schemas";

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
