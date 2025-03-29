import { type_order } from "@/types/OrderTypes";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Ellipsis } from "lucide-react";
import { Separator } from "../../ui/separator";
import { getFormattedDate } from "@/lib/utils";
import OrderItemCard from "./OrderItemCard";
import { Link } from "react-router";

const OrderDetails = ({ order }: { order: type_order }) => {
  const { orderNo, gatewayPaymentId, creationTime, items, id } = order;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="show more">
          <Ellipsis />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>Here is your order details.</SheetDescription>
        </SheetHeader>
        <Separator className="w-full mt-4" />
        <div className="flex flex-col gap-1 py-4">
          <div className=" flex-1 mb-4 flex items-center justify-center gap-4">
            <Link to={`/user/order-history/${id}`} className="primary-button">
              Print/Download Invoice
            </Link>
          </div>
          {[
            { label: "Order ID", value: orderNo },
            { label: "Payment ID", value: gatewayPaymentId },
            { label: "Order Date", value: getFormattedDate(creationTime) },
          ].map(({ label, value }) => (
            <React.Fragment key={label}>
              <div className="h-max">
                <Label className="text-base text-app-dark capitalize">
                  {label}
                </Label>
                <p className="text-foreground text-base">{value || "-"}</p>
              </div>
              <Separator className="w-full" aria-hidden="true" />
            </React.Fragment>
          ))}
          <div>
            <Label className="text-base capitalize text-app-dark">
              Items In This Order
            </Label>
            {items.map((item) => {
              return <OrderItemCard item={item} key={item.bookId} />;
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(OrderDetails);
