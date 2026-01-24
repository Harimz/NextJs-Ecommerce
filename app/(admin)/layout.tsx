import { AdminSidebar } from "@/modules/admin/ui/components/sidebar/admin-sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex">
      <AdminSidebar />

      <div className="flex-1 bg-muted/50">{children}</div>
    </main>
  );
};

export default AdminLayout;
