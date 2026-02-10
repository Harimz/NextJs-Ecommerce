import { cn } from "@/lib/utils";
import { centsToDollars } from "@/modules/admin/ui/utils/helpers";
import { UserOrdersOutput } from "@/modules/orders/domain/orders-schema";
import { formatReviewDate } from "@/modules/shared/utils/helpers";
import Image from "next/image";

export const OrderItemCard = ({ order }: { order: UserOrdersOutput }) => {
  return (
    <div className="border rounded-sm p-4 dark:bg-muted/25">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg">ORD-{order.id.slice(0, 6)}</h1>
          <p className="text-muted-foreground">
            {formatReviewDate(order.createdAt.toString())}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center justify-center rounded-full px-4",
              order.status === "paid"
                ? "bg-green-400/10 text-green-600"
                : "bg-orange-400/10 text-orange-600",
            )}
          >
            <span>{order.status}</span>
          </div>

          <h2 className="font-bold text-lg">
            ${centsToDollars(order.totalCents)}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {order.previewItems.map((item) => (
          <div key={`${item.id}${item.price}`} className="flex justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 aspect-3/4 rounded-md overflow-hidden">
                <Image
                  src={item.imageUrl ?? ""}
                  alt={item.name ?? ""}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="font-bold">{item.name}</h1>
                {item.size && (
                  <p className="text-muted-foreground">Size: {item.size}</p>
                )}
                <p className="text-muted-foreground">Color: {item.color}</p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
              </div>
            </div>

            <h1 className="font-bold">
              ${centsToDollars(item.price)} ({item.quantity})
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};
