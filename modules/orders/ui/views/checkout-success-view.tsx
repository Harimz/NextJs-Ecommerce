import React from "react";
import { CheckoutSuccessSection } from "../sections/checkout-success-section";

export const CheckoutSuccessView = ({ sessionId }: { sessionId: string }) => {
  return (
    <div className="max-w-250 w-[95%] mx-auto min-h-screen">
      <CheckoutSuccessSection sessionId={sessionId} />
    </div>
  );
};
