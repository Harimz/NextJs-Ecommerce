import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  expanded: boolean;
  href: string;
}

export const SidebarItem = ({
  icon,
  text,
  active,
  alert,
  expanded,
  href,
}: Props) => {
  return (
    <Link href={href} passHref>
      <li
        className={cn(
          "group relative font-semibold flex items-center py-2 my-1 rounded-md cursor-pointer transition-colors",
          active
            ? "bg-custom-primary text-white"
            : "text-white hover:bg-custom-primary/50",
          expanded ? "px-3 gap-2" : "px-0 w-10 h-10 justify-center",
        )}
      >
        <div
          className={cn(
            active
              ? "text-white dark:text-white"
              : "text-black dark:text-white",
          )}
        >
          {icon}
        </div>

        {expanded && (
          <span
            className={cn(
              "overflow-hidden transition-all dark:text-white",
              expanded ? "w-52" : "w-0",
              active ? "text-white" : "text-black",
            )}
          >
            {text}
          </span>
        )}

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
    </Link>
  );
};
