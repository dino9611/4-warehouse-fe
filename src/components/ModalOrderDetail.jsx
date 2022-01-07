import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { API_URL } from "../constants/api";
import thousandSeparator from "../helpers/ThousandSeparator";
import images from "./../assets";
import ButtonPrimary from "./ButtonPrimary";
import Modal from "./../components/Modal";
import "./../pages/user/style/historyOrder.css";

function ModalOrderDetail({ id, open, close }) {
  const [dataOrderDetail, setDataOrderDetail] = useState([]);
  const [file, setFile] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const arrayStatus = [
    "Menunggu pembayaran",
    "Menunggu konfirmasi",
    "Diproses",
    "Dikirim",
    "Sampai tujuan",
    "Dibatalkan",
    "Kadaluwarsa",
  ];

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          let res = await axios.get(
            `${API_URL}/history/get/order-detail/${id}`
          );

          setDataOrderDetail(res.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [id]);

  const onClickUploadPaymentProof = async () => {
    try {
      setLoadingUpload(true);

      const formData = new FormData();
      formData.append("image", file);

      await axios.patch(
        `${API_URL}/transaction/upload/payment-proof/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoadingUpload(false);
      alert("Berhasil upload");
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = () => {
    return dataOrderDetail
      ?.map((el) => {
        return el.price * el.qty;
      })
      .reduce((prev, curr) => prev + curr, 0);
  };

  // Render modal detail order

  const renderModalOrderDetail = () => {
    let date = new Date(dataOrderDetail[0]?.create_on);

    return (
      <div>
        <div className="profile-fs14-500-black history-detail-title d-flex justify-content-between p-4">
          <div className="d-flex align-items-center">Detail transaksi</div>
          <button
            style={{ border: "none", backgroundColor: "#fff" }}
            onClick={close}
          >
            <img src={images.close} alt="close" />
          </button>
        </div>
        <div className="history-modal-detail px-4 pb-4 pt-3">
          <div>
            <div className="d-flex align-items-center mb-2">
              <div className="fs12-500-black w-50">Status</div>
              <div className="fs12-500-green w-50">
                {arrayStatus[dataOrderDetail[0]?.status_orderId - 1]}
              </div>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="fs12-500-black w-50">Invoice</div>
              <div className="fs12-500-green w-50 d-flex align-items-center">
                {`#TLU${new Date(dataOrderDetail[0]?.create_on).getTime()}`}
                <img src={images.copy} alt="copy" className="ml-2" />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="fs12-500-black w-50">Tanggal pemesanan</div>
              <div className="fs12-400-gray w-50">{`${date.getDate()} ${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</div>
            </div>
          </div>
          <div className="history-border my-3"></div>
          <div>
            <div className="fs12-500-black mb-2">Info pengiriman</div>
            <div className="d-flex align-items-center mb-2">
              <div className="fs12-500-gray w-50">Kurir</div>
              <div className="fs12-500-green w-50">
                {dataOrderDetail[0]?.courier}
              </div>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="fs12-500-gray w-50">No resi</div>
              <div className="fs12-500-green w-50">
                JNE123456778
                <img src={images.copy} alt="copy" className="ml-2" />
              </div>
            </div>
          </div>
          <div>
            <div className="fs12-500-gray mb-2">Alamat</div>
            <div className="history-modaladdress-wrapper">
              <div className="d-flex align-items-center">
                <div className="fs12-500-green mr-2">
                  {dataOrderDetail[0]?.recipient}
                </div>
                <div className="fs10-500-gray align-self-end">
                  {dataOrderDetail[0]?.phone_number}
                </div>
              </div>
              <div className="fs10-500-gray mt-1">
                <div className="mb-1">{dataOrderDetail[0]?.address}</div>
                <div>{`${dataOrderDetail[0]?.city}, ${dataOrderDetail[0]?.province}`}</div>
              </div>
            </div>
          </div>
          <div className="history-border my-3"></div>
          <div>
            <div className="fs12-500-black w-50 mb-2">Detail produk</div>
            {dataOrderDetail?.map((el, index) => {
              return (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between mb-3"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={`${API_URL}/${el.images[0]}`}
                      alt="pic-prod"
                      className="history-modal-img mr-3"
                    />
                    <div>
                      <div className="fs10-500-green">{`${
                        el.qty
                      } barang x Rp ${thousandSeparator(el.price)}`}</div>
                      <div className="fs14-600-gray">
                        {el.name_prod.length > 25
                          ? el.name_prod.charAt(0).toUpperCase() +
                            el.name_prod.slice(1, 25) +
                            "..."
                          : el.name_prod.charAt(0).toUpperCase() +
                            el.name_prod.slice(1)}
                      </div>
                    </div>
                  </div>
                  <div className="history-modalprice-wrapper pl-3 pr-4 d-flex flex-column justify-content-center">
                    <div className="fs10-500-gray">Total harga</div>
                    <div className="profile-fs14-600-black">{`Rp ${thousandSeparator(
                      el.qty * el.price
                    )}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="history-border my-3"></div>
          <div className="fs12-500-black mb-2">Info pembayaran</div>
          <div className="fs12-500-gray">
            <div className="d-flex align-items-center mb-3">
              <div className="w-50">Metode pembayaran</div>
              <div className="w-50">{dataOrderDetail[0]?.name}</div>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="w-50">Total harga</div>
              <div className="w-50">{`Rp ${thousandSeparator(
                totalPrice()
              )}`}</div>
            </div>
            <div className="d-flex align-items-center mb-2">
              <div className="w-50">Total ongkos kirim</div>
              <div className="w-50">{`Rp ${thousandSeparator(
                dataOrderDetail[0]?.shipping_fee
              )}`}</div>
            </div>
          </div>
          <div className="history-border-total my-2"></div>
          <div className="d-flex align-items-center mb-4">
            <div className="fs12-600-black w-50">Total tagihan</div>
            <div className="fs12-600-black w-50">{`Rp ${thousandSeparator(
              dataOrderDetail[0]?.shipping_fee + totalPrice()
            )}`}</div>
          </div>
          <div>{renderUploadPayment()}</div>
        </div>
      </div>
    );
  };

  const renderUploadPayment = () => {
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <label htmlFor="payment-proof" className="mb-3">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="img"
              className="history-proof"
            />
          ) : (
            <div className="history-imgupload d-flex align-items-center justify-content-center">
              <img src={images.camera} alt="camera" style={{ width: "50px" }} />
            </div>
          )}
          <input
            type="file"
            id="payment-proof"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <ButtonPrimary
          onClick={onClickUploadPaymentProof}
          disabled={file ? false : true}
        >
          Upload pembayaran sekarang
        </ButtonPrimary>
      </div>
    );
  };

  return (
    <div>
      <Modal open={open} close={close} classModal="history-modal p-0">
        {renderModalOrderDetail()}
      </Modal>
    </div>
  );
}

export default ModalOrderDetail;
