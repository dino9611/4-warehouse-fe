import React from "react";
import "./styles/skeletonCardCategory.css";

function SkeletonCardCategory() {
  return (
    <div className="skel-card-category-wrapper d-flex flex-column align-items-center justify-content-between p-2">
      <div className="skel-card-category-inner-circle skel-card-category-anim"></div>
      <div className="flex-fill d-flex flex-column align-items-center justify-content-center w-100 skel-card-category-anim">
        <div className="skel-card-category-text mb-2"></div>
        <div className="skel-card-category-text skel-card-category-text-sm"></div>
      </div>
    </div>
  );
}

export default SkeletonCardCategory;
