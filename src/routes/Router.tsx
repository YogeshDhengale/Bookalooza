import React from "react";
import { Route, Routes } from "react-router";
import ContactUs from "@/modules/ContactUs/ContactUs";
import ForgetPassword from "@/modules/ForgetPassword/ForgetPassword";
import Home from "@/modules/Home/Home";
import SignIn from "@/modules/SignIn/SignIn";
import SignUp from "@/modules/SignUp/SignUp";

import School from "@/modules/Workshop/School/School";
import Student from "@/modules/Workshop/Student/Student";
import Create from "@/modules/Create/Create";
import Book from "@/modules/Book/Book";
import Product from "@/modules/Product/Product";
import Blogs from "@/modules/Blogs/Blogs";
import Podcasts from "@/modules/Podcasts/Podcasts";
import Features from "@/modules/Features/Features";

// static screens
import AboutUs from "@/modules/AboutUs/AboutUs";
import PricingRoyalty from "@/modules/StaticScreens/PricingRoyalty/PricingRoyalty";
import TermsConditions from "@/modules/StaticScreens/TermsConditions/TermsConditions";
import Refund from "@/modules/StaticScreens/Refund/Refund";
import Shipping from "@/modules/StaticScreens/Shipping/Shipping";
import PrivacyPolicies from "@/modules/StaticScreens/PrivacyPolicies/PrivacyPolicies";
import FAQ from "@/modules/StaticScreens/FAQ/FAQ";

// user dashboard
import UserDashboard from "@/modules/UserDashboard/UserDashboard";
import Dashboard from "@/modules/UserDashboard/Dashboard/Dashboard";
import Profile from "@/modules/UserDashboard/Profile/Profile";
import Library from "@/modules/UserDashboard/Library/Library";
import OrderHistory from "@/modules/UserDashboard/OrderHistory/OrderHistory";
import BankDetails from "@/modules/UserDashboard/BankDetails/BankDetails";
import Earnings from "@/modules/UserDashboard/Earnings/Earnings";
import TransferredRoyalty from "@/modules/UserDashboard/TransferredRoyalty/TransferredRoyalty";
import Notifications from "@/modules/UserDashboard/Notifications/Notifications";
import Achievements from "@/modules/UserDashboard/Achievements/Achievements";
import Invoice from "@/modules/UserDashboard/Invoice/Invoice";
import Store from "@/modules/Store/Store";

function Router() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />

      {/* Auth Pages */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />

      {/* Create Book */}
      <Route path="/newbook" element={<Create/>} />

      {/* book */}
      <Route path="/book/:slug" element={<Book />} />
      <Route path="/book/edit/:slug" element={<Book />} />

      {/* Store */}
      <Route path="/store" element={<Store />} />
      <Route path="/details/:slug" element={<Product />} />

      {/* blog */}
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:slug" element={<Blogs />} />

      {/* podcast */}
      <Route path="/podcasts" element={<Podcasts />} />

      {/* Protected Pages */}
      <Route path="/user" element={<UserDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="library" element={<Library />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="bank-details" element={<BankDetails />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="royalty-earned" element={<TransferredRoyalty />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="order-history/:id" element={<Invoice />} />
      </Route>

      {/* Workshop */}
      <Route path="/workshops/school" element={<School />} />
      <Route path="/workshops/student" element={<Student />} />

      {/* static pages */}
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/pricing-royalties" element={<PricingRoyalty />} />
      <Route path="/terms-and-conditions" element={<TermsConditions />} />
      <Route path="/refund-cancellation" element={<Refund />} />
      <Route path="/shipping-policy" element={<Shipping />} />
      <Route path="/privacy-policy" element={<PrivacyPolicies />} />
      <Route path="/frequently-asked-questions" element={<FAQ />} />
      <Route path="/features" element={<Features />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default Router;
