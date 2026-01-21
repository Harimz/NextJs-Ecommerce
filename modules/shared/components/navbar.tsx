"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useUser } from "../hooks/use-user";

export const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="p-6 flex justify-between">
      <h1>Sterling</h1>

      {!user && (
        <div className="flex items-center gap-6">
          <Button>Sign Up</Button>
          <Button>Login</Button>
        </div>
      )}

      {user && <Button onClick={() => authClient.signOut()}>Logout</Button>}
    </div>
  );
};
