import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Import komponen

import thousandSeparator from "../../helpers/ThousandSeparator";
import { API_URL } from "../../constants/api.js";
import images from "../../assets";
import "./style/cartDetail.css";
import "./style/checkout.css";
import ButtonPrimary from "../../components/ButtonPrimary.jsx";
import Modal from "../../components/Modal";

function Checkout(props) {
  const [dataCart, setDataCart] = useState([]); // Data list produk dari tabel cart_detail
  const [dataBank, setDataBank] = useState([]);
  const [dataAddress, setDataAddress] = useState({}); // Data alamat user
  const [listAddress, setListAddress] = useState([]); // List data alamat user
  const [shipping, setShipping] = useState({}); // Get data ongkir
  const [pickShipping, setPickShipping] = useState(0); // Pilih jenis pengiriman
  const [handleAddress, setHandleAddress] = useState(false);
  const [pickBank, setPickBank] = useState({});

  // Get alamat utama dari user

  useEffect(() => {
    (async () => {
      try {
        // Get data cart detail
        let resCartDetail = await axios.get(
          `${API_URL}/transaction/get/cart-detail/2`
        );

        setDataCart(resCartDetail.data);

        // Get data bank
        let resBank = await axios.get(`${API_URL}/transaction/get/bank`);

        setDataBank(resBank.data);

        // Get data main address
        let resAddress = await axios.get(
          `${API_URL}/location/get/main-address/2` // user_id masih belum diganti dari redux
        );

        // Get shipping fee
        let resShipping = await axios.get(
          `${API_URL}/location/shipping-fee/${resAddress.data[0]?.id}`
        );

        // Cek apakah address ada atau tidak
        if (!resAddress.data.length) {
          setDataAddress(false);
          return;
        }

        // Get item "Address" dari local storage
        let addressInLocal = localStorage.getItem("address");

        // Cek apakah di local storage ada addressnya atau tidak, jika  ada maka dia akan set state menggunakan local storage, dan sebaliknya
        if (!addressInLocal) {
          setDataAddress(resAddress.data[0]);
        } else {
          setDataAddress(JSON.parse(addressInLocal));
        }

        setShipping(resShipping.data);
      } catch (error) {
        console.log(error);
        console.log(error.response.data.message);
      }
    })();
  }, []);

  // Render produk dari halaman keranjang

  const renderProduct = () => {
    return dataCart.map((el, index) => {
      return (
        <>
          <div key={index} className="cart-detail-prod d-flex ">
            <img
              src={images.footer}
              alt="imgcart"
              className="cart-detail-imgcart mr-3"
            />
            <div className="d-flex flex-column w-100">
              <div className="cart-detail-nameprod w-100">{el.name}</div>
              <div className="cart-detail-weightprod">{`${el.weight} gr`}</div>
              <div className="cart-detail-nameprod">
                <div>
                  {`Rp ${thousandSeparator(el.price)}`}{" "}
                  <span className="cart-detail-weightprod">{`x ${el.qty}`}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="cart-detail-border my-3"></div>
        </>
      );
    });
  };

  // Render address user

  const renderAddressTrue = () => {
    return (
      <>
        <div className="detail-cart-address-wrapper mb-2">
          <div>{dataAddress.recipient}</div>
          <div>{dataAddress.phone_number}</div>
          <div>{dataAddress.address}</div>
          <div>{`${dataAddress.city}, ${dataAddress.province}`}</div>
        </div>
        <div>
          <ButtonPrimary width="w-100" onClick={onClickOtherAddress}>
            Pilih alamat lain
          </ButtonPrimary>
        </div>
      </>
    );
  };

  // Render modal pilih alamat lain

  const renderDiffAddress = () => {
    return (
      <div className="w-100">
        <h5 className="d-flex justify-content-center w-100">
          Pilih Alamat Pengiriman
        </h5>
        <div className="mt-3">
          <ButtonPrimary width="w-100">Tambah alamat baru</ButtonPrimary>
        </div>
        <div className="cart-detail-border my-3"></div>
        <div className="checkout-listadd-wrapper">
          {listAddress?.map((el, index) => {
            return (
              <div className="checkout-listaddress mb-3">
                <div>{el.recipient}</div>
                <div>{el.phone_number}</div>
                <div>{el.address}</div>
                <div>{`${el.city}, ${el.province}`}</div>
                {el.is_main_address ? (
                  <div className="checkout-main-address">Utama</div>
                ) : null}
                <div>
                  <button className="checkout-btn-address mr-3">
                    Edit alamat
                  </button>
                  {el.is_main_address ? null : (
                    <button
                      className="checkout-btn-address"
                      onClick={() => onClickChangeMainAddress(el.id)}
                    >
                      Jadikan alamat utama
                    </button>
                  )}
                  {el.id === dataAddress?.id ? null : (
                    <ButtonPrimary
                      width="w-100"
                      onClick={() => pickAddress(el)}
                    >
                      Pilih alamat
                    </ButtonPrimary>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render address jika main address tidak ditemukan

  const renderAddressFalse = () => {
    return (
      <div className="detail-cart-address-wrapper mb-2">
        <div>Belum ada alamat</div>
        <div>
          <ButtonPrimary width="w-100">Tambah alamat baru</ButtonPrimary>
        </div>
      </div>
    );
  };

  const renderShipping = () => {
    return shipping[0]?.costs.map((el, index) => {
      return <option value={el.cost[0].value}>{el.service}</option>;
    });
  };

  // Render rincian pembayaran

  const renderPaymentDetail = () => {
    return (
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>Total Harga</div>
          <div>{`Rp ${thousandSeparator(totalPrice())}`}</div>
        </div>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>Total Ongkos Kirim</div>
          <div>{`Rp ${thousandSeparator(parseInt(pickShipping))}`}</div>
        </div>
        <div className="d-flex justify-content-between align-items-center w-100 mt-3">
          <div>Grand total</div>
          <div>{`Rp ${thousandSeparator(
            totalPrice() + parseInt(pickShipping)
          )}`}</div>
        </div>
        <div className="mt-3 w-100">
          <ButtonPrimary width="w-100" onClick={onClickCheckout}>
            Checkout
          </ButtonPrimary>
        </div>
      </div>
    );
  };

  const onClickCheckout = async () => {
    const dataCheckout = {
      user_id: 2,
      shipping_fee: parseInt(pickShipping),
      destination: dataAddress.city,
      bank_id: parseInt(pickBank),
      warehouse_id: shipping.id,
    };

    try {
      await axios.post(`${API_URL}/transaction/checkout`, dataCheckout);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // Kalkulasi total harga semua barang di keranjang

  const totalPrice = () => {
    return dataCart
      .map((el) => {
        return el.price * el.qty;
      })
      .reduce((prev, curr) => prev + curr, 0);
  };

  // Pilih alamat lain

  const onClickOtherAddress = async () => {
    try {
      let res = await axios.get(`${API_URL}/location/get/data-address/2`); // User id masih dummy, nanti dapet dari redux

      setListAddress(res.data);
      setHandleAddress(!handleAddress);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Pilih alamat pengiriman

  const pickAddress = async (data) => {
    try {
      let resShipping = await axios.get(
        `${API_URL}/location/shipping-fee/${data.id}`
      );

      setShipping(resShipping.data);
      setDataAddress(data);
      setHandleAddress(false);
      setPickShipping(0);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // Ganti alamat utama

  const onClickChangeMainAddress = async (id) => {
    const dataChangeAddress = {
      user_id: 2, // user_id adalah data sementara, nanti didapat dari redux
      id,
    };

    try {
      let res = await axios.patch(
        `${API_URL}/location/edit/main-address`,
        dataChangeAddress
      );

      setListAddress(res.data);
      alert("berhasil ubah alamat"); // sementara pake alert
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // RETURN

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center my-4">
        <div className="cart-detail-title mb-3">Rincian Pesanan</div>
        <div></div> {/* Untuk timeline payment */}
      </div>
      <div className="row">
        <div className="cart-detail-col col-7">
          <div className="cart-detail-left-side">
            <div className="cart-detail-shipping">
              <div className="mb-3">Informasi Pengiriman</div>
              {!dataAddress ? renderAddressFalse() : renderAddressTrue()}
            </div>
            <div className="cart-detail-border my-3"></div>
            <div className="cart-detail-listcart d-flex w-100">
              <div className="w-100 mr-3">{renderProduct()}</div>
              <div>
                <div className="cart-detail-kurir">
                  <select
                    name="shipping"
                    id="shipping"
                    onChange={(e) => setPickShipping(e.target.value)}
                  >
                    <option value="" hidden>
                      Pengiriman
                    </option>
                    {renderShipping()}
                  </select>
                </div>
                <div className="cart-detail-kurir">
                  <select
                    name="bank"
                    id="bank"
                    onChange={(e) => setPickBank(e.target.value)}
                  >
                    <option value="" hidden>
                      Bank
                    </option>
                    {dataBank?.map((el, index) => {
                      return (
                        <option key={index} value={el.id}>
                          {el.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
        <div className="cart-detail-col cart-detail-right-side col-4">
          <div className="cart-detail-right-side">
            <div className="cart-detail-rincian mb-3">Rincian Pembayaran</div>
            {renderPaymentDetail()}
          </div>
        </div>
      </div>
      <div className="container-modal">
        <Modal open={handleAddress} close={() => setHandleAddress(false)}>
          {renderDiffAddress()}
        </Modal>
      </div>
    </div>
  );
}

export default Checkout;
