import axios from 'axios';
import Consts from '@/lib/consts';
import { store } from '@/store/store';
import { alertSliceActions } from '@/store/Alert/Alert';
import { toast } from 'sonner';

declare global {
  interface Window {
    loading?: (state: boolean) => void;
    error?: (state: boolean) => void;
  }
}

// Ensure global settings are applied
axios.defaults.withCredentials = true;

// Request Interceptor
axios.interceptors.request.use(
  (request) => {
    window.loading?.(true);
    store.dispatch(alertSliceActions.loading(true));
    if(!navigator.onLine) toast.warning("You are offline, please check your internet connection.");
    return request;
  },
  (error) => {
    window.loading?.(false);
    store.dispatch(alertSliceActions.loading(false));
    return Promise.reject(error);
  }
);

// Response Interceptor
axios.interceptors.response.use(
  (response) => {
    window.loading?.(false);
    store.dispatch(alertSliceActions.loading(false));
    return response;
  },
  (error) => {
    window.loading?.(false);
    store.dispatch(alertSliceActions.loading(false));
    console.log("Error detected:", error);

    if (error.response) {
      console.log("Response status:", error.response.status);
      if (error.response.status === 401) {
        console.log("401 detected, redirecting...");
        localStorage.removeItem("isLoggedIn")
        window.location.href = `${Consts.BASE_URL}/sign-in`;
      }
    } else {
      console.log("No response object - possible network error");
    }

    window.error?.(true);
    store.dispatch(alertSliceActions.error(true));
    return Promise.reject(error);
  }
);
