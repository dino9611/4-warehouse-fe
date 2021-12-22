import React, { useEffect } from "react";
import "./style/historyOrder.css";
import qs from "query-string";

import { useHistory, useLocation } from "react-router-dom";

function HistoryOrder() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        console.log(qs.parse(location.search).q);
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

  //

  return <div>{renderTab()}</div>;
}

export default HistoryOrder;
