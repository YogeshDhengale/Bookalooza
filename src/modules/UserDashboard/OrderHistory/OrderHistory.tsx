import { fetchOrders } from "@/actions/OrdersAction/OrdersAction";
import TableContainer from "@/components/TableContainer/TableContainer";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import OrderDetails from "@/components/UserDashboardComponents/Orders/OrderDetails";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { RUPEE } from "@/lib/constantsValue";
import { getFormattedDate } from "@/lib/utils";
import { type_order, type_orderItem } from "@/types/OrderTypes";
import { PaymentStatus } from "@/types/UsersTypes";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";

const columns: ColumnDef<type_order>[] = [
  {
    header: "#ID",
    cell: ({ row }) => `#${row.index + 1}`,
  },
  {
    header: "Order ID",
    accessorKey: "orderNo",
  },
  {
    accessorKey: "creationTime",
    header: "Date",
    cell: ({ row }) => getFormattedDate(row.getValue("creationTime")),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items: type_orderItem[] = row.getValue("items");
      return items.length;
    },
  },
  {
    header: "Price",
    cell: ({ row }) =>
      `${RUPEE} ${row.original.amount - row.original.shippingCharge}`,
  },
  {
    header: "Shipping",
    cell: ({ row }) => `${RUPEE} ${row.original.shippingCharge}`,
  },
  {
    header: "Total Amount",
    cell: ({ row }) => `${RUPEE} ${row.original.amount}`,
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as PaymentStatus;
      return (
        <Badge
          className="capitalize"
          variant={
            status === PaymentStatus.SUCCESS
              ? "published"
              : status === PaymentStatus.FAILED
              ? "destructive"
              : "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => <OrderDetails order={row.original} />,
  },
];

const OrderHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { orders, isOrderFetched } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (!isOrderFetched && user?.userId) {
      const filter = {
        where: { userId: user.userId, status: "success" },
        sortBy: `creationTime DESC`,
      };
      fetchOrders(dispatch, JSON.stringify(filter));
    }
  }, [isOrderFetched, dispatch, user?.userId]);

  return (
    <DashboardLayout
      title="Order History"
      subtitle="Manage all your past orders here."
    >
      <div className="border border-app-dark rounded-lg p-3 size-full flex-1">
        <TableContainer data={orders} columns={columns} />
      </div>
    </DashboardLayout>
  );
};

export default OrderHistory;
