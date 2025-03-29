import { deleteBankAccount } from "@/actions/BankAction/BankAction";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { CheckCircle2, Copy } from "lucide-react";
import React, { useState } from "react";

interface BankDetailsProps {
  id: string;
  userId: string;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  creationTime: number;
}

const BankDetailCard: React.FC<BankDetailsProps> = ({
  accountNumber,
  bankName,
  branch,
  ifscCode,
  id
}) => {
    const dispatch = useAppDispatch();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const DetailRow = ({
    label,
    value,
    canCopy = false,
    field = "",
  }: {
    label: string;
    value: string;
    canCopy?: boolean;
    field?: string;
  }) => (
    <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:justify-between sm:space-x-4 py-2 border-b border-border/50 last:border-0 text-base font-medium">
      <span className=" text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span>{value}</span>
        {canCopy && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => copyToClipboard(value, field)}
            aria-label={`Copy ${label}`}
          >
            {copiedField === field ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="space-y-0.5 rounded-md border border-border p-3">
        <DetailRow
          label="Account Number"
          value={accountNumber}
          canCopy={true}
          field="accountNumber"
        />
        <DetailRow label="Bank Name" value={bankName} />
        <DetailRow label="Branch" value={branch} />
        <DetailRow
          label="IFSC Code"
          value={ifscCode}
          canCopy={true}
          field="ifscCode"
        />
      </div>
      <div className="mt-4 flex">
        <Button onClick={() => dispatch(deleteBankAccount(id))}>Delete Details</Button>
      </div>
    </div>
  );
};

export default BankDetailCard;
