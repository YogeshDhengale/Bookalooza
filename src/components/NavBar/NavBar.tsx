// components/NavBar.tsx
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import UserMenu from "./Navigation/UserMenu";
import PodcastLink from "./Navigation/PodcastLink";
import CartLink from "./Navigation/CartLink";
import MobileNavigation from "./Navigation/MobileNavigation";
import NotificationLink from "./Navigation/Notification";
import { isUserLoggedIn } from "@/lib/utils";
import { Link } from "react-router";
import { getPaymentConfig } from "@/actions/Payment/Payment";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

interface Config {
  gateway: string;
  key: string;
}

const NavBar = () => {
  const dispatch = useAppDispatch();
  const [isLoggedIn, setLoggedIn] = useState(isUserLoggedIn());
  const [config, setConfig] = useState<Config>();
  const { user, isUserFetched } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState<Boolean>(false);

  useEffect(() => {
    setLoggedIn(isUserLoggedIn());
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      getPaymentConfig().then((cnf) => {
        setConfig(cnf);
        if (
          isUserFetched &&
          user.linkId &&
          user.gatewayPaymentStatus !== "success"
        ) {
          setOpen(true);
        }
      });
    }
  }, [isLoggedIn, dispatch, isUserFetched, user]);

  return (
    <header className="w-full text-app-primary sticky top-0 z-20 bg-background/95 px-4 py-2">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MobileNavigation />
          <Logo />
          <Navigation />
        </div>

        <div className="flex items-center space-x-3">
          {(isLoggedIn || user?.userId) ? (
            <>
              <PodcastLink />
              <CartLink />
              <NotificationLink />
              <UserMenu />
            </>
          ) : (
            <Link to="/sign-in">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
