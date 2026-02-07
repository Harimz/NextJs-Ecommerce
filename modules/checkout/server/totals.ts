export type TotalsInputItem = {
  priceCents: number;
  quantity: number;
};

export type TotalsResult = {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export const calculateTotals = (items: TotalsInputItem[]): TotalsResult => {
  const subtotalCents = items.reduce(
    (acc, it) => acc + it.priceCents * it.quantity,
    0,
  );

  const discountCents = 0;
  const shippingCents = subtotalCents >= 10000 ? 0 : 995;
  const taxCents = 0;

  const totalCents = subtotalCents - discountCents + shippingCents + taxCents;

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents,
  };
};
