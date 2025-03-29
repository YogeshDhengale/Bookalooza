import { bankSliceActions } from "@/store/BankSlice/BankSlice";
import { AppDispatch } from "@/store/store";
import { type_bank_account, type_create_bank } from "@/types/BankTypes";
import axios from "axios";
const BASE_URL = "/designer/bank";

interface Response {
  data: type_bank_account[];
  success: boolean;
}

export function fetchUserBanks(userId: string) {
  return async (dispatch: AppDispatch) => {
    if (!userId) return;
    try {
      const response = await axios.get<Response>(
        `${BASE_URL}?filter=${encodeURIComponent(
          JSON.stringify({ where: { userId } })
        )}`
      );

      const { data, success } = response.data;
      if (success) {
        dispatch(bankSliceActions.fetchUserBank(data));
      }
    } catch (error) {
      new Error(error);
    }
  };
}

export function createBankAccount(bankData: type_create_bank) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post<type_bank_account>(
        `${BASE_URL}/add`,
        bankData
      );
      if (response.status === 200) {
        dispatch(bankSliceActions.addBankAccount(response.data))
      }
    } catch (error) {
      new Error(error);
    }
  };
}

export function deleteBankAccount(bankId: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${bankId}`);
      if (response.status === 200) {
        dispatch(bankSliceActions.deleteBankAccount(bankId));
      }
    } catch (error) {
      new Error(error);
    }
  };
}
