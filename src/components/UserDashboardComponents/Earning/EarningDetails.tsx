import React, { useMemo } from "react";
import TableContainer from "@/components/TableContainer/TableContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RUPEE } from "@/lib/constantsValue";
import { CircleDollarSign } from "lucide-react";
import { useAppSelector } from "@/hooks/reduxHooks";
import { ColumnDef } from "@tanstack/react-table";
import { type_earning } from "@/types/EarningTypes";

const columns: ColumnDef<type_earning>[] = [
  {
    header: "#ID",
    cell: ({ row }) => `#${row.index + 1}`,
  },
  {
    header: "Book Title",
    accessorKey: "title",
    cell: ({ row }) => row.original.bookDetails?.[0]?.title || "Untitled",
  },
  {
    header: "Copies Sold",
    accessorKey: "totalCount",
  },
  {
    header: "Earning",
    cell: ({ row }) => row.original.totalAmount.toFixed(2),
  },
];

const EarningsCard = ({
  title,
  amount,
  color,
}: {
  title: string;
  amount: number;
  color: string;
}) => (
  <Card className="size-full">
    <CardHeader className="flex-row items-center justify-between pb-0">
      <div className="text-base font-medium">{title}</div>
      <CircleDollarSign className="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${color}`}>
        {RUPEE} {amount.toFixed(2)}
      </div>
    </CardContent>
  </Card>
);

const EarningDetails = () => {
  const { earnings, transferredEarnings } = useAppSelector((state) => state.earning);

  const { totalEarnings, transferredEarningsTotal, remainingEarnings } = useMemo(() => {
    const totalEarnings = earnings.reduce((acc, { totalAmount }) => acc + totalAmount, 0);
    const transferredEarningsTotal = transferredEarnings.reduce((acc, { amount }) => acc + amount, 0);
    return {
      totalEarnings,
      transferredEarningsTotal,
      remainingEarnings: totalEarnings - transferredEarningsTotal,
    };
  }, [earnings, transferredEarnings]);

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <EarningsCard title="Total Earnings" amount={totalEarnings} color="text-app" />
        <EarningsCard title="Transferred Amount" amount={transferredEarningsTotal} color="text-orange-500" />
        <EarningsCard title="Remaining Amount" amount={remainingEarnings} color="text-green-700" />
      </div>
      <div className="p-4 size-full mt-3 rounded-lg flex-1 overflow-auto relative border border-app-dark">
        <TableContainer columns={columns} data={earnings} />
      </div>
    </>
  );
};

export default EarningDetails;
