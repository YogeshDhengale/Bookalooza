import Consts from "@/lib/consts";
import React from "react";
import { Link } from "react-router";
// import logo from "@/assets/logo.png";

const Logo = () => (
  <Link to="/" className="!m-0" aria-label="Bookalooza">
    <img
      src={Consts.logo}
      alt="Bookalooza"
      width={24}
      height={24}
      className="w-7 mx-auto"
      loading="lazy"
    />
  </Link>
);

export default Logo;
