import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/modules/shared/hooks/use-user";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, Scroll, Settings, Shield } from "lucide-react";

export const UserButton = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-4 items-center cursor-pointer">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-muted-foreground text-sm">Welcome Back!</p>

            <h1 className="font-bold">{user?.name}</h1>
          </div>

          <ChevronDown className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-50 p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-sm">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Scroll />
            <p className="mt-1">Orders</p>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings />
            <p className="mt-1">Settings</p>
          </DropdownMenuItem>

          {user?.role === "admin" && (
            <Link href="/admin/dashboard" passHref>
              <DropdownMenuItem>
                <Shield />
                <p className="mt-1">Admin</p>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();

              router.push("/login");
            }}
          >
            <LogOut />
            <p className="mt-1">Logout</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
