import axios, { post } from "axios";
import Consts from "@/lib/consts";
import { userSliceActions } from "@/store/UsersSlice/UserSlice";
import { type_user } from "@/types/UsersTypes";
import { NavigateFunction } from "react-router";
import { AppDispatch } from "@/store/store";

const BASE_URL = "/designer/user";

interface User {
  data: type_user[];
  success: boolean;
}

/*

export function() {
    return axios<Response>({
        url: `${BASE_URL}`,
        method: "GET",
    }).then((response) => {
        const { data, success } = response.data;
        if(success){
            
        } else {
            throw response.data;  
        }
    }).catch((error) => {
        throw new Error(error);;
    });
}

*/

interface SignInResponse {
  success: boolean;
  token: string;
  user: type_user;
}

export function signIn(
  data: { userId: string; password: string },
  navigate: NavigateFunction,
  dispatch: AppDispatch
) {
  return axios
    .post<SignInResponse>(`${BASE_URL}/login`, data)
    .then((response) => {
      const { success, token, user } = response.data;
      if (success) {
        localStorage.setItem("isLoggedIn", "true");
        dispatch(userSliceActions.fetchProfile(user));
        navigate(-1);
        return { success, token, user };
      } else {
        throw response.data;
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export function updateProfile(dispatch: AppDispatch, formData: FormData) {
  return axios
    .post<{ data: type_user; success: boolean }>(
      `${BASE_URL}/updateProfile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      const { data, success } = res.data;
      if (success) {
        dispatch(userSliceActions.fetchProfile(data));
      }
      return { data, success };
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      throw err; // Or handle the error accordingly
    });
}

export function logout(dispatch: AppDispatch, navigate: NavigateFunction) {
  return axios<{ success: boolean }>({
    url: `${BASE_URL}/logout`,
    method: "GET",
  })
    .then((res) => {
      localStorage.removeItem("isLoggedIn");
      dispatch({ type: "RESET_STORE" });
      navigate("/");
      return res.data;
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export function fetchProfile(dispatch: AppDispatch) {
  return axios<User>({
    url: `${BASE_URL}/profile`,
    method: "GET",
  })
    .then((response) => {
      const { data, success } = response.data;
      if (success) {
        dispatch(userSliceActions.fetchProfile(data));
        return data; // Now `data` is typed as UserProfile
      } else {
        throw new Error("Failed to fetch profile");
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export function fetchAllStartAuthors(dispatch: any) {
  return axios<User>({
    url: `${BASE_URL}/starAuthors`,
    method: "GET",
  })
    .then((response) => {
      const { data, success } = response.data;
      if (success) {
        dispatch(userSliceActions.fetchStartAuthors(data));
      } else {
        throw response.data;
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}
