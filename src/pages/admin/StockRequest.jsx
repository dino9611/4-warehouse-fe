import React from "react";
import { useLocation } from "react-router-dom";

function StockRequest() {
  const location = useLocation();

  console.log(location.state);

  return <div></div>;
}

export default StockRequest;
