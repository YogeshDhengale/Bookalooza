import axios from "axios";
import { orderSliceActions } from "@/store/OrderSlice/OrderSlice";
import { AppDispatch } from "@/store/store";
import { type_order } from "@/types/OrderTypes";

const BASE_URL = "/designer/orders";

interface type_orders_response {
  data: type_order[];
  success: boolean;
}

interface type_order_response {
  data: type_order;
  success: boolean;
}

export async function fetchOrders(dispatch: AppDispatch, filter: string) {
  return axios<type_orders_response>({
    url: `${BASE_URL}?filter:${encodeURIComponent(filter)}`,
    method: "GET",
  })
    .then((response) => {
      if (response.status === 200) {
        dispatch(orderSliceActions.fetchOrders(response.data.data));
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export async function fetchOrderById(dispatch: AppDispatch, id: string) {
  return axios<type_order_response>({
    url: `${BASE_URL}/${id}`,
    method: "GET",
  })
    .then((response) => {
      if(response.data.success) dispatch(orderSliceActions.fetchOrder(response.data.data));
      return response.data;
    })
    .catch((error) => {
      throw new Error(error);
    });
}
