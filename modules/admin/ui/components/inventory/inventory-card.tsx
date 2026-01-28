import React from "react";

interface Props {
  title: string;
  value: number;
}

export const InventoryCard = ({ title, value }: Props) => {
  return (
    <div className="p-6 rounded-md bg-muted border space-y-2">
      <h1 className="text-muted-foreground">{title}</h1>
      <p className="font-extrabold text-2xl">{value}</p>
    </div>
  );
};
