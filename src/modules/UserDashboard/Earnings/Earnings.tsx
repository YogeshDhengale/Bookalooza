import React, { useEffect, useMemo } from "react";
import { fetchTransferredEarnings, fetchUsersEarings } from "@/actions/EarningsAction/EarningsAction";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import EarningDetails from "@/components/UserDashboardComponents/Earning/EarningDetails";
import EarningEmpty from "@/components/UserDashboardComponents/Earning/EarningEmpty";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const Earnings = () => {
  const dispatch = useAppDispatch();
  const { earnings, isEarningsFetched, isTransferredEarningsFetched } = useAppSelector(
    (state) => state.earning
  );
  const userId = useAppSelector((state) => state.user.user?.userId);

  useEffect(() => {
    if (!isEarningsFetched) dispatch(fetchUsersEarings());
    if (!isTransferredEarningsFetched && userId) dispatch(fetchTransferredEarnings(userId));
  }, [isEarningsFetched, isTransferredEarningsFetched, userId, dispatch]);

  const hasEarnings = useMemo(() => earnings.length > 0, [earnings]);

  return (
    <DashboardLayout
      title="Your Earnings"
      subtitle="Manage your earnings here."
      btnCTA="Transferred to my bank"
    >
      {hasEarnings ? <EarningDetails /> : <EarningEmpty />}
    </DashboardLayout>
  );
};

export default Earnings;
