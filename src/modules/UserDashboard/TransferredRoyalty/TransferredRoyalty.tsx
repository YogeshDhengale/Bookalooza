import { fetchTransferredEarnings } from "@/actions/EarningsAction/EarningsAction";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import EarningEmpty from "@/components/UserDashboardComponents/Earning/EarningEmpty";
import TransferredRoyaltyTable from "@/components/UserDashboardComponents/TransferredRoyalty/TransferredRoyaltyTable";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import React, { useEffect, useMemo } from "react";

function TransferredRoyalty() {
  const dispatch = useAppDispatch();
  const { isTransferredEarningsFetched, transferredEarnings } = useAppSelector(
    (state) => state.earning
  );
  const userId = useAppSelector((state) => state.user.user?.userId);
  const hasEarnings = useMemo(() => transferredEarnings.length > 0, [transferredEarnings]);

  useEffect(() => {
    if (!isTransferredEarningsFetched && userId)
      dispatch(fetchTransferredEarnings(userId));
  }, [isTransferredEarningsFetched, userId, dispatch]);
  return (
    <DashboardLayout
      title="Royalty earned"
      subtitle="Check all your transferred royalties here."
    >
      {hasEarnings ? <TransferredRoyaltyTable /> : <EarningEmpty />}
    </DashboardLayout>
  );
}

export default TransferredRoyalty;
