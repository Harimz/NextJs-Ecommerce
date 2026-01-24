import {
  ChartPie,
  ClipboardList,
  LayersPlus,
  LayoutDashboard,
  Tag,
  Users,
} from "lucide-react";

export const sidebarItemsHelper = (path: string, expanded: boolean) => {
  const items = [
    {
      id: 1,
      icon: <LayoutDashboard className="size-4" />,
      text: "Dashboard",
      active: path === "/admin/dashboard",
      href: "/admin/dashboard",
      expanded: expanded,
    },
    {
      id: 2,
      icon: <ChartPie className="size-4" />,
      text: "Inventory",
      active: path === "/admin/inventory",
      href: "/admin/inventory",
      expanded: expanded,
    },
    {
      id: 3,
      icon: <LayersPlus className="size-4" />,
      text: "Products",
      active: path === "/admin/products",
      href: "/admin/products",
      expanded: expanded,
    },
    {
      id: 4,
      icon: <Tag className="size-4" />,
      text: "Categories & Tags",
      active: path === "/admin/categories-tags",
      href: "/admin/categories-tags",
      expanded: expanded,
    },
    {
      id: 5,
      icon: <ClipboardList className="size-4" />,
      text: "Orders",
      active: path === "/admin/orders",
      href: "/admin/orders",
      expanded: expanded,
    },
    {
      id: 6,
      icon: <Users className="size-4" />,
      text: "Users",
      active: path === "/admin/users",
      href: "/admin/users",
      expanded: expanded,
    },
  ];

  return items;
};
