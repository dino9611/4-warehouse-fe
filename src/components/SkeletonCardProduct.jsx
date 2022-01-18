import React from "react";
import "./styles/skeletonCardProduct.css";

function SkeletonCardProduct() {
  return (
    <div className="skeleton-card-wrapper d-flex flex-column justify-content-between">
      <div className="skeleton-card-img skeleton-card-anim"></div>
      <div className="flex-fill d-flex flex-column justify-content-between p-3">
        <div className="d-flex flex-column skeleton-card-anim">
          <div className="skeleton-card-category mb-1"></div>
          <div className="skeleton-card-title mb-1"></div>
          <div className="skeleton-card-title skeleton-card-title-sm"></div>
        </div>
        <div className="d-flex align-items-center justify-content-between skeleton-card-anim">
          <div className="skeleton-card-price"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCardProduct;
