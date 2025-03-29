import { type_orderItem } from "@/types/OrderTypes";
import { Separator } from "@radix-ui/react-separator";
import { Equal, X } from "lucide-react";
import React from "react";

const OrderItemCard = ({ item }: { item: type_orderItem }) => {
  return (
    <div className="mt-2 flex flex-col items-center md:flex-row gap-2 pb-2 border-b">
      <div className="h-fit w-full">
        <img
          src={item.frontThumbURL}
          alt={item.title}
          className="w-24 rounded shadow-md object-contain bg-zinc-200"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <h4 className="text-lg font-bold text-app w-fit">{item.title}</h4>
        <div className="flex gap-1 items-end w-full flex-1">
          <div>
            <p className="text-base text-center">Price</p>
            <p className="text-base text-center">{item.price}</p>
          </div>
          <X className="size-4 mb-1" strokeWidth={1.5} />
          <div>
            <p className="text-base text-center">Qty</p>
            <p className="text-base text-center">{item.quantity}</p>
          </div>
          <Equal className="size-4 mb-1" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-base text-end font-semibold">Subtotal</p>
            <p className="text-base text-end font-semibold">
              {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end italic">
          <div className="flex gap-1 text-xs text-end font-medium">
            <p>Author Discount:</p>
            <p>{item.authorDiscount.toFixed(2)}</p>
          </div>
          <div className="flex gap-1 text-xs text-end font-medium">
            <p>Quantity Discount:</p>
            <p>{item.quantityDiscount.toFixed(2)}</p>
          </div>
        </div>
        <Separator className="w-full bg-border h-[1px]" />
        <div className="flex gap-1 justify-between">
          <p className="text-base font-bold">Total Amount</p>
          <p className="text-base font-bold">{item.totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
