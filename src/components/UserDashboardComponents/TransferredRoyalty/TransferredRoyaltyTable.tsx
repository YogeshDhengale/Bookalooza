import TableContainer from "@/components/TableContainer/TableContainer";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RUPEE } from "@/lib/constantsValue";
import { getFormattedDate } from "@/lib/utils";
import Transaction from "@/types/EarningTypes";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

const columns: ColumnDef<Transaction>[] = [
  {
    header: "#ID",
    cell: ({ row }) => `#${row.index + 1}`,
  },
  {
    header: "Amount",
    cell: ({ row }) => `${RUPEE} ${row.original.amount.toFixed(2)}`,
  },
  {
    header: "Date",
    cell: ({ row }) => getFormattedDate(row.original.creationTime),
  },
  {
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "processed" ? "published" : "secondary"
          }
          className="capitalize"
        >
          {row.original.status}
        </Badge>
      );
    },
  },
];

const TransferredRoyaltyTable = () => {
  const { transferredEarnings } = useAppSelector((state) => state.earning);

  return (
    <div className="p-4 size-full mt-3 rounded-lg flex-1 overflow-auto relative border border-app-dark">
      <TableContainer columns={columns} data={transferredEarnings} />
    </div>
  );
};

export default TransferredRoyaltyTable;
