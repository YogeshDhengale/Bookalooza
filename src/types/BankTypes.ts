export interface type_bank_account {
    id: string;
    userId: string;
    accountNumber: string;
    accountHolderName: string;
    bankName: string;
    branch: string;
    ifscCode: string;
    creationTime: number;
}

export interface type_create_bank {
    accountNumber: string;
    accountHolderName: string;
    bankName: string;
    branch: string;
    ifscCode: string;
}

export interface type_bank_account_slice_state {
    bankAccounts: type_bank_account[];
    isBankAccountFetched: boolean;
}