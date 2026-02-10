import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { centsToDollars } from "../../utils/helpers";

const revenueChartConfig = {
  revenueCents: {
    label: "Revenue",
  },
  ordersCount: {
    label: "Orders",
  },
};

type RevenuePoint = {
  date: string;
  revenueCents: number;
  ordersCount: number;
};

const PRIMARY = "#1AA6B7";

export const RevenueOverview = ({ points }: { points: RevenuePoint[] }) => {
  const data = useMemo(() => {
    return [...points].sort((a, b) => a.date.localeCompare(b.date));
  }, [points]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue Overview</CardTitle>
        <CardDescription>Daily revenue for the selected period</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={revenueChartConfig} className="h-75 w-full">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />

            <XAxis
              dataKey="date"
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />

            <YAxis
              tickFormatter={(v) => `$${(Number(v) / 100).toFixed(0)}`}
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenueCents") {
                      return [centsToDollars(value as number), "Revenue"];
                    }
                    if (name === "ordersCount") {
                      return [Number(value).toLocaleString(), "Orders"];
                    }
                    return [String(value), name];
                  }}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />

            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
                <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="revenueCents"
              stroke={PRIMARY}
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
