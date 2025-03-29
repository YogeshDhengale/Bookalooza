import { earningSliceActions } from "@/store/EarningSlice/EarningSlice";
import { AppDispatch } from "@/store/store";
import Transaction, { type_earning } from "@/types/EarningTypes";
import axios from "axios";

const BASE_URL = "/designer/earnings";

interface Response {
  data: type_earning[];
  success: boolean;
}

export function fetchUsersEarings() {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<Response>(`${BASE_URL}/bookWise`);

      const { data, success } = response.data;
      if (success) {
        dispatch(earningSliceActions.fetchEarnings(data));
      }
    } catch (error) {
      new Error(error);
    }
  };
}

export function fetchTransferredEarnings(id) {
  let filter = {
    where: {
      userId: id,
      status: { $in: ["processing", "processed"] },
    },
  };
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<{data: Transaction[], success: boolean}>(
        `/designer/redemption?filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch earnings");
      }

      dispatch(earningSliceActions.fetchTransferredEarnings(response.data.data));
    } catch (error) {
      throw new Error(error);
    }
  };
}
