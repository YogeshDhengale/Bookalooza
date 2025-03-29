export interface type_order_slice_state {
  orders: type_order[] | [];
  order?: type_order;
  isOrderFetched: boolean;
}

export interface type_order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  addressLine2: string;
  landmark: string;
  alternatePhone: string;
  city: string;
  state: string;
  pincode: string;
  country: "India"; // Since it's always "India", we use a literal type
  platformFee: number | null;
  amount: number;
  shippingCharge: number;
  couponCode: string;
  couponDiscount: number;
  creationTime: number;
  status: string;
  schoolCode: string | null;
  schoolShipped: boolean | null;
  usedCredits: number;
  gatewayPaymentId: string;
  gatewayOrderId: string;
  gatewayPaymentStatus: PaymentStatus;
  transactionTime: number;
  dispatchStatus: string;
  paymentGatewayName: string | null;
  orderNo: string;
  invoiceNo: string;
  invoiceTime: number;
  readyToPrintTime: number | null;
  deliveryDate: number;
  items: type_orderItem[];
  docketNo: string;
  courierName: string | null;
  currency: "INR"; // Fixed value
  exported: boolean;
  trackURL?: string; // Optional field if not always present
}

enum PaymentStatus {
  SUCCESS = "success",
  PENDING = "pending",
  FAILED = "failed",
}

export interface type_orderItem {
  bookId: string;
  quantity: number;
  authorDiscount: number;
  quantityDiscount: number;
  totalAmount: number;
  coupon: string;
  title: string;
  author: string;
  frontThumbURL: string;
  price: number;
  totalPages: number | null;
  isProofReadingService: boolean | null;
  isListingService: boolean | null;
}
