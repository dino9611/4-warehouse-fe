import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./style/cart.css";

// Components

import ButtonPrimary from "./../../components/ButtonPrimary";
import Modal from "./../../components/Modal";
import thousandSeparator from "../../helpers/ThousandSeparator";
import { API_URL } from "../../constants/api";
import images from "./../../assets";

function Cart() {
  const [dataCart, setDataCart] = useState([]); // Data cart detail
  const [handleDelete, setHandleDelete] = useState(false); // State untuk delete product di cart detail
  const [errorStock, setErrorStock] = useState([]);

  // Id dan name product di cart detail untuk delete dan update qty

  const [idProd, setIdProd] = useState("");
  const [nameProd, setNameProd] = useState("");

  // Use history

  const history = useHistory();

  // Get data cart detail dari database

  useEffect(() => {
    (async () => {
      try {
        if (!handleDelete) {
          let res = await axios.get(`${API_URL}/transaction/get/cart-detail/2`); // User id menggunakan redux (sementara seperti ini)

          setDataCart(res.data);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    })();
  }, [handleDelete]);

  // Render modal delete produk

  const renderModalDelete = () => {
    return (
      <>
        <div className="mb-3">
          {`Apakah anda yakin ingin menghapus ${
            nameProd.charAt(0).toUpperCase() + nameProd.slice(1)
          } dari keranjang?`}
        </div>
        <div className="d-flex justify-content-end">
          <div className="mr-2">
            <ButtonPrimary onClick={deleteProductCart}>Delete</ButtonPrimary>
          </div>
          <ButtonPrimary onClick={() => setHandleDelete(false)}>
            Cancel
          </ButtonPrimary>
        </div>
      </>
    );
  };

  // Handle untuk open modal delete

  const openModalDelete = (id, name) => {
    setHandleDelete(!handleDelete);
    setIdProd(id);
    setNameProd(name);
  };

  // Function submit delete produk

  const deleteProductCart = async () => {
    try {
      await axios.patch(`${API_URL}/transaction/delete/cart-detail/${idProd}`);

      setHandleDelete(false);
      alert("produk berhasil dihapus"); // Sementara pake alert (diganti snackbar)
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Function untuk edit qty produk di cart detail
  // Tambah qty produk

  const onClickPlusQty = async (index, id, qty, stock) => {
    if (qty < stock) {
      setDataCart([
        ...dataCart.slice(0, index),
        { ...dataCart[index], qty: dataCart[index].qty + 1 },
        ...dataCart.slice(index + 1),
      ]);

      try {
        await axios.patch(`${API_URL}/transaction/edit/cart-detail/${id}`, {
          qty: dataCart[index].qty + 1,
        });
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  // Kurang qty produk

  const onClickMinusQty = async (index, id, qty, stock) => {
    if (qty <= 1) {
      setIdProd(id);
      setHandleDelete(true);
      return;
    }

    try {
      setDataCart([
        ...dataCart.slice(0, index),
        { ...dataCart[index], qty: dataCart[index].qty - 1 },
        ...dataCart.slice(index + 1),
      ]);

      await axios.patch(`${API_URL}/transaction/edit/cart-detail/${id}`, {
        qty: dataCart[index].qty - 1,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Input qty dengan on change

  const onChangeInputQty = (e, index, id, qty, stock) => {
    if (e.target.value === "" || e.target.value <= 0) {
      setDataCart([
        ...dataCart.slice(0, index),
        { ...dataCart[index], qty: 0 },
        ...dataCart.slice(index + 1),
      ]);
      console.log("Jumlah harus diisi"); // Sementara seperti ini dulu, nanti diganti yang lebih bagus
      return;
    }

    if (e.target.value > stock) {
      setDataCart([
        ...dataCart.slice(0, index),
        { ...dataCart[index], qty: parseInt(e.target.value) },
        ...dataCart.slice(index + 1),
      ]);
      console.log(`maksimal pembelian ${stock} barang`); // Sementara seperti ini dulu, nanti diganti yang lebih bagus
      return;
    }

    setDataCart([
      ...dataCart.slice(0, index),
      { ...dataCart[index], qty: parseInt(e.target.value) },
      ...dataCart.slice(index + 1),
    ]);
  };

  // Proteksi untuk input qty dengan on blur (request backend ada di onblur)

  const onBlurInputQty = async (e, index, id, qty, stock) => {
    let qtyProd = parseInt(e.target.value);

    if (dataCart[index].qty === 0) {
      setDataCart([
        ...dataCart.slice(0, index),
        { ...dataCart[index], qty: 1 },
        ...dataCart.slice(index + 1),
      ]);
      qtyProd = 1;
    }

    if (dataCart[index].qty > stock) {
      setDataCart([
        ...dataCart.slice(0, index),
        { ...dataCart[index], qty: parseInt(stock) },
        ...dataCart.slice(index + 1),
      ]);
      qtyProd = parseInt(stock);
    }

    try {
      await axios.patch(`${API_URL}/transaction/edit/cart-detail/${id}`, {
        qty: qtyProd,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Render list product cart detail yang ada di state dataProduct

  const renderListCart = () => {
    return dataCart.map((el, index) => {
      let error = errorStock.findIndex((element) => element == el.product_id);

      return (
        <>
          <div key={index} className="d-flex">
            <img src={images.footer} alt="" className="cart-list-img mr-3" />
            <div className="w-100 d-flex justify-content-between">
              <div className="d-flex flex-column justify-content-between">
                <div>
                  <div className="cart-categoryprod">
                    {el.category.charAt(0).toUpperCase() + el.category.slice(1)}
                  </div>
                  <div className="cart-nameprod">
                    {el.name.charAt(0).toUpperCase() + el.name.slice(1)}
                  </div>
                </div>
                <div className="cart-priceprod">
                  {`Rp ${thousandSeparator(el.price)}`}{" "}
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between align-items-end">
                <div
                  className="align-self-end"
                  style={{ cursor: "pointer" }}
                  onClick={() => openModalDelete(el.id, el.name)}
                >
                  <img src={images.trash} alt="trash" />
                </div>
                <div className="cart-qty d-flex align-self-end">
                  <button
                    className="cart-btn"
                    onClick={() =>
                      onClickMinusQty(index, el.id, el.qty, el.total_stock)
                    }
                  >
                    <img src={images.minus} alt="minus" />
                  </button>
                  <input
                    type="number"
                    className="cart-inputqty d-flex justify-content-center w-100"
                    value={el.qty}
                    onChange={(e) =>
                      onChangeInputQty(e, index, el.id, el.qty, el.total_stock)
                    }
                    onBlur={(e) =>
                      onBlurInputQty(e, index, el.id, el.qty, el.total_stock)
                    }
                  />
                  <button
                    className="cart-btn"
                    onClick={() =>
                      onClickPlusQty(index, el.id, el.qty, el.total_stock)
                    }
                  >
                    <img src={images.plus} alt="plus" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="textbox-error-msg mt-1 d-flex justify-content-end">
            {error >= 0 || el.qty > el.total_stock
              ? `Maks. pembelian ${el.total_stock} barang`
              : null}
            {el.qty === 0 ? "Jumlah harus diisi" : null}
          </div>
          <div className="cart-border my-3"></div>
        </>
      );
    });
  };

  // Fungsi untuk menjumlahkan jumlah semua barang yang ada di cart

  const totalItem = () => {
    return dataCart
      .map((el) => {
        return el.qty;
      })
      .reduce((prev, curr) => prev + curr, 0);
  };

  // Fungsi untuk menjumlahkan jumlah harga pada cart

  const totalPrice = () => {
    return dataCart
      .map((el) => {
        return el.price * el.qty;
      })
      .reduce((prev, curr) => prev + curr, 0);
  };

  // Cek stock yang dikirim ke backend

  const checkStock = async () => {
    try {
      let res = await axios.get(`${API_URL}/transaction/check-stock/2`); // :userId dapat dari auth user di redux

      setErrorStock(res.data);

      if (!res.data.length) {
        history.push("/checkout");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // if (!res.data.length) {
  //   <Redirect to="/checkout" />;
  // }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="cart-left col-8">
          <div className="cart-left-container">
            <div className="cart-title">Keranjang</div>
            <div className="cart-border my-3"></div>
            <div className="cart-list-wrapper">{renderListCart()}</div>
          </div>
        </div>
        <div className="cart-right col-4">
          <div className="cart-right-container">
            <div className="cart-title">Ringkasan belanja</div>
            <div className="cart-border my-3"></div>
            <div className="d-flex justify-content-between">
              <div className="cart-totalprice">{`Total harga (${totalItem()} barang)`}</div>
              <div className="cart-totalprice">{`Rp ${thousandSeparator(
                totalPrice()
              )}`}</div>
            </div>
            <div className="cart-border my-3"></div>
            <div className="d-flex justify-content-between mb-3">
              <div className="cart-total">{`Total harga`}</div>
              <div className="cart-total">{`Rp ${thousandSeparator(
                totalPrice()
              )}`}</div>
            </div>
            <div>
              <ButtonPrimary width="w-100" onClick={checkStock}>
                Beli
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
      <div className="container-modal">
        <Modal open={handleDelete} close={() => setHandleDelete(false)}>
          {renderModalDelete()}
        </Modal>
      </div>
    </div>
  );
}

export default Cart;
