import { AdminSidebar } from "@/modules/admin/ui/components/admin-sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex">
      <AdminSidebar />

      <div className="flex-1">{children}</div>
    </main>
  );
};

export default AdminLayout;
