// components/CartLink.tsx
import React from "react";
import { Link } from "react-router";
import { Bell } from "lucide-react";

const NotificationLink = () => (
  <Link to="/cart" aria-label="cart">
    <Bell className="w-6 h-6" />
  </Link>
);

export default NotificationLink;
