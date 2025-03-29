import axios from "axios";

interface PaymentGatewayResponse {
    data: {
      gateway: string;
      key: string;
    };
    success: boolean;
}

export function getPaymentConfig() {
    return axios<PaymentGatewayResponse>({
      url: '/designer/config/payment'
    }).then(res => res.data.data)
  }