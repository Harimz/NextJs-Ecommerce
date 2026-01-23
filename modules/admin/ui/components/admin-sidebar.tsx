"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, ChevronFirst, ChevronLast, Divide } from "lucide-react";
import React, { useState } from "react";

interface Props {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  expanded: boolean;
}

const SidebarItem = ({ icon, text, active, alert, expanded }: Props) => {
  return (
    <li
      className={cn(
        "group relative font-semibold flex items-center py-2 my-1 rounded-md cursor-pointer transition-colors",
        active
          ? "bg-custom-primary text-white"
          : "text-white hover:bg-custom-primary/50",
        expanded ? "px-3 gap-2" : "px-0 w-10 h-10 justify-center",
      )}
    >
      {icon}

      <span
        className={cn(
          "overflow-hidden transition-all",
          expanded ? "w-52" : "w-0",
        )}
      >
        {text}
      </span>

      {alert && (
        <div
          className={cn(
            "absolute w-2 h-2 rounded-full bg-custom-primary",
            expanded ? "right-3" : "right-1 top-1",
          )}
        />
      )}

      {!expanded && (
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 rounded-md px-2 py-1
                     bg-custom-primary/90 text-sm text-white
                     invisible opacity-0 -translate-x-2
                     transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {text}
        </div>
      )}
    </li>
  );
};

export const AdminSidebar = () => {
  const [expanded, setExpanded] = useState(false);

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
          <SidebarItem
            icon={<BarChart className="size-4" />}
            text="Dashboard"
            active
            alert
            expanded={expanded}
          />
        </ul>
      </nav>
    </aside>
  );
};
