import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { centsToDollars } from "../../utils/helpers";
import { cn } from "@/lib/utils";

const statusColor = (s: string) => {
  switch (s) {
    case "paid":
      return "default";
    case "fulfilled":
      return "secondary";
    case "pending":
      return "outline";
    default:
      return "outline";
  }
};

const DEPARTMENT_COLORS = [
  "#0E8FA6", // primary
  "#2FAFC4",
  "#5BC4D6",
  "#8FD9E5",
  "#C2EDF3",
];

const departmentChartConfig = {
  revenueCents: {
    label: "Revenue",
  },
};

type RecentOrder = {
  id: string;
  email: string | null;
  status: string;
  totalCents: number;
};

type SalesByDepartmentItem = {
  department: string;
  revenueCents: number;
};

export const RecentOrdersAndSalesByDepartment = ({
  recentOrders,
  salesByDepartment,
}: {
  recentOrders: { items: RecentOrder[] };
  salesByDepartment: { items: SalesByDepartmentItem[] };
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <CardDescription>Latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.items.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.email ?? "Guest"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusColor(order.status)}
                      className={cn(
                        "capitalize text-xs",
                        order.status === "paid"
                          ? "bg-green-400/10 text-green-600"
                          : "bg-orange-400/10 text-orange-600",
                      )}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {centsToDollars(order.totalCents)}
                  </TableCell>
                </TableRow>
              ))}

              {recentOrders.items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                  >
                    No recent orders
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales by Department</CardTitle>
          <CardDescription>Revenue distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={departmentChartConfig}
            className="h-[200px] w-full"
          >
            <PieChart>
              <Pie
                data={salesByDepartment.items}
                dataKey="revenueCents"
                nameKey="department"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                {salesByDepartment.items.map((_, i) => (
                  <Cell
                    key={i}
                    fill={DEPARTMENT_COLORS[i % DEPARTMENT_COLORS.length]}
                  />
                ))}
              </Pie>

              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      centsToDollars(value as number),
                      "Revenue",
                    ]}
                  />
                }
              />
            </PieChart>
          </ChartContainer>

          <div className="mt-4 space-y-2">
            {salesByDepartment.items.map((dept, i) => (
              <div
                key={dept.department}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        DEPARTMENT_COLORS[i % DEPARTMENT_COLORS.length],
                    }}
                  />
                  <span className="text-muted-foreground">
                    {dept.department}
                  </span>
                </div>
                <span className="font-medium">
                  {centsToDollars(dept.revenueCents)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
