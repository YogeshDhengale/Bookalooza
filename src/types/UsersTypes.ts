export interface type_credit_entry {
  amount: number;
  time: number; // Equivalent to Java's long
}

export enum Role {
  AUTHOR = "author",
  EDITOR = "editor",
  PRINTER = "printer",
  COURIER = "courier",
  TELECALLER = "telecaller",
  OPERATOR = "operator",
  MARKETER = "marketer",
  ADMIN = "admin",
  SCHOOL = "school",
  ACCOUNT = "account",
}

export enum PaymentStatus {
  SUCCESS = "success",
  FAILED = "failed",
  INITIATED = "initiated",
}

export interface type_user {
  authorCode?: string;
  countryCode?: string;
  creationTime: number;
  creditHistory: type_credit_entry[];
  credits: number;
  email: string;
  fullName: string;
  gatewayOrderId?: string;
  gatewayPaymentStatus?: PaymentStatus;
  id: string;
  instituteName?: string;
  isFeaturedAuthor?: boolean;
  linkId?: string;
  paymentGatewayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: Role;
  schoolCode?: string;
  schoolShippedTimeLimit?: number;
  section?: string;
  standard?: string;
  startAuthorPhotoURL?: string;
  startWriting: boolean;
  updateTime?: number;
  userId: string;
}

export interface type_user_slice_state {
  user: type_user | null;
  isUserFetched: boolean;
  startAuthors: type_user[];
  isStartAuthorFetched: boolean;
}