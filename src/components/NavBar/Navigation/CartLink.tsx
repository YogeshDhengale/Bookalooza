// components/CartLink.tsx
import React from "react";
import { Link } from "react-router";
import { ShoppingCartIcon } from "lucide-react";

const CartLink = () => (
  <Link to="/cart" aria-label="cart">
    <ShoppingCartIcon className="w-6 h-6" />
  </Link>
);

export default CartLink;
