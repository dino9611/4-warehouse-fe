import React, { useEffect, useState } from "react";
import "./style/historyOrder.css";
import qs from "query-string";

import { useHistory, useLocation } from "react-router-dom";

import images from "./../../assets";
import axios from "axios";
import { API_URL } from "../../constants/api";
import thousandSeparator from "../../helpers/ThousandSeparator";

function HistoryOrder() {
  // React router dom
  const history = useHistory();
  const location = useLocation();

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

  const [dataHistory, setDataHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // qs.parse(location.search).q;

        let res = await axios.get(`${API_URL}/history/get/diproses/2`); // user id dari redux harusnya

        setDataHistory(res.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    })();
  }, []);

  // RENDERING

  // Render tab pesanan user

  const renderTab = () => {
    return (
      <div className="history-tab">
        <div>
          <button
            className="history-btn-tab pb-2 px-2"
            onClick={() =>
              history.push({
                pathname: "/profile/history",
                search: "q=diproses",
              })
            }
          >
            Diproses
          </button>
          <button
            className="history-btn-tab pb-2 px-2"
            onClick={() =>
              history.push({
                pathname: "/profile/history",
                search: "?q=dikirim",
              })
            }
          >
            Sedang dikirim
          </button>
          <button
            className="history-btn-tab pb-2 px-2"
            onClick={() =>
              history.push({
                pathname: "/profile/history",
                search: "?q=sampai",
              })
            }
          >
            Sampai tujuan
          </button>
        </div>
        <div className="history-border-tab"></div>
      </div>
    );
  };

  // Render list order

  const renderListOrder = () => {
    return dataHistory?.map((el, index) => {
      let date = new Date(el.create_on);

      return (
        <div className="history-list-order d-flex align-items-center justify-content-between px-4 py-3 mb-3">
          <div>
            <div className="d-flex align-items-center">
              <div className="history-list-pesanan">Pesanan #AWUSER345</div>
              <div className="history-list-border mx-2"></div>
              <div className="history-list-tanggal mr-2">{`${date.getDate()} ${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</div>
              <div className="history-list-status-diproses d-flex align-items-center justify-content-center py-1 px-2">
                {el.status.charAt(0).toUpperCase() + el.status.slice(1)}
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
            <button className="history-list-otherprod mt-3">
              {`+${el.total_barang} produk lainnya`}
            </button>
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
    </div>
  );
}

export default HistoryOrder;
