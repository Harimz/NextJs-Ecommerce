"use client";

import { Button } from "@/components/ui/button";
import { ChevronFirst, ChevronLast, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { sidebarItemsHelper } from "../../data/sidebar-items";

export const AdminSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const path = usePathname();

  const sidebarItems = sidebarItemsHelper(path, expanded);

  return (
    <aside className={`h-screen`}>
      <nav className="h-full flex flex-col border-r">
        <div className="p-4 pb-2 flex justify-end">
          <Button
            onClick={() => setExpanded((curr) => !curr)}
            size="icon"
            variant="ghost"
            className="cursor-pointer"
          >
            {expanded ? (
              <ChevronFirst className="size-4" />
            ) : (
              <ChevronLast className="size-4" />
            )}
          </Button>
        </div>

        <ul className="flex-1 px-3">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              text={item.text}
              active={item.active}
              expanded={item.expanded}
              href={item.href}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};
