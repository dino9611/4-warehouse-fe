import React from "react";
import "./styles/skeletonListCart.css";

function SkeletonListCart() {
  return (
    <div className="d-flex justify-content-between w-100 skeleton-cart-anim">
      <div className="d-flex w-100">
        <div className="mr-4">
          <div className="skel-cart-img"></div>
        </div>
        <div className="d-flex flex-column justify-content-center w-100">
          <div className="skel-cart-name mb-2"></div>
          <div className="skel-cart-price"></div>
        </div>
      </div>
      <div className="d-flex flex-column w-100 align-items-end justify-content-end">
        <div className="skel-cart-hapus mb-1"></div>
        <div className="skel-cart-input"></div>
      </div>
    </div>
  );
}

export default SkeletonListCart;
