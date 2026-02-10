import { UserInfo } from "../components/user-info";
import { OrderHistorySection } from "../sections/order-history-section";

export const ProfileView = () => {
  return (
    <div className="max-w-400 w-[95%] mx-auto min-h-screen mt-16">
      <UserInfo />

      <OrderHistorySection />
    </div>
  );
};
