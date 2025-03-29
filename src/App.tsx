import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "@/components/ui/sonner";
import { fetchProfile } from "./actions/UserAction/UserAction";
import Router from "@/routes/Router";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import "@/lib/axios";
import { isUserLoggedIn } from "./lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { toast } from "sonner";
import { alertSliceActions } from "./store/Alert/Alert";
import useNetworkStatus from "./hooks/useNetworkStatus";

declare global {
  interface Window {
    loading?: (isLoading: boolean) => void;
    error?: (hasError: boolean) => void;
  }
}

function Layout() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isUserFetched } = useAppSelector((state) => state.user);
  const { error } = useAppSelector((state) => state.alert);
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isUserLoggedIn() && !isUserFetched) {
      fetchProfile(dispatch);
    }
  }, [isUserFetched, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Request failed, Please try again");
    }

    dispatch(alertSliceActions.error(false));
  }, [error, dispatch]);

  return (
    <main className="w-full h-full ">
      {!location.pathname.includes("/book") && <NavBar />}
      <Router />
      {!location.pathname.includes("/book") && <Footer />}
    </main>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout />
        <Toaster position="top-center" richColors icons={{}} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
