import { Book } from "./BookTypes";

interface BookId {
    timestamp: number;
    date: string; // ISO date string
}

export interface type_earning {
    totalAmount: number;
    totalCount: number;
    bookId: BookId;
    bookDetails: Book[];
    id: string;
}

export default class Transaction {
    id!: string;
    userId: string;
    creationTime: number;
    updateTime: number | null;
    amount: number;
    status: string;
    invoiceNo: string;
    transactionId: string;
    description: string;
  
    constructor(
      userId: string = "",
      creationTime: number = Date.now(),
      updateTime: number | null = null,
      amount: number = 0,
      status: string = "",
      invoiceNo: string= "",
      transactionId: string = "",
      description: string = ""
    ) {
      this.userId = userId;
      this.creationTime = creationTime;
      this.updateTime = updateTime;
      this.amount = parseInt(amount.toFixed(2));
      this.status = status;
      this.invoiceNo = invoiceNo;
      this.transactionId = transactionId;
      this.description = description;
    }
  }
  

export interface type_earning_slice_state {
    earnings: type_earning[];
    isEarningsFetched: boolean;
    transferredEarnings: Transaction[];
    isTransferredEarningsFetched: boolean;
}