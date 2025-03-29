import React, { useState } from "react";
import Lottie from "react-lottie-player";
import { Button } from "@/components/ui/button";
import bankAnimation from "@/assets/lotties/bank-wallet-animation.json";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { createBankAccount } from "@/actions/BankAction/BankAction";
import { type_create_bank } from "@/types/BankTypes";

const fields = [
  {
    label: "Account Number",
    name: "accountNumber",
    type: "text",
    placeholder: "Enter your account number",
  },
  {
    label: "Confirm Account Number",
    name: "confirmAccountNumber",
    type: "text",
    placeholder: "Enter your account number",
  },
  {
    label: "Account Holder Name",
    name: "accountHolderName",
    type: "text",
    placeholder: "Enter your account holder name",
  },
  {
    label: "Bank Name",
    name: "bankName",
    type: "text",
    placeholder: "Enter your bank name",
  },
  {
    label: "Branch Name",
    name: "branch",
    type: "text",
    placeholder: "Enter your branch name",
  },
  {
    label: "IFSC Code",
    name: "ifscCode",
    type: "text",
    placeholder: "Enter your ifcs code",
  },
];

const BankDetailsEmpty: React.FC = () => {
    const dispatch = useAppDispatch();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: Partial<type_create_bank & { confirmAccountNumber?: string }> = {};
  
    for (const field of fields) {
      const value = formData.get(field.name)?.toString().trim() || "";
      if (!value) {
        setError(`${field.label} is required`);
        return;
      }
      data[field.name as keyof typeof data] = value;
    }
  
    // Validate account number match
    if (data.accountNumber !== data.confirmAccountNumber) {
      setError("Account Number and Confirm Account Number must match");
      return;
    }
  
    // Remove confirmAccountNumber from final data
    delete data.confirmAccountNumber;
    dispatch(createBankAccount(data as type_create_bank));
  };
  
  return (
    <>
      {isCreating ? (
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field, index) => (
              <div className="space-y-1" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  onChange={() => setError("")}
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-4">
            <Button type="submit">Add Bank Details</Button>
            <Button variant="secondary" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-4 text-center">
          <Lottie animationData={bankAnimation} loop play className="size-40" />
          <p>Looks like you haven't added any bank details yet.</p>
          <Button onClick={() => setIsCreating(true)}>Add Bank Details</Button>
        </div>
      )}
    </>
  );
};

export default BankDetailsEmpty;
