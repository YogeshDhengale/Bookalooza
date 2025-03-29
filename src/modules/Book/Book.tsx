import React from "react";
import { useLocation } from "react-router";

function Book() {
  const location = useLocation();

  const slug = decodeURIComponent(window.location.pathname.split('/').pop());
  return <h1 className="text-3xl text-red-500">{slug}</h1>
}

export default Book;
