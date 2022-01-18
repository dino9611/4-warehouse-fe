import React, { useState } from "react";
import "./style/payment.css";
import images from "./../../assets";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ButtonPrimary from "./../../components/ButtonPrimary";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constants/api";
import ModalOrderDetail from "../../components/ModalOrderDetail";
import thousandSeparator from "../../helpers/ThousandSeparator";

function Payment() {
  const [expanded, setExpanded] = useState(false); // State untuk accordion
  const [handleModal, setHandleModal] = useState(false);

  const [dataOrders, setDataOrders] = useState([]);
  const location = useLocation();
  console.log(dataOrders);

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/get/orders/${location.state.ordersId}`
        );

        setDataOrders(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // EVENT

  // Handle utuk accordion

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // RENDERING

  // Render countdown

  const renderCountdown = () => {
    return (
      <div className="d-flex my-3">
        <div className="payment-count-wrapper d-flex align-items-center justify-content-center mr-2">
          2
        </div>
        <div className="payment-count-wrapper d-flex align-items-center justify-content-center">
          3
        </div>
        <div className="payment-count-separate d-flex align-items-center mx-1">
          :
        </div>
        <div className="payment-count-wrapper d-flex align-items-center justify-content-center mr-2">
          5
        </div>
        <div className="payment-count-wrapper d-flex align-items-center justify-content-center">
          9
        </div>
        <div className="payment-count-separate d-flex align-items-center mx-1">
          :
        </div>
        <div className="payment-count-wrapper d-flex align-items-center justify-content-center mr-2">
          1
        </div>
        <div className="payment-count-wrapper d-flex align-items-center justify-content-center mr-2">
          0
        </div>
      </div>
    );
  };

  const grandTotal = () => {
    return dataOrders
      .map((el, index) => {
        return el.total_price;
      })
      .reduce((prev, curr) => prev + curr, 0);
  };

  // Render keterangan orders

  const renderKeterangan = () => {
    return (
      <div className="payment-note-wrapper w-100 mb-3">
        <div className="px-4 pt-4 pb-3 ">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="fs12-500-gray">Nomor virtual account</div>
            <div className="fs12-500-black d-flex align-items-center">
              <div>{`${dataOrders[0]?.account_number}${dataOrders[0]?.phone_number}`}</div>
              <img src={images.copycolor} alt="copy" className="ml-2" />
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="fs12-500-gray">Total pembayaran</div>
            <div className="fs12-500-black d-flex align-items-center">
              <div>{`Rp ${thousandSeparator(
                grandTotal() + dataOrders[0]?.shipping_fee
              )}`}</div>
              <img src={images.copycolor} alt="copy" className="ml-2" />
            </div>
          </div>
        </div>
        <div className="payment-note-border p-0"></div>
        <div className="px-4 pb-4 pt-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="fs12-500-gray">Metode pembayaran</div>
            <div className="fs12-500-black d-flex align-items-center">
              <div>{dataOrders[0]?.name}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render tombol untuk ke order detail dan beli lagi

  const renderButton = () => {
    return (
      <div className="d-flex my-3 w-100">
        <button
          className="payment-btn-detail w-50 mr-3"
          onClick={() => setHandleModal(true)}
        >
          Lihat detail pesanan
        </button>
        <Link to="/products" className="w-50">
          <ButtonPrimary width="w-100">Belanja lagi</ButtonPrimary>
        </Link>
      </div>
    );
  };

  // Render cara melakukan pembayaran

  const renderHowToPay = () => {
    return (
      <div>
        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className="fs12-400-gray">ATM</div>
            </AccordionSummary>
            <AccordionDetails>
              <ol className="fs10-400-black payment-howtopay pl-2">
                <li>Masukkan kartu ATM dan PIN</li>
                <li>
                  {`Pilih menu Transaksi Lainnya > Transfer > ke Rekening BCA
                    Virtual Account`}
                </li>
                <li>
                  Masukkan 5 angka kode perusahaan untuk The Locals (80777) dan
                  Nomor HP yang terdaftar di akun The Locals Anda (Contoh:
                  80777081381195762)
                </li>
                <li>
                  Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai
                  seperti No VA, Nama, Perus/Produk dan Total Tagihan
                </li>
                <li>Masukkan Jumlah Transfer sesuai dengan Total Tagihan</li>
                <li>Ikuti instruksi untuk menyelesaikan transaksi</li>
                <li>Simpan struk transaksi sebagai bukti pembayaran</li>
              </ol>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <div className="fs12-400-gray">Internet Banking</div>
            </AccordionSummary>
            <AccordionDetails>
              <ol className="fs10-400-black payment-howtopay pl-2">
                <li>Login pada alamat Internet Banking</li>
                <li>
                  {`Pilih menu Pembayaran Tagihan > Pembayaran > Bank Virtual Account`}
                </li>
                <li>
                  Pada kolom kode bayar, masukkan 5 angka kode perusahaan untuk
                  The Locals (80777) dan Nomor HP yang terdaftar di akun The
                  Locals Anda (Contoh: 80777081381195762)
                </li>
                <li>
                  Di halaman konfirmasi, pastikan detil pembayaran sudah sesuai
                  seperti Nomor Bank Virtual Account, Nama Pelanggan dan Jumlah
                  Pembayaran
                </li>
                <li>Masukkan password dan mToken</li>
                <li>
                  Cetak/simpan struk pembayaran Bank Virtual Account sebagai
                  bukti pembayaran
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <div className="fs12-400-gray">Mobile Banking</div>
            </AccordionSummary>
            <AccordionDetails>
              <ol className="fs10-400-black payment-howtopay pl-2">
                <li>Lakukan log in pada aplikasi Bank Mobile</li>
                <li>
                  Pilih menu m-Banking, kemudian masukkan kode akses m-Banking
                </li>
                <li>{`Pilih m-Transfer > Bank Virtual Account`}</li>
                <li>
                  Pilih dari Daftar Transfer, atau masukkan 5 angka kode
                  perusahaan untuk The Locals (80777) dan Nomor HP yang
                  terdaftar di akun The Locals Anda (Contoh: 80777081381195762)
                </li>
                <li>Masukkan pin m-Banking</li>
                <li>Ikuti instruksi untuk menyelesaikan transaksi</li>
                <li>
                  Pembayaran selesai. Simpan notifikasi yang muncul sebagai
                  bukti pembayaran
                </li>
              </ol>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    );
  };

  const renderModalOrderDetail = () => {
    return (
      <ModalOrderDetail
        id={location.state.ordersId}
        open={handleModal}
        close={() => setHandleModal(false)}
      />
    );
  };

  const renderExpiredDate = () => {
    const dateOrder = new Date(dataOrders[0]?.create_on);

    const getDate = dateOrder.getDate();

    dateOrder.setDate(getDate + 1);

    var options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };

    return dateOrder.toLocaleDateString("id", options);
  };

  return (
    <div className="d-flex align-items-center justify-content-center my-5 w-100">
      <div className="payment-container d-flex flex-column align-items-center">
        <div className="profile-fs14-500-black">
          Selesaikan pembayaran dalam
        </div>
        {renderCountdown()}
        <div className="fs12-400-gray mb-1">Batas akhir pembayaran</div>
        <div className="fs12-500-gray mb-3">{`${renderExpiredDate()} WIB`}</div>
        {renderKeterangan()}
        {renderButton()}
        <div className="mt-3 mb-2">
          <div className="fs12-500-gray">Cara pembayaran</div>
        </div>
        {renderHowToPay()}
      </div>
      {renderModalOrderDetail()}
    </div>
  );
}

export default Payment;
