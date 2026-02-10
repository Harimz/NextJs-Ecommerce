import { AdminDashboardKPIOutput } from "@/modules/admin/domains/dashboard-schemas";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import React from "react";
import { centsToDollars } from "../../utils/helpers";
import { Card, CardContent } from "@/components/ui/card";

export const AnalyticsCards = ({ kpis }: { kpis: AdminDashboardKPIOutput }) => {
  const items = [
    {
      title: "Total Revenue",
      value: centsToDollars(kpis.revenueCents),
      icon: DollarSign,
      description: "Revenue from paid orders",
    },
    {
      title: "Orders",
      value: kpis.ordersCount.toLocaleString(),
      icon: ShoppingBag,
      description: "Completed orders",
    },
    {
      title: "Units Sold",
      value: kpis.unitsSold.toLocaleString(),
      icon: Package,
      description: "Total items sold",
    },
    {
      title: "Avg. Order Value",
      value: centsToDollars(kpis.aovCents),
      icon: TrendingUp,
      description: "Revenue per order",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((kpi) => (
        <Card key={kpi.title} className="shadow-none">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </span>
              <div className="h-9 w-9 rounded-lg bg-custom-primary/10 flex items-center justify-center">
                <kpi.icon className="h-4 w-4 text-custom-primary" />
              </div>
            </div>

            <div className="text-2xl font-semibold font-display text-foreground">
              {kpi.value}
            </div>

            <p className="text-xs text-muted-foreground">{kpi.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
