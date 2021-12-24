import React from "react";
import "./styles/cardProduct.css";
import produk1 from "./../assets/produk1.svg";
import ButtonPrimary from "./ButtonPrimary";

function CardProduct({ img, category, title, discount, price, btn }) {
  return (
    <div className="card-product-wrapper d-flex flex-column justify-content-between">
      <div>
        <img src={img} alt="" className="card-product-img" />
      </div>
      <div className="d-flex flex-column justify-content-around px-3 h-100">
        <div className="d-flex flex-column mb-4">
          <div className="card-product-category">{category}</div>
          <div className="card-product-name">{title}</div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column">
            {discount ? (
              <div className="card-product-diskon">Rp {discount}</div>
            ) : null}
            <div className="card-product-price">Rp {price}</div>
          </div>
          {/* <div className="w-50">
            <ButtonPrimary name={btn} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CardProduct;
