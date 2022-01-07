import React, { useEffect, useState } from "react";

// Library react

import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

// Components

import thousandSeparator from "../../helpers/ThousandSeparator";
import { API_URL } from "../../constants/api";
import "./style/historyOrder.css";
import { Pagination } from "@mui/material";
import usePrevious from "../../helpers/UsePrevious";
import ModalOrderDetail from "../../components/ModalOrderDetail";

function HistoryOrder() {
  const dataUser = useSelector((state) => state.auth);

  // STATE

  const [tab, setTab] = useState(1);
  const [dataHistory, setDataHistory] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [handleModal, setHandleModal] = useState(false);
  const [ordersId, setOrdersId] = useState(null);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalOrder, setTotalOrder] = useState(null);

  // Use Previous untuk menyimpan state sebelumnya

  const prevTab = usePrevious(tab);

  // Use effect untuk get status order

  useEffect(() => {
    (async () => {
      try {
        let resStatus = await axios.get(`${API_URL}/history/get/status-order`);

        setDataStatus(resStatus.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Untuk re-rendering list order berdasarkan status, page, dan upload payment

  useEffect(() => {
    (async () => {
      try {
        if (prevTab !== tab) {
          setPage(1);
        }

        let url = `${API_URL}/history/get/orders/${
          dataUser.id
        }?status=${tab}&limit=${limit}&page=${page - 1}`;

        let res = await axios.get(url);

        setTotalOrder(res.headers["x-total-order"]);

        setDataHistory(res.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    })();
  }, [tab, page]);

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

  // EVENT

  // Open modal detail order

  const openModalDetailOrder = (orderId) => {
    setHandleModal(true);
    setOrdersId(orderId);
  };

  // OnChange halaman order

  const onChangePage = (e, value) => {
    setPage(value);
  };

  // RENDERING

  // Render tab pesanan user

  const renderTab = () => {
    return (
      <div className="history-tab">
        <div>{renderListTab()}</div>
        <div className="history-border-tab"></div>
      </div>
    );
  };

  // Render list tab

  const renderListTab = () => {
    return dataStatus.map((el, index) => {
      return (
        <button
          className={`history-btn-tab pb-2 px-2 ${
            tab === parseInt(el.id) ? "history-btn-active" : null
          }`}
          value={el.id}
          onClick={(e) => setTab(parseInt(e.target.value))}
        >
          {arrayStatus[index]}
        </button>
      );
    });
  };

  // Render modal order detail

  const renderModalOrderDetail = () => {
    return (
      <ModalOrderDetail
        id={ordersId}
        open={handleModal}
        close={() => setHandleModal(false)}
      />
    );
  };

  // Render list order

  const renderListOrder = () => {
    const colorFont = ["#EF8943", "#43936C", "#CB3A31"];

    const bgColor = ["#FEF0D7", "#D0E4DA", "#F0DAD4"];

    return dataHistory?.map((el, index) => {
      let date = new Date(el.create_on);
      let color;
      let backgroundColor;

      if (el.status_id === 1 || el.status_id === 2 || el.status_id === 3) {
        color = colorFont[0];
        backgroundColor = bgColor[0];
      } else if (el.status_id === 4 || el.status_id === 5) {
        color = colorFont[1];
        backgroundColor = bgColor[1];
      } else {
        color = colorFont[2];
        backgroundColor = bgColor[2];
      }

      return (
        <div
          key={index}
          className="history-list-order d-flex align-items-center justify-content-between px-4 py-3 mb-3"
          onClick={() => openModalDetailOrder(el.orders_id)}
        >
          <div>
            <div className="d-flex align-items-center">
              <div className="history-list-pesanan">{`Pesanan #TLU${date.getTime()}`}</div>
              <div className="history-list-border mx-2"></div>
              <div className="history-list-tanggal mr-2">{`${date.getDate()} ${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</div>
              <div
                className="history-list-status d-flex align-items-center justify-content-center py-1 px-2"
                style={{ color, backgroundColor }}
              >
                {arrayStatus[el.status_id - 1]}
              </div>
            </div>
            <div className="d-flex align-items-center mt-2">
              <div className="mr-3">
                <img
                  src={`${API_URL}/${el.images[0]}`}
                  alt="photo-prod"
                  className="history-list-img"
                />
              </div>
              <div>
                <div className="history-list-price">{`${
                  el.qty
                } barang x Rp ${thousandSeparator(el.price)}`}</div>
                <div className="history-list-nameprod">
                  {el.name.charAt(0).toUpperCase() + el.name.slice(1)}
                </div>
              </div>
            </div>
            {el.total_barang - 1 === 0 ? null : (
              <button className="history-list-otherprod mt-3">
                {`+${el.total_barang - 1} produk lainnya`}
              </button>
            )}
          </div>
          <div className="history-list-total">
            <div className="history-list-totalbelanja">Total belanja</div>
            <div className="history-list-grand">{`Rp ${thousandSeparator(
              el.price
            )}`}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {renderTab()}
      <div className="mt-3">{renderListOrder()}</div>
      <Pagination
        count={Math.ceil(totalOrder / limit)}
        page={page}
        onChange={onChangePage}
      />
      {renderModalOrderDetail()}
    </div>
  );
}

export default HistoryOrder;
