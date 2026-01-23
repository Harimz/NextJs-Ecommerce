import { requireAdmin } from "@/lib/guards";

const AdminDashboard = async () => {
  await requireAdmin();

  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
