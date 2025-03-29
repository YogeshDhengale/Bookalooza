import React, { useEffect } from "react";
import DashboardLayout from "@/components/UserDashboardComponents/DashboardLayout";
import { fetchUserBanks } from "@/actions/BankAction/BankAction";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import BankDetailsEmpty from "@/components/UserDashboardComponents/BankDetail/BankDetailsEmpty";
import BankDetailCard from "@/components/UserDashboardComponents/BankDetail/BankDetailCard";

function BankDetails() {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state) => state.user)
  const { bankAccounts, isBankAccountFetched } = useAppSelector(
    (state) => state.bank
  );

  const isBank = bankAccounts.length > 0;

  useEffect(() => {
    if (!isBankAccountFetched && user?.userId) dispatch(fetchUserBanks(user.userId));
  }, [dispatch, isBankAccountFetched, user?.userId]);
  return (
    <DashboardLayout
      title="Bank Details"
      subtitle="Manage your bank details here."
    >
      <div className="p-4 rounded-lg flex-1 overflow-auto relative border border-app-dark">
        {isBank ? <BankDetailCard {...bankAccounts[0]} /> : <BankDetailsEmpty />}
      </div>
    </DashboardLayout>
  );
}

export default BankDetails;
