import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./styles/detailedProduct.css";

// Components

import thousandSeparator from "./../../helpers/ThousandSeparator";
import ButtonPrimary from "../../components/ButtonPrimary";
import { API_URL } from "./../../constants/api.js";
import { Spinner } from "reactstrap";
import images from "./../../assets";

// Material UI

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import SnackbarCart from "../../components/SnackbarCart";

function DetailedProduct(props) {
  const [dataProduct, setDataProduct] = useState(); // Data produk
  const [inputQty, setInputQty] = useState(1); // Input qty produk
  const [mainImg, setMainImg] = useState(""); // Set untuk main photo
  const [handleSeeText, setHandleSeeText] = useState(false); // Handle untuk see more atau less deskripsi produk
  const [handleSnackbarCart, setHandleSnackbarCart] = useState(false);
  const [loading, setLoading] = useState(false); // Loading pada saat add to cart

  const dispatch = useDispatch();
  const dataUser = useSelector((state) => state.auth);

  const location = useLocation(); // Location untuk params product Id

  console.log(dataProduct);

  // Set state untuk data produk

  useEffect(() => {
    if (!props.location.state) {
      (async () => {
        try {
          let res = await axios.get(
            `${API_URL}/product/detailed-product/${props.match.params.productId}`
          );

          setDataProduct(res.data[0]);
        } catch (error) {
          console.log(error);
        }
      })();
    } else {
      setDataProduct(location.state);
      setMainImg(location.state.images[0]);
    }
  }, []);

  // RENDERING

  // Render Breadcrumbs

  const breadcrumbs = [
    <Link to="/" className="text-link">
      <div className="detailed-product-breadcrumb">Home</div>
    </Link>,
    <Link to="/products" className="text-link">
      <div className="detailed-product-breadcrumb">Semua Product</div>
    </Link>,
    <div className="detailed-product-breadcrumb">
      {dataProduct?.name.charAt(0).toUpperCase() + dataProduct?.name.slice(1)}
    </div>,
  ];

  // Render list image

  const renderImage = () => {
    return dataProduct?.images.map((el, index) => {
      return (
        <div className="mb-3" onMouseOver={() => setMainImg(el)}>
          <img
            src={`${API_URL}/${el}`}
            alt="list-photo"
            className={
              el === mainImg
                ? `detailed-product-listcontent hover-active`
                : "detailed-product-listcontent"
            }
          />
        </div>
      );
    });
  };

  // Render deskripsi produk right side

  const renderProductDesc = () => {
    return (
      <div>
        <div className="mb-3">
          <div className="detailed-product-content-name mb-3">
            {`${
              dataProduct?.name.charAt(0).toUpperCase() +
              dataProduct?.name.slice(1)
            }`}
          </div>
          <div className="detailed-product-content-price d-flex w-100">
            {`Rp ${thousandSeparator(dataProduct?.price)}`}
          </div>
        </div>
        <div className="detailed-product-content-spec-wrapper d-flex mb-2">
          <div className="detailed-product-content-spec d-flex flex-column mr-4">
            <div>Kategori</div>
            <div className="my-2">Berat</div>
            <div>Stok</div>
          </div>
          <div className="d-flex flex-column ">
            <div className="detailed-product-content-category">
              {dataProduct?.category.charAt(0).toUpperCase() +
                dataProduct?.category.slice(1)}
            </div>
            <div className="detailed-product-content-weight my-2">
              {dataProduct?.weight}
            </div>
            <div className="detailed-product-content-weight">
              {dataProduct?.total_stock}
            </div>
          </div>
        </div>
        <div className="detailed-product-content-spec">
          <div className="mb-2">Deskripsi</div>
          {seeMore()}
          <div>
            {dataProduct?.description.length > 700 ? (
              handleSeeText ? (
                <button
                  className="detailed-product-seeless w-100 py-2"
                  onClick={() => setHandleSeeText(!handleSeeText)}
                >
                  Lihat lebih sedikit
                </button>
              ) : (
                <button
                  className="detailed-product-seemore w-100 py-2"
                  onClick={() => setHandleSeeText(!handleSeeText)}
                >
                  Lihat selengkapnya
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    );
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
            src={`${API_URL}/${mainImg}`}
            alt=""
            className="detailed-prod-snackbar-img mr-3"
          />
          <div className="align-self-center">
            <div className="detailed-prod-snackbar-price">
              {`${inputQty} barang x Rp ${thousandSeparator(
                dataProduct?.price
              )}`}
            </div>
            <div className="profile-fs12-600-black">
              {dataProduct?.name.length > 25
                ? dataProduct?.name.charAt(0).toUpperCase() +
                  dataProduct?.name.slice(1, 25) +
                  "..."
                : dataProduct?.name.charAt(0).toUpperCase() +
                  dataProduct?.name.slice(1)}
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

  // EVENT

  // Ubah qty produk menggunakan on change

  const onChangeInputQty = (e) => {
    // Kondisi jika input yang dimasukkan kurang dari sama dengan 0 atau string kosong

    if (e.target.value === "" || e.target.value <= 0) {
      setInputQty(0);
      return;
    }

    // Kondisi jika input yang dimasukkan lebih dari total stock

    if (e.target.value > dataProduct?.total_stock) {
      setInputQty(parseInt(e.target.value));
      return;
    }

    // Jika user menginput angka 0 didepan angka sebelumnya

    if (e.target.value[0] <= "0") {
      let value = e.target.value.slice(1);
      setInputQty(value);
      return;
    }

    setInputQty(parseInt(e.target.value));
  };

  // Proteksi onblur pada input qty onchange

  const onBlurInputQty = () => {
    // Jika input yang diberikan 0 makan ketika on blur input qty berubah menjadi 1

    if (inputQty === 0) {
      setInputQty(1);
    }

    // Jika input yang diberikan lebih dari stock maka akan set input qty menjadi jumlah maksimal stok

    if (inputQty > dataProduct?.total_stock) {
      setInputQty(parseInt(dataProduct?.total_stock));
    }
  };

  // Tambah qty produk menggunakan onclick pada button +

  const onClickPlusQty = () => {
    if (inputQty < dataProduct.total_stock) {
      setInputQty(parseInt(inputQty) + 1);
    }
  };

  // Tambah qty produk menggunkan onclick pada button -

  const onClickMinusQty = () => {
    if (inputQty > 1) {
      setInputQty(parseInt(inputQty) - 1);
    }
  };

  // Fungsi see more untuk melihat banyak dan sedikit deskripsi produk

  const seeMore = () => {
    let text;

    if (!handleSeeText) {
      text = dataProduct?.description.slice(0, 700);
    } else {
      text = dataProduct?.description;
    }

    return <div className="detailed-product-content-description">{text}</div>;
  };

  // Onclik untuk add to cart

  const onClickAddToCart = async () => {
    const dataInsert = {
      user_id: dataUser.id,
      product_id: dataProduct.id,
      qty: inputQty,
    };

    try {
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
      alert(error.response.data.message); // Sementara pake alert
      console.log(error.response.data.message);
    }
  };

  const snackbarRef = useRef(null);

  // RETURN

  return (
    <div className="container">
      <div className="row">
        <div className="mt-3 mb-4">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="10" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </div>
      </div>
      <div className="row">
        <div className="detailed-product-wrapper left-side col-7 d-flex">
          <div className="detailed-product-listphoto d-flex flex-column align-items-center">
            <div className="detailed-product-listphoto-wrapper d-flex flex-column align-items-center justify-content-start">
              {renderImage()}
            </div>
          </div>
          <div className="detailed-product-photoproduct mx-3">
            <img
              src={`${API_URL}/${mainImg}`}
              alt="photo-product"
              className="detailed-product-img"
            />
          </div>
        </div>
        <div className="detailed-product-wrapper col-5">
          <div className="detailed-product-content d-flex flex-column justify-content-between ml-3 p-4">
            {renderProductDesc()}
            <div className="d-flex flex-column justify-content-between mt-4">
              <div className="detailed-product-jumlah mb-2">Jumlah</div>
              <div className="d-flex justify-content-between ">
                <div className="detailed-product-setqty d-flex mr-4">
                  <button
                    className="detailed-product-btnminus"
                    onClick={onClickMinusQty}
                  >
                    <img
                      src={inputQty === 1 ? images.minus : images.minusactive}
                      alt="minus"
                    />
                  </button>
                  <input
                    type="number"
                    className="detailed-product-inputqty d-flex justify-content-center w-100"
                    value={inputQty}
                    onChange={onChangeInputQty}
                    onBlur={onBlurInputQty}
                  />
                  <button
                    className="detailed-product-btnplus"
                    onClick={onClickPlusQty}
                  >
                    <img
                      src={
                        inputQty === parseInt(dataProduct?.total_stock)
                          ? images.plus
                          : images.plusactive
                      }
                      alt="plus"
                    />
                  </button>
                </div>

                <ButtonPrimary
                  onClick={onClickAddToCart}
                  width="w-50"
                  disabled={
                    loading ||
                    inputQty > parseInt(dataProduct?.total_stock) ||
                    inputQty < 1
                      ? true
                      : false
                  }
                >
                  {!loading ? (
                    "Tambah ke keranjang"
                  ) : (
                    <Spinner color="light" size="sm">
                      Loading...
                    </Spinner>
                  )}
                </ButtonPrimary>
              </div>
              <div className="textbox-error-msg mt-2 w-50">
                {inputQty === 0 || inputQty > dataProduct?.total_stock
                  ? inputQty > dataProduct?.total_stock
                    ? `Maks. pembelian ${dataProduct?.total_stock} barang`
                    : `Minimal pembelian produk ini adalah 1 barang`
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <SnackbarCart ref={snackbarRef}>{renderSnackbarContent()}</SnackbarCart>
      </div>
    </div>
  );
}

export default DetailedProduct;
