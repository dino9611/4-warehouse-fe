import React, { useRef, useState } from "react";
import "./styles/cardProduct.css";
import ButtonPrimary from "./ButtonPrimary";
import thousandSeparator from "./../helpers/ThousandSeparator";
import SnackbarCart from "./SnackbarCart";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../constants/api";
import images from "./../assets";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";

function CardProduct({
  img,
  category,
  title,
  discount,
  price,
  total_stock,
  data,
}) {
  const dataUser = useSelector((state) => state.auth);
  const dataSnackbar = useSelector((state) => state.snackbarMessageReducer);
  const dispatch = useDispatch();
  const snackbarRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const onClickAddToCart = async () => {
    const dataInsert = {
      user_id: dataUser.id,
      product_id: data.id,
      qty: 1,
    };

    try {
      if (!dataUser.is_login) {
        dispatch({
          type: "SHOWSNACKBAR",
          payload: {
            status: "error",
            message: "Kamu belum login, silahkan login dulu.",
          },
        });

        dataSnackbar.ref.current.showSnackbarMessage();

        return;
      }

      setLoading(true);

      await axios.post(`${API_URL}/transaction/addtocart`, dataInsert);

      let resTotalItem = await axios.get(
        `${API_URL}/transaction/get/total-item/${dataUser.id}`
      );

      dispatch({ type: "DATACART", payload: resTotalItem.data });

      setLoading(false);

      snackbarRef.current.showSnackbar();
    } catch (error) {
      setLoading(false);
      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "error",
          message: error.response?.data.message || "Server error",
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();
    }
  };

  const renderSnackbarContent = () => {
    return (
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center mb-3">
          <img src={images.success} alt="" className="mr-1" />
          <div className="profile-fs14-500-black">Ditambahkan ke keranjang</div>
        </div>
        <div className="d-flex mb-3">
          <img
            src={`${API_URL}/${data.images[0]}`}
            alt=""
            className="detailed-prod-snackbar-img mr-3"
          />
          <div className="align-self-center">
            <div className="detailed-prod-snackbar-price">
              {`1 barang x Rp ${thousandSeparator(data.price)}`}
            </div>
            <div className="profile-fs12-600-black">
              {data.name.length > 25
                ? data.name.charAt(0).toUpperCase() +
                  data.name.slice(1, 25) +
                  "..."
                : data.name.charAt(0).toUpperCase() + data.name.slice(1)}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between w-100">
          <Link to="/cart" className="w-100 mr-3">
            <button className="detailed-prod-snackbar-btn w-100 mr-3">
              Lihat keranjang
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="card-product-wrapper d-flex flex-column justify-content-between">
      <Link
        className="text-link"
        to={{
          pathname: `/products/${data.id}`,
          state: data,
        }}
      >
        <div>
          <img
            src={img}
            alt=""
            className="card-product-img skeleton"
            style={{ opacity: !total_stock ? "0.5" : null }}
          />
        </div>
      </Link>
      <div className="d-flex flex-column justify-content-between px-3 h-100 py-3">
        <div className="d-flex flex-column">
          <div
            className={`card-product-category`}
            style={{ color: !total_stock ? "#cacaca" : null }}
          >
            {category}
          </div>
          <div className="card-product-name">
            {title.length > 30
              ? title.charAt(0).toUpperCase() + title.slice(1, 30) + "..."
              : title.charAt(0).toUpperCase() + title.slice(1)}
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column">
            {discount ? (
              <div className="card-product-diskon">Rp {discount}</div>
            ) : null}
            <div
              className="card-product-price"
              style={{ color: !total_stock ? "#5a5a5a" : null }}
            >{`Rp ${thousandSeparator(price)}`}</div>
          </div>
          <div className="w-50 ">
            <ButtonPrimary
              width="w-100"
              disabled={!total_stock || loading ? true : false}
              onClick={onClickAddToCart}
            >
              {!total_stock ? (
                "Habis"
              ) : loading ? (
                <Spinner color="light" size="sm">
                  Loading...
                </Spinner>
              ) : (
                "Beli"
              )}
            </ButtonPrimary>
          </div>
        </div>
      </div>

      <div>
        <SnackbarCart ref={snackbarRef}>{renderSnackbarContent()}</SnackbarCart>
      </div>
    </div>
  );
}

export default CardProduct;
