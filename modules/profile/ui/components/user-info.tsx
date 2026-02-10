"use client";

import { useUser } from "@/modules/shared/hooks/use-user";
import Image from "next/image";

export const UserInfo = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return "Loading...";
  }

  return (
    <div className="flex gap-6">
      <div className="relative rounded-full h-10 w-10 md:h-20 md:w-20 overflow-hidden">
        <Image
          src={
            user?.image ??
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
          }
          alt={user?.name ?? "User Profile"}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-4xl">{user?.name}</h1>

          <div className="bg-custom-primary/10 rounded-full flex items-center justify-center px-2">
            <span className="text-custom-primary text-sm">Gold Member</span>
          </div>
        </div>
        <p className="text-muted-foreground">{user?.email}</p>
        <p className="text-muted-foreground">
          Member since {user?.createdAt.toDateString()}
        </p>
      </div>
    </div>
  );
};
