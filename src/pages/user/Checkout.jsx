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
import Textbox from "./../../components/Textbox";
import assets from "../../assets";

function Checkout(props) {
  const [dataCart, setDataCart] = useState([]); // Data list produk dari tabel cart_detail
  const [dataBank, setDataBank] = useState([]);
  const [dataAddress, setDataAddress] = useState({}); // Data alamat user
  const [listAddress, setListAddress] = useState([]); // List data alamat user
  const [shipping, setShipping] = useState({}); // Get data ongkir
  const [pickShipping, setPickShipping] = useState(0); // Pilih jenis pengiriman
  const [handleAddress, setHandleAddress] = useState(false);
  const [pickBank, setPickBank] = useState({});
  const [mainAddress, setMainAddress] = useState(false);

  // Get alamat utama dari user

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       axios.defaults.headers.post["Content-Type"] =
  //         "application/json;charset=utf-8";
  //       axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  //       let res = await axios.get(
  //         `https://api.rajaongkir.com/starter/province`,
  //         {
  //           headers: {
  //             key: "8b87be47bf10fc3f713790a8957c0ab6",
  //           },
  //         }
  //       );

  //       console.log(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, []);

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

        setDataAddress(resAddress.data[0]);
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

  // const renderShipping = () => {
  //   return shipping[0]?.costs.map((el, index) => {
  //     return <option value={el.cost[0].value}>{el.service}</option>;
  //   });
  // };

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
      cart_id: dataCart[0]?.cart_id,
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

  const render = () => {
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
                      {/* {renderShipping()} */}
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
      </div>
    );
  };

  // Render jika user belum mempunyai alamat

  const renderNewAddress = () => {
    return (
      <div>
        <div className="mb-3">
          <label htmlFor="nama-penerima" className="checkout-label-input">
            Nama Penerima
          </label>
          <input
            type="text"
            id="nama-penerima"
            className="checkout-input-address w-100"
            placeholder="Masukkan nama lengkap Anda"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nomor-hp" className="checkout-label-input">
            Nomor Handphone
          </label>
          <input
            type="text"
            id="nomor-hp"
            className="checkout-input-address w-100"
            placeholder="Masukkan nomor handphone Anda"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="province" className="checkout-label-input">
            Provinsi
          </label>
          <input
            type="text"
            id="province"
            className="checkout-input-address w-100"
            placeholder="Masukkan Provinsi"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="checkout-label-input">
            Kota/Kabupaten
          </label>
          <input
            type="text"
            id="city"
            className="checkout-input-address w-100"
            placeholder="Masukkan Kota/Kabupaten"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="detail-address" className="checkout-label-input">
            Detail alamat
          </label>
          <input
            type="text"
            id="detail-address"
            className="checkout-input-address w-100"
            placeholder="Masukkan detail alamat Anda"
          />
        </div>
        <div>
          <div>
            <label
              className="checkout-mainadd d-flex align-items-center"
              for="main-address"
              style={{ cursor: "pointer", position: "relative" }}
            >
              <input
                type="checkbox"
                id="main-address"
                name="main-address"
                className="mr-2"
                onChange={() => setMainAddress(!mainAddress)}
                style={{ opacity: "0", cursor: "pointer", zIndex: "999" }}
              />
              {mainAddress ? (
                <img
                  src={assets.checked}
                  alt="checked"
                  style={{ position: "absolute" }}
                />
              ) : (
                <img
                  src={assets.unchecked}
                  alt="unchecked"
                  style={{ position: "absolute" }}
                />
              )}
              Jadikan sebagai alamat utama
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Render jika user sudah punya setidaknya alamat

  const renderUserAddress = () => {
    return (
      <>
        <div className="checkout-address p-3 mb-3">
          <div className="checkout-recipient mb-1">
            {dataAddress.recipient?.charAt(0).toUpperCase() +
              dataAddress.recipient?.slice(1)}
          </div>
          <div className="checkout-detail-add">
            <div className="mb-1">{dataAddress.phone_number}</div>
            <div className="mb-1">
              {dataAddress.address?.charAt(0).toUpperCase() +
                dataAddress.address?.slice(1)}
            </div>
            <div>
              {`${
                dataAddress.city?.charAt(0).toUpperCase() +
                dataAddress.city?.slice(1)
              }, ${
                dataAddress.province?.charAt(0).toUpperCase() +
                dataAddress.province?.slice(1)
              }`}
            </div>
          </div>
        </div>
        <button
          className="checkout-chooseadd d-flex justify-content-center w-100"
          onClick={() => setHandleAddress(!handleAddress)}
        >
          Pilih alamat lain
        </button>
      </>
    );
  };

  // Render modal pilih alamat lain

  const renderModalAddress = () => {
    return (
      <div className="w-100">
        <h5 className="d-flex justify-content-center w-100">
          Pilih Alamat Pengiriman
        </h5>
        <div className="mt-3">
          <ButtonPrimary width="w-100" fontSize="0.75em">
            Tambah alamat baru
          </ButtonPrimary>
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

  // Render product dari cart detail

  const renderProductCart = () => {
    return dataCart.map((el, index) => {
      return (
        <>
          <div key={index} className="cart-detail-prod d-flex ">
            <div className="mr-3">
              <img
                src={`${API_URL}/${el.images[0]}`}
                alt="imgcart"
                className="checkout-img"
              />
            </div>
            <div className="d-flex flex-column justify-content-center w-100">
              <div className="checkout-priceprod">
                {`${el.qty} barang x Rp ${thousandSeparator(el.price)} `}
              </div>
              <div className="checkout-nameprod w-100">
                {el.name.length > 25
                  ? el.name.charAt(0).toUpperCase() +
                    el.name.slice(1, 25) +
                    "..."
                  : el.name.charAt(0).toUpperCase() + el.name.slice(1)}
              </div>
            </div>
          </div>
          <div className="checkout-border my-3"></div>
        </>
      );
    });
  };

  // Render pilih pengiriman

  const renderShipping = () => {
    return (
      <div className="mt-4">
        <div className="checkout-title mb-3">Pilih Pengiriman</div>
        {renderListCourier()}
      </div>
    );
  };

  // Render list kurir

  const renderListCourier = () => {
    return shipping[0]?.costs.map((el, index) => {
      return (
        <label className="w-100" for={el.service} style={{ cursor: "pointer" }}>
          <input
            type="radio"
            id={el.service}
            name="kurir"
            value={el.cost[0].value}
            onChange={(e) => setPickShipping(e.target.value)}
            style={{ display: "none", cursor: "pointer", zIndex: "999" }}
          />
          <div
            className={`checkout-kurir d-flex justify-content-between p-2 ${
              el.cost[0].value == pickShipping ? "checkout-kurir-active" : null
            }`}
          >
            <div className="d-flex align-items-start w-100">
              <div className="checkout-pricekurir mr-3">{`Rp ${thousandSeparator(
                el.cost[0].value
              )}`}</div>
              <div>
                <div className="checkout-jeniskurir">{`${shipping[0].code.toUpperCase()} ${
                  el.service
                }`}</div>
                <div className="checkout-desckurir">{el.description}</div>
                <div className="checkout-desckurir">{`Estimasi tiba ${el.cost[0].etd} hari`}</div>
              </div>
            </div>

            {el.cost[0].value == pickShipping ? (
              <div className="align-self-center">
                <img src={assets.cekkurir} alt="check" />
              </div>
            ) : (
              <div className="align-self-center">
                <img src={assets.cekkurir} alt="" style={{ opacity: "0" }} />
              </div>
            )}
          </div>
        </label>
      );
    });
  };

  // Render jenis pembayaran

  const renderPayment = () => {
    return dataBank.map((el, index) => {
      const bankimg = [images.mandiri, images.bca, images.bni, images.cimb];

      return (
        <>
          <label className="w-100" for={el.id} style={{ cursor: "pointer" }}>
            <input
              type="radio"
              id={el.id}
              name="bank"
              value={el.id}
              onChange={(e) => setPickBank(e.target.value)}
              style={{ display: "none", cursor: "pointer", zIndex: "999" }}
            />
            <div
              className={`checkout-list-bank d-flex align-items-center justify-content-between py-1 px-2 ${
                el.id == pickBank ? "checkout-bank-active" : null
              }`}
            >
              <div className="d-flex align-items-center">
                <img
                  src={bankimg[index]}
                  alt="bank"
                  className="checkout-bank-img mr-3"
                />
                <div>{el.name}</div>
              </div>
              {el.id == pickBank ? (
                <div>
                  <img src={images.cekkurir} alt="cekbank" />
                </div>
              ) : null}
            </div>
            {dataBank.length - 1 === index ? null : (
              <div className="checkout-border-bank"></div>
            )}
          </label>
        </>
      );
    });
  };

  // Render produk pada rincian pembayaran

  const renderProductInPaymentDetail = () => {
    return dataCart.map((el, index) => {
      return (
        <div className="checkout-prod-payment d-flex align-items-center justify-content-between mb-3">
          <div>{`${el.qty} x ${
            el.name.length > 30
              ? el.name.charAt(0).toUpperCase() + el.name.slice(1, 30) + "..."
              : el.name.charAt(0).toUpperCase() + el.name.slice(1)
          }`}</div>
          <div>{`Rp ${thousandSeparator(el.qty * el.price)}`}</div>
        </div>
      );
    });
  };

  // RETURN

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="checkout-col col-4 pr-3">
          <div className="checkout-wrapper p-4">
            <div className="checkout-title mb-3">1. Alamat Pengiriman</div>
            {/* {renderNewAddress()} */}
            {renderUserAddress()}
          </div>
        </div>
        <div className="checkout-col col-4 p-px-2">
          <div className="checkout-wrapper p-4">
            <div className="checkout-title mb-3">2. Rincian Pembelanjaan</div>
            <div>{renderProductCart()}</div>
            <div className="checkout-total d-flex align-items-center justify-content-between w-100">
              <div>Subtotal</div>
              <div>{`Rp ${thousandSeparator(totalPrice())}`}</div>
            </div>
            {renderShipping()}
          </div>
        </div>
        <div className="checkout-col col-4 pl-3 ">
          <div className="checkout-wrapper p-4 mb-4">
            <div className="checkout-title mb-3">3. Pembayaran</div>
            <div className="checkout-bank-wrapper">{renderPayment()}</div>
          </div>
          <div className="checkout-wrapper">
            <div className="px-4 pt-4 mb-2">
              <div className="checkout-title mb-3">Rincian Pembayaran</div>
              <div>{renderProductInPaymentDetail()}</div>
              <div className="checkout-border mb-2"></div>
              <div className="checkout-payment-total">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div>Total harga</div>
                  <div>{`Rp ${thousandSeparator(totalPrice())}`}</div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>Total ongkos kirim</div>
                  <div>{`Rp ${thousandSeparator(pickShipping)}`}</div>
                </div>
              </div>
            </div>
            <div className="checkout-grand-total py-3 px-4">
              <div className="d-flex align-items-center- justify-content-between">
                <div>Total tagihan</div>
                <div>{`Rp ${thousandSeparator(
                  totalPrice() + parseInt(pickShipping)
                )}`}</div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ButtonPrimary width="w-100" onClick={onClickCheckout}>
              Bayar sekarang
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className="container-modal">
        <Modal
          open={handleAddress}
          close={() => setHandleAddress(false)}
          classModal="checkout-modal"
        >
          {renderModalAddress()}
        </Modal>
      </div>
    </div>
  );
}

export default Checkout;
