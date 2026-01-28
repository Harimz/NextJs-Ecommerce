"use client";

import dynamic from "next/dynamic";

const InventorySection = dynamic(
  () => import("../sections/inventory-section").then((m) => m.InventorySection),
  { ssr: false },
);

export const InventoryView = () => {
  return (
    <div className="mx-auto w-[90%] max-w-440 mt-10">
      <h1 className="text-2xl font-bold">Inventory</h1>

      <p className="text-muted-foreground">Check your products inventory</p>

      <InventorySection />
    </div>
  );
};
