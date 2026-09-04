import React from "react";
import { Navigate } from "react-router-dom";

// Keep old shared links working while using one canonical checkout page.
export default function OrderRequest() {
  return <Navigate to="/Cart" replace />;
}
