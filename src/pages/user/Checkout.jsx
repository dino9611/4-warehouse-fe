import React, { useEffect, useState } from "react";

// Library react

import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { debounce } from "throttle-debounce";
import { Spinner } from "reactstrap";
import axios from "axios";

// Import komponen

import thousandSeparator from "../../helpers/ThousandSeparator";
import ButtonPrimary from "../../components/ButtonPrimary.jsx";
import { API_URL } from "../../constants/api.js";
import Modal from "../../components/Modal";
import images from "../../assets";
import assets from "../../assets";
import "./style/cartDetail.css";
import "./style/checkout.css";

function Checkout(props) {
  // State data

  const [dataCart, setDataCart] = useState([]); // Data list produk dari tabel cart_detail
  const [dataBank, setDataBank] = useState([]); // Data list bank
  const [dataAddress, setDataAddress] = useState({}); // Data alamat user
  const [listAddress, setListAddress] = useState([]); // List data alamat user
  const [dataProvince, setDataProvince] = useState([]); // List data provinsi
  const [dataCity, setDataCity] = useState([]); // List data kota
  const [dataKurir, setDataKurir] = useState({}); // Data dari pilih kurir oleh user

  // State Handle

  const [handleAddress, setHandleAddress] = useState(false); // Handle untuk menampilkan modal alamat

  // State biasa

  const [shipping, setShipping] = useState([]); // Get data ongkir
  const [pickShipping, setPickShipping] = useState(0); // Pilih jenis pengiriman
  const [pickBank, setPickBank] = useState({}); // State untuk menyimpan value dari bank yang dipilih
  const [mainAddress, setMainAddress] = useState(false); // State untuk menyimpan data dari alamat utama user
  const [pickProvince, setPickProvince] = useState(""); // State untuk menyimpan data provinsi yang dipilih
  const [errorFillAddress, setErrorFillAddress] = useState(false); // Jika kolom tambah alamat bellum diisi akan error true
  const [btnAdd, setBtnAdd] = useState(false);

  // State loading request data

  const [loadingNewAddress, setLoadingNewAddress] = useState(false); // State untuk loading ketika menambah alamat baru
  const [loadingPilihAlamat, setLoadingPilihAlamat] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false); // State untuk loading ketika checkout

  // Data input new address user

  const [dataNewAddress, setDataNewAddress] = useState({
    recipient: "",
    phone_number: null,
    city: "",
    address: "",
    is_main_address: 0,
  });

  // STATE ADDRESS

  const [pickAddress, setPickAddress] = useState(null);

  const dataUser = useSelector((state) => state.auth); // Get data auth user dari redux
  const dataSnackbar = useSelector((state) => state.snackbarMessageReducer);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [testing, setTesting] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        for (let i = 0; i < 100; i++) {
          let resAddress = await axios.get(
            `${API_URL}/location/get/main-address/32`
          );
          console.log("tes");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loadingNewAddress) {
      (async () => {
        try {
          setLoadingPage(true);

          // Get data cart detail
          if (location.state) {
            setDataCart(location.state);
          } else {
            return;
          }

          // Get data bank

          let resBank = await axios.get(`${API_URL}/transaction/get/bank`);

          setDataBank(resBank.data);

          // Get data main address

          let resAddress = await axios.get(
            `${API_URL}/location/get/main-address/${dataUser.id}`
          );
          // Cek apakah address ada atau tidak

          if (!resAddress.data.length) {
            setDataAddress(false);

            let resProvince = await axios.get(
              `${API_URL}/location/get/province`
            );

            setDataProvince(resProvince.data);

            setShipping([]);
            setPickAddress(resAddress.data[0]);
            setDataAddress(resAddress.data[0]);

            setLoadingPage(false);
            return;
          }

          // Get shipping fee

          let resShipping = await axios.get(
            `${API_URL}/location/shipping-fee/${resAddress.data[0]?.id}?cartId=${location.state[0].cart_id}`
          );

          setPickAddress(resAddress.data[0]);
          setDataAddress(resAddress.data[0]);
          setShipping(resShipping.data);

          setLoadingPage(false);
        } catch (error) {
          console.log(error);
          console.log(error.response.data.message);
        }
      })();
    }
  }, [loadingNewAddress]);

  // Use effect untuk memfilter kota berdasarkan provinsi yang dipilih (Untuk add address baru)

  useEffect(() => {
    (async () => {
      if (pickProvince) {
        let res = await axios.get(
          `${API_URL}/location/get/city/${pickProvince}`
        );

        setDataCity(res.data);
      }
    })();
  }, [pickProvince]);

  useEffect(() => {
    (async () => {
      let res = await axios.get(
        `${API_URL}/location/get/data-address/${dataUser.id}`
      );

      setListAddress(res.data);
    })();
  }, [handleAddress]);

  // EVENT

  // Onclick checkout pastikan semua data terisi dengan benar

  const onClickCheckout = async () => {
    const dataCheckout = {
      user_id: dataUser.id,
      cart_id: dataCart[0]?.cart_id,
      shipping_fee: parseInt(pickShipping),
      address_id: dataAddress.id,
      bank_id: parseInt(pickBank),
      warehouse_id: shipping.id,
      courier: `JNE ${dataKurir.service}`,
    };

    try {
      setLoadingCheckout(true);

      if (!dataCheckout.bank_id || !pickShipping || !dataCart.length) {
        setLoadingCheckout(false);

        dispatch({
          type: "SHOWSNACKBAR",
          payload: {
            status: "error",
            message: "Harap isi semua kolom yang diperlukan",
          },
        });

        dataSnackbar.ref.current.showSnackbarMessage();
        return;
      }

      let res = await axios.post(
        `${API_URL}/transaction/checkout`,
        dataCheckout
      );

      dispatch({ type: "TOTALNULL" });

      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "success",
          message: "Berhasil checkout! harap segera selesaikan pembayaran Anda",
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();

      setLoadingCheckout(false);

      history.push({
        pathname: "/checkout/payment",
        state: {
          ordersId: res.data.ordersId,
          price: totalPrice(),
        },
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // Kalkulasi total harga semua barang di keranjang

  const totalPrice = () => {
    return dataCart
      ?.map((el) => {
        return el.price * el.qty;
      })
      .reduce((prev, curr) => prev + curr, 0);
  };

  const onChangePilihAlamat = (e, data) => {
    setPickAddress(data);
  };

  const onClickPilihAlamat = async () => {
    try {
      setLoadingPilihAlamat(true);

      let resShipping = await axios.get(
        `${API_URL}/location/shipping-fee/${pickAddress.id}?cartId=${location.state[0].cart_id}`
      );

      setShipping(resShipping.data);
      setDataAddress(pickAddress);
      setPickShipping(0);
      setHandleAddress(false);

      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "success",
          message: "Berhasil pilih alamat",
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();

      setLoadingPilihAlamat(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Onclik tambah alamat baru

  const onClickNewAddress = async () => {
    const { recipient, phone_number, address, city } = dataNewAddress;

    const newAddress = {
      ...dataNewAddress,
      user_id: dataUser.id,
      province: pickProvince,
    };

    try {
      setLoadingNewAddress(true);

      if (!recipient || !phone_number || !address || !city || !pickProvince) {
        setLoadingNewAddress(false);
        setErrorFillAddress(true);
        return;
      }

      let alamat = `${newAddress.address}, ${newAddress.city}, ${newAddress.province}`;

      let res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${alamat}&key=AIzaSyBWhGEZmXTsLT8rrd5BGdclTaXg5gk3O-w`
      );
      console.log(res.data);
      let latitude = res.data.results[0]?.geometry.location.lat;
      let longitude = res.data.results[0]?.geometry.location.lng;

      await axios.post(`${API_URL}/location/add/new-address`, {
        ...newAddress,
        latitude,
        longitude,
      });

      setErrorFillAddress(false);
      setLoadingNewAddress(false);

      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "success",
          message: "Berhasil menambah alamat!",
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // onChange data new address

  const onChangeNewAddress = (e) => {
    setDataNewAddress({ ...dataNewAddress, [e.target.name]: e.target.value });
  };

  // Ganti alamat utama

  const onClickChangeMainAddress = async (id) => {
    const dataChangeAddress = {
      user_id: dataUser.id,
      id,
    };

    try {
      setLoadingAddress(true);

      let res = await axios.patch(
        `${API_URL}/location/edit/main-address`,
        dataChangeAddress
      );

      setListAddress(res.data);

      dispatch({
        type: "SHOWSNACKBAR",
        payload: {
          status: "success",
          message: "Berhasil mengganti alamat utama",
        },
      });

      dataSnackbar.ref.current.showSnackbarMessage();

      setLoadingAddress(false);
    } catch (error) {
      console.log(error);
    }
  };

  // onChange kurir

  const onChangeKurir = (e, data) => {
    setPickShipping(e.target.value);
    setDataKurir(data);
  };

  // onClick close pada modal address

  const onClickCloseModal = () => {
    setPickAddress(dataAddress);
    setHandleAddress(false);
    setBtnAdd(false);
  };

  // onChange is main address

  const onChangeMainAddress = (e) => {
    if (e.target.checked) {
      setDataNewAddress({ ...dataNewAddress, is_main_address: 1 });
    } else {
      setDataNewAddress({ ...dataNewAddress, is_main_address: 0 });
    }
  };

  // RENDERING

  // Render jika user belum mempunyai alamat

  const renderNewAddress = () => {
    const { recipient, phone_number, address, pickProvince } = dataNewAddress;

    return (
      <div>
        <div className="mb-3">
          <label htmlFor="nama-penerima" className="checkout-label-input">
            Nama Penerima
          </label>
          <input
            type="text"
            id="nama-penerima"
            className={`checkout-input-address w-100 ${
              !dataNewAddress.recipient && errorFillAddress
                ? "textbox-error"
                : null
            }`}
            placeholder="Masukkan nama lengkap Anda"
            name="recipient"
            onChange={onChangeNewAddress}
          />
          {!dataNewAddress.recipient && errorFillAddress
            ? errorMessage()
            : null}
        </div>
        <div className="mb-3">
          <label htmlFor="nomor-hp" className="checkout-label-input">
            Nomor Handphone
          </label>
          <input
            type="text"
            id="nomor-hp"
            className={`checkout-input-address w-100 ${
              !dataNewAddress.phone_number && errorFillAddress
                ? "textbox-error"
                : null
            }`}
            placeholder="Masukkan nomor handphone Anda"
            name="phone_number"
            onChange={onChangeNewAddress}
          />
          {!dataNewAddress.phone_number && errorFillAddress
            ? errorMessage()
            : null}
        </div>
        <div className="mb-3">
          <label htmlFor="province" className="checkout-label-input">
            Provinsi
          </label>
          <input
            type="text"
            list="provinces"
            id="province"
            name="province"
            className={`checkout-input-address w-100 ${
              !pickProvince && errorFillAddress ? "textbox-error" : null
            }`}
            placeholder="Masukkan Provinsi"
            onChange={debounce(1000, (e) => setPickProvince(e.target.value))}
          />
          {!pickProvince && errorFillAddress ? errorMessage() : null}
          <datalist id="provinces">
            {dataProvince?.map((el, index) => (
              <option key={el.province_id} value={el.province} />
            ))}
          </datalist>
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="checkout-label-input">
            Kota/Kabupaten
          </label>
          <input
            type="text"
            id="city"
            list="cities"
            className={`checkout-input-address w-100 ${
              !dataNewAddress.city && errorFillAddress ? "textbox-error" : null
            }`}
            placeholder="Masukkan Kota/Kabupaten"
            name="city"
            onChange={onChangeNewAddress}
          />
          {!dataNewAddress.city && errorFillAddress ? errorMessage() : null}
          <datalist id="cities">
            {dataCity?.map((el) => (
              <option key={el.city_id} value={`${el.city_name}`}>
                {el.type}
              </option>
            ))}
          </datalist>
        </div>
        <div className="mb-3">
          <label htmlFor="detail-address" className="checkout-label-input">
            Detail alamat
          </label>
          <textarea
            name="address"
            id="detail-address"
            className={`checkout-input-address w-100 ${
              !dataNewAddress.address && errorFillAddress
                ? "textbox-error"
                : null
            }`}
            placeholder="Masukkan alamat lengkap"
            cols="30"
            rows="5"
            onChange={onChangeNewAddress}
          ></textarea>
          {!dataNewAddress.address && errorFillAddress ? errorMessage() : null}
        </div>
        <div className="mb-3">
          <label
            className="product-category-label d-flex align-items-center"
            htmlFor="is_main_address"
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              id="is_main_address"
              name="is_main_address"
              className="mr-2"
              onChange={onChangeMainAddress}
              style={{ opacity: "0", cursor: "pointer", zIndex: "999" }}
            />
            {dataNewAddress.is_main_address ? (
              <img
                src={images.checked}
                alt="checked"
                style={{ position: "absolute" }}
              />
            ) : (
              <img
                src={images.unchecked}
                alt="unchecked"
                style={{ position: "absolute" }}
              />
            )}
            Jadikan sebagai alamat utama
          </label>
        </div>
        <div className="checkout-address-note mb-3">
          * Jika Anda belum mempunyai alamat sebelumnya, maka data alamat yang
          anda masukkan saat ini akan menjadi alamat utama Anda
        </div>
        {btnAdd ? (
          <div className="d-flex align-items-center justify-content-end w-100">
            <button
              className="checkout-btn-batal mr-4 w-25"
              onClick={onClickCloseModal}
            >
              Batal
            </button>
            <ButtonPrimary
              onClick={onClickNewAddress}
              width="w-25"
              disabled={loadingNewAddress ? true : false}
            >
              {!loadingNewAddress ? (
                "Simpan"
              ) : (
                <Spinner color="light" size="sm">
                  Loading...
                </Spinner>
              )}
            </ButtonPrimary>
          </div>
        ) : (
          <div>
            <ButtonPrimary
              onClick={onClickNewAddress}
              width="w-100"
              disabled={loadingNewAddress ? true : false}
            >
              {!loadingNewAddress ? (
                "Simpan alamat"
              ) : (
                <Spinner color="light" size="sm">
                  Loading...
                </Spinner>
              )}
            </ButtonPrimary>
          </div>
        )}
      </div>
    );
  };

  // Kondisi error message pada saat user mengisi alamat

  const errorMessage = () => {
    return (
      <div className="d-flex align-items-center mt-1">
        <img src={images.error} alt="error" className=" mr-1" />
        <div className="textbox-error-msg">Data harus diisi!</div>
      </div>
    );
  };

  // Render jika user sudah punya alamat

  const renderUserAddress = () => {
    return (
      <>
        <div className="checkout-address p-3 mb-3">
          <div className="checkout-recipient mb-1">
            {loadingPage ? (
              <Skeleton width="50%" />
            ) : (
              dataAddress.recipient?.charAt(0).toUpperCase() +
              dataAddress.recipient?.slice(1)
            )}
          </div>
          <div className="checkout-detail-add">
            <div className="mb-1">
              {loadingPage ? (
                <Skeleton width="30%" />
              ) : (
                dataAddress.phone_number
              )}
            </div>
            <div className="mb-1">
              {loadingPage ? (
                <>
                  <Skeleton width="70%" />
                  <Skeleton width="50%" />
                </>
              ) : (
                dataAddress.address?.charAt(0).toUpperCase() +
                dataAddress.address?.slice(1)
              )}
            </div>
            <div>
              {loadingPage ? (
                <Skeleton width="60%" />
              ) : (
                `${
                  dataAddress.city?.charAt(0).toUpperCase() +
                  dataAddress.city?.slice(1)
                }, ${
                  dataAddress.province?.charAt(0).toUpperCase() +
                  dataAddress.province?.slice(1)
                }`
              )}
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
      <div
        className=" w-100 pt-4 px-4 pb-2 mb-2"
        style={{ position: "sticky", top: "0", backgroundColor: "#fff" }}
      >
        <h5 className="profile-fs14-500-black d-flex align-items-center justify-content-between p-0">
          <div>Pilih Alamat Pengiriman</div>
          <button
            className="checkout-close-modal"
            onClick={() => setHandleAddress(false)}
          >
            <img src={images.close} alt="close" />
          </button>
        </h5>
        <div className="mt-3">
          <button
            className="checkout-address-btn w-100 py-2"
            onClick={() => setBtnAdd(true)}
          >
            Tambah alamat baru
          </button>
        </div>
      </div>
    );
  };

  const renderBtnPilihAlamat = () => {
    return (
      <button
        className={`${
          loadingPilihAlamat
            ? "checkout-btn-pilihalamat-loading"
            : "checkout-btn-pilihalamat"
        }  w-100 p-3 d-flex align-items-center justify-content-center`}
        onClick={onClickPilihAlamat}
        disabled={loadingPilihAlamat ? "disabled" : null}
      >
        <div style={{ fontSize: "0.875em", fontWeight: "500", color: "#fff" }}>
          {loadingPilihAlamat ? (
            <Spinner color="light" size="sm">
              Loading...
            </Spinner>
          ) : (
            "Pilih alamat"
          )}
        </div>
      </button>
    );
  };

  // Render list address di modal checkout address

  const renderListAddress = () => {
    return listAddress.map((el, index) => {
      return (
        <label htmlFor={el.id} className="w-100">
          <input
            type="radio"
            id={el.id}
            value={parseInt(el.id)}
            name="list-address"
            style={{ display: "none", zIndex: "999" }}
            checked={parseInt(el.id) === pickAddress?.id ? "checked" : null}
            onChange={(e) => onChangePilihAlamat(e, el)}
          />
          <div
            key={index}
            className="checkout-list-address mx-4 mb-3"
            style={{
              border:
                parseInt(el.id) === pickAddress?.id
                  ? "1px solid #b24629"
                  : "1px solid #cacaca",
            }}
          >
            <div className="p-3" style={{ cursor: "pointer" }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center mb-2">
                  <div className="fs12-500-black mr-2">
                    {el.recipient.charAt(0).toUpperCase() +
                      el.recipient.slice(1)}
                  </div>
                  {el.is_main_address ? (
                    <div className="checkout-address-main fs10-500-gray">
                      Utama
                    </div>
                  ) : null}
                </div>
                {parseInt(el.id) == pickAddress?.id ? (
                  <img src={images.checkon} alt="" />
                ) : (
                  <img src={images.checkoff} alt="" />
                )}
              </div>
              <div className="fs10-500-gray mb-1">{el.phone_number}</div>
              <div className="fs10-400-gray mb-1">{el.address}</div>
              <div className="fs10-400-gray">{`${el.city}, ${el.province}`}</div>
            </div>
            <div className="checkout-address-action py-2 px-3 d-flex align-items-center">
              <button className="checkout-ubah-btn d-flex align-items-center p-0">
                <img src={images.edit} alt="edit" className="mr-1" />
                <div className="fs14-600-red">Ubah alamat</div>
              </button>
              {!el.is_main_address ? (
                <>
                  <div className="checkout-addressaction-border mx-3 py-2"></div>
                  <button className="checkout-ubah-btn d-flex align-items-center p-0">
                    <img src={images.utama} alt="edit" className="mr-1" />
                    <div
                      className="fs14-600-red"
                      onClick={() => onClickChangeMainAddress(el.id)}
                    >
                      Jadikan alamat utama
                    </div>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </label>
      );
    });
  };

  // Render modal tambah alamat

  const renderModalAddAddress = () => {
    return (
      <div>
        <div
          className="d-flex align-items-center justify-content-between pt-4 px-4 pb-2"
          style={{ position: "sticky", top: "0", background: "#fff" }}
        >
          <div className="profile-fs14-500-black">Detail alamat</div>
          <button
            style={{ backgroundColor: "transparent", border: "none" }}
            className="p-0"
            onClick={onClickCloseModal}
          >
            <img src={images.close} alt="close" />
          </button>
        </div>
        <div className="px-4 pb-4 pt-2">{renderNewAddress()}</div>
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
                className="checkout-img skeleton"
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
        {loadingPage ? (
          [1, 2, 3].map((el, index) => renderSkeletonCourier())
        ) : shipping.length ? (
          <div
            style={{
              fontSize: "0.875em",
              fontWeight: "500",
              color: "#b24629",
            }}
          >
            Masukkan alamat pengiriman kamu terlebih dahulu.
          </div>
        ) : (
          renderListCourier()
        )}
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
            onChange={(e) => onChangeKurir(e, el)}
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

  // RENDER SKELETON KURIR
  const renderSkeletonCourier = () => {
    return (
      <div className="checkout-kurir d-flex justify-content-between p-2 mb-2">
        <div className="d-flex align-items-start w-100">
          <div className="checkout-pricekurir mr-3">
            <Skeleton width="80%" />
          </div>
          <div>
            <div className="checkout-jeniskurir">
              <Skeleton width={100} />
            </div>
            <div className="checkout-desckurir">
              <Skeleton width={120} />
            </div>
            <div className="checkout-desckurir">
              <Skeleton width={140} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RENDER SKELETON PRODUCT CART
  const renderSkeletonProduct = () => {
    return (
      <>
        <div className="cart-detail-prod d-flex ">
          <div className="mr-3">
            <Skeleton variant="rectangular" width={64} height={64} />
          </div>
          <div className="d-flex flex-column justify-content-center w-100">
            <div className="checkout-priceprod">
              <Skeleton width="40%" />
            </div>
            <div className="checkout-nameprod w-100">
              <Skeleton width="50%" height="2rem" />
            </div>
          </div>
        </div>
        <div className="checkout-border my-3"></div>
      </>
    );
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
                {loadingPage ? (
                  <div className="mr-3">
                    <Skeleton variant="rectangular" width={35} height={35} />
                  </div>
                ) : (
                  <img
                    src={bankimg[index]}
                    alt="bank"
                    className="checkout-bank-img mr-3"
                  />
                )}

                <div>{loadingPage ? <Skeleton width={200} /> : el.name}</div>
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
    <div className="container my-5">
      <div className="row">
        <div className="checkout-col col-4 pr-3">
          <div className="checkout-wrapper p-4">
            <div className="checkout-title mb-3">1. Alamat Pengiriman</div>
            {dataAddress ? renderUserAddress() : renderNewAddress()}
          </div>
        </div>
        <div className="checkout-col col-4 p-px-2">
          <div className="checkout-wrapper p-4">
            <div className="checkout-title mb-3">2. Rincian Pembelanjaan</div>
            <div className="checkout-productcart">
              {loadingPage
                ? [1, 2, 3].map((el, index) => renderSkeletonProduct())
                : renderProductCart()}
            </div>
            <div className="checkout-total d-flex align-items-center justify-content-between w-100">
              <div>Subtotal</div>
              <div>
                {loadingPage ? (
                  <Skeleton width={80} />
                ) : (
                  `Rp ${thousandSeparator(totalPrice())}`
                )}
              </div>
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
              <div>
                {loadingPage
                  ? [1, 2, 3].map((el) => (
                      <div className="d-flex align-items-center justify-content-between">
                        <Skeleton width={150} />
                        <Skeleton width={50} />
                      </div>
                    ))
                  : renderProductInPaymentDetail()}
              </div>
              <div className="checkout-border mb-2"></div>
              <div className="checkout-payment-total">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div>Total harga</div>
                  <div>
                    {loadingPage ? (
                      <Skeleton width={60} />
                    ) : (
                      `Rp ${thousandSeparator(totalPrice())}`
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>Total ongkos kirim</div>
                  <div>
                    {loadingPage ? (
                      <Skeleton width={60} />
                    ) : (
                      `Rp ${thousandSeparator(pickShipping)}`
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="checkout-grand-total py-3 px-4">
              <div className="d-flex align-items-center- justify-content-between">
                <div>Total tagihan</div>
                <div>
                  {loadingPage ? (
                    <Skeleton width={100} height="2rem" />
                  ) : (
                    `Rp ${thousandSeparator(
                      totalPrice() + parseInt(pickShipping)
                    )}`
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ButtonPrimary
              width="w-100"
              onClick={onClickCheckout}
              disabled={
                loadingCheckout ||
                loadingPage ||
                !parseInt(pickBank) ||
                !pickShipping ||
                !dataCart.length
                  ? true
                  : false
              }
            >
              {!loadingCheckout ? (
                "Bayar Sekarang"
              ) : (
                <Spinner color="light" size="sm">
                  Loading...
                </Spinner>
              )}
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className="container-modal">
        <Modal
          open={handleAddress}
          close={onClickCloseModal}
          classModal="checkout-modal p-0"
        >
          {btnAdd ? (
            renderModalAddAddress()
          ) : (
            <>
              {renderModalAddress()}{" "}
              <div style={{ height: "auto" }}>{renderListAddress()}</div>
              {renderBtnPilihAlamat()}
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Checkout;
