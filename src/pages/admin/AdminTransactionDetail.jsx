import "./styles/AdminTransactionDetail.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import thousandSeparator from "../../helpers/ThousandSeparator";
import AdmBtnPrimary from "../../components/admin/AdmBtnPrimary";
import AdmBtnSecondary from "../../components/admin/AdmBtnSecondary";
import { successToast, errorToast } from "../../redux/actions/ToastAction";
import inactiveNextArrow from "../../assets/arrorprofile.svg";
import stockRequestIcon from "../../assets/components/Stock-Request.svg";
import stockRequestInactiveIcon from "../../assets/components/Stock-Request-Inactive.svg";
import infoIcon from "../../assets/components/Info.svg";
import { useSelector } from "react-redux";
import Modal from "../../components/Modal";
import assets from "./../../assets";
import Textbox from "../../components/Textbox";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
    fontWeight: 600,
    padding: "0.5rem 1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#5A5A5A",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#F4F4F4",
  },
  // Show last border
  "&:last-child td, &:last-child th": {
    borderBottom: "1px solid #CACACA",
  },
}));

function AdminTransactionDetail() {
  const transactionFromParent = useLocation();

  const {
    id: parentId,
    warehouse_id: parentWhId,
    warehouse_name: parentWhName,
    transaction_amount: parentTransactionAmount,
    shipping_fee: parentShipFee,
  } = transactionFromParent.state;

  const getRoleId = useSelector((state) => state.auth.role_id);

  const [transactionDetail, setTransactionDetail] = useState([]);

  const [statusIdData, setStatusIdData] = useState({}); //* Buat render ulang klo status berubah (ex: stlh accept/send/reject)

  const [shippingInfo, setShippingInfo] = useState({});

  const [customerPayProof, setCustomerPayProof] = useState("");

  const [statusesList, setStatusesList] = useState([]); //* Bikin array sebagai sumber render data status order

  const [modalToggle, setModalToggle] = useState(false); //* Atur buka tutup modal payment proof

  const transactionSummDesc = ["Items Total", "Shipping Fee", "Grand Total"]; //* Utk label kolom Description pd tabel order summary

  const { status_id: fetchedStatusId } = statusIdData; //* Buat render ulang klo status berubah (ex: stlh accept/send/reject)

  const {
    recipient,
    address,
    phone_number,
    email,
    bank_name,
    account_number,
    courier,
  } = shippingInfo;

  const [handleModal, setHandleModal] = useState(false);
  const [dataStockRequest, setDataStockRequest] = useState({});
  const [dataWarehouse, setDataWarehouse] = useState([]);
  const [inputRequest, setInputRequest] = useState(0);

  const renderCurrentStatus = () => {
    //* Utk render tampilan current order status
    if (fetchedStatusId <= 2) {
      return statusesList.slice(0, 3); //* Utk ambil 3 status pertama pada array
    } else if (fetchedStatusId === 3) {
      return statusesList.slice(1, 4); //* Utk ambil 3 status tengah pada array
    } else if (fetchedStatusId === 6) {
      return ["Rejected"]; //* Utk tampilkan status rejected bila statusId = 6
    } else if (fetchedStatusId === 7) {
      return ["Expired"]; //* Utk tampilkan status expired bila statusId = 7
    } else {
      return statusesList.slice(2, 5); //* Utk ambil 3 status terakhir pada array
    }
  };

  const fetchTransactionDetail = async () => {
    //* Utk render data produk yang dibeli
    try {
      const res01 = await axios.get(
        `${API_URL}/transaction/detail?whid=${parentWhId}&id=${parentId}`
      );
      const res02 = await axios.get(
        `${API_URL}/transaction/payment-proof/${parentId}`
      );
      setTransactionDetail(res01.data);
      setStatusIdData(res01.data[0]);
      setCustomerPayProof(res02.data);
    } catch (error) {
      errorToast("Server Error, from AdminTransactionDetail - Trx Detail");
      console.log(error);
    }
  };

  const fetchShippingInfo = async () => {
    //* Utk render data detail pengiriman & pembayaran
    try {
      const res = await axios.get(
        `${API_URL}/transaction/detail-shipping?id=${parentId}`
      );
      setShippingInfo(res.data);
    } catch (error) {
      errorToast("Server Error, from AdminTransactionDetail - Shipping");
      console.log(error);
    }
  };

  const fetchTransactionStatuses = async () => {
    //* Utk render data status_order
    try {
      const res = await axios.get(`${API_URL}/transaction/statuses`);
      setStatusesList(res.data);
    } catch (error) {
      errorToast("Server Error, from AdminTransactionDetail - Statuses");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactionDetail();
    fetchShippingInfo();
    fetchTransactionStatuses();
  }, []);

  const breadcrumbs = [
    <Link
      to="/admin/"
      key="1"
      className="link-no-decoration adm-breadcrumb-modifier"
    >
      Dashboard
    </Link>,
    <Link
      to="/admin/manage-transaction"
      key="2"
      className="link-no-decoration adm-breadcrumb-modifier"
    >
      Manage Transaction
    </Link>,
    <Typography
      key="3"
      color="#070707"
      style={{ fontSize: "0.75rem", margin: "auto" }}
    >
      Order Details
    </Typography>,
  ];

  // RENDER MODAL TO SHOW PAYMENT PROOF
  const modalClick = () => {
    setModalToggle(!modalToggle);
  };

  const onCloseModal = () => {
    setModalToggle(false);
  };

  const renderImgError = () => {
    //* Render img cadangan bila payment proof img tidak ada/error/gagal load
    const errPath = "/assets/images/Test_Broken_Img.png";
    document.querySelector(
      "div.detailTrx-payproof-modal-body > img"
    ).src = `${API_URL}${errPath}`;
  };

  const payProofModal = (orderId, paymentProof) => {
    //* Render modal utk tampilkan payment proof customer
    return (
      <>
        <div className="detailTrx-payproof-modal-heading">
          <h4>{`Order ID ${orderId} - Payment Proof`}</h4>
        </div>
        <div className="detailTrx-payproof-modal-body">
          <img
            src={`${API_URL}${paymentProof}`}
            alt={`Payment-Proof-Order-${orderId}`}
            onError={renderImgError}
          />
        </div>
        <div className="detailTrx-payproof-modal-foot">
          <AdmBtnPrimary width={"6rem"} onClick={onCloseModal}>
            Back
          </AdmBtnPrimary>
        </div>
      </>
    );
  };

  // CLICK FUNCTION SECTION
  const disableButton = () => {
    //* Disable button saat proses async berjalan, mencegah klik submit berkali2 oleh user
    document.querySelector(
      "div.transaction-detail-status-bottom button:first-of-type"
    ).disabled = true;
    document.querySelector(
      "div.transaction-detail-status-bottom button:last-of-type"
    ).disabled = true;
  };

  const activateButton = () => {
    //* Aktivasi button saat proses async selesai, agar bisa di-klik lagi
    document.querySelector(
      "div.transaction-detail-status-bottom button:first-of-type"
    ).disabled = false;
    document.querySelector(
      "div.transaction-detail-status-bottom button:last-of-type"
    ).disabled = false;
  };

  const isAllSufficient = (currentValue) =>
    currentValue.stock_status === "Sufficient"; //* Utk validasi seluruh stock status mencukupi

  const confirmTransactionPay = async (event, transactionId) => {
    //* Function submit saat order status = Wait Confirm
    disableButton();

    let actionIdentifier;
    event.target.innerText === "Accept"
      ? (actionIdentifier = 1)
      : (actionIdentifier = 0);

    if (customerPayProof || !actionIdentifier) {
      try {
        const res = await axios.patch(
          `${API_URL}/transaction/confirm-payment/${transactionId}`,
          { actionIdentifier: actionIdentifier }
        );
        successToast(res.data.message);
        fetchTransactionDetail();
        fetchShippingInfo();
        activateButton();
      } catch (error) {
        errorToast("Server Error, from AdminTransactionDetail");
        console.log(error);
        activateButton();
      }
    } else {
      errorToast("Customer haven't upload payment receipt");
      activateButton();
    }
  };

  const confirmTransactionDelivery = async (event, transactionId) => {
    //* Function submit saat order status = On Process
    disableButton();

    let actionIdentifier;
    event.target.innerText === "Send"
      ? (actionIdentifier = 1)
      : (actionIdentifier = 0);

    let dataValidation = {
      actionIdentifier: actionIdentifier,
      warehouseId: parentWhId,
      orderId: parentId,
    };

    if (transactionDetail.every(isAllSufficient) || !actionIdentifier) {
      try {
        const res = await axios.patch(
          `${API_URL}/transaction/confirm-delivery/${transactionId}`,
          dataValidation
        );
        successToast(res.data.message);
        fetchTransactionDetail();
        fetchShippingInfo();
        activateButton();
      } catch (error) {
        errorToast("Server Error, from AdminTransactionDetail");
        console.log(error);
        activateButton();
      }
    } else {
      errorToast("Stock not sufficient to deliver!");
      activateButton();
    }
  };

  useEffect(() => {
    if (handleModal) {
      (async () => {
        try {
          let res = await axios.get(
            `${API_URL}/stock/get/nearest-warehouse?productId=${dataStockRequest.product_id}&orderId=${dataStockRequest.order_id}`
          );

          setDataWarehouse(res.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [handleModal]);

  const onClickModalRequest = (data) => {
    setHandleModal(true);
    setDataStockRequest(data);
    console.log(data);
  };
  console.log(dataWarehouse);

  const onChanegInputRequest = (e) => {
    setInputRequest(e.target.value);
  };

  const renderModalRequestStock = () => {
    return (
      <div className="w-100">
        <div
          className="d-flex align-items-center justify-content-between px-4 pt-4 pb-3"
          style={{ position: "sticky", top: "0" }}
        >
          <div>Request Stock</div>
          <img src={assets.close} alt="close" />
        </div>

        <div className="p-4">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
              <div className="fs14-500-black w-50">Product name</div>
              <div className="fs14-500-black w-50">
                {dataStockRequest.product_name}
              </div>
            </div>
            <div className="d-flex align-items-center mb-1">
              <div className="fs14-500-black w-50">Total stock required</div>
              <div className="fs14-500-black w-50">{dataStockRequest.qty}</div>
            </div>
            <div className="d-flex align-items-center">
              <div className="fs14-500-black w-50">Warehouse destination</div>
              <div className="fs14-500-black w-50">
                {dataWarehouse?.destination?.name}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="fs14-500-black mb-2">Nearest warehouse</div>
            {renderListNearestWarehouse()}
          </div>

          <div className="d-flex align-items-center mb-3">
            <div className="fs14-500-black w-50">Total stock request</div>
            <div className="fs14-500-black w-50">
              <div>{inputRequest}</div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end">
            <button className="mr-3">Cancel</button>
            <button>Request</button>
          </div>
        </div>
      </div>
    );
  };

  const renderListNearestWarehouse = () => {
    return dataWarehouse.origin?.map((el, index) => {
      return (
        <div className="modal-request-cardaddress p-3 d-flex align-items-center justify-content-between mb-2">
          <div>
            <div className="fs14-500-black">{el.name}</div>
            <div className="fs14-500-black">Warehosue stock : {el.stocks}</div>
          </div>
          <div>
            <div className="fs14-500-black">Input stock</div>
            <div className="w-25">
              <Textbox width="w-100" />
            </div>
            {/* <input
              type="number"
              value={inputRequest}
              onChange={onChanegInputRequest}
            /> */}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="adm-transaction-detail-main-wrap">
      <div className="adm-transaction-detail-breadcrumb-wrap">
        <Stack spacing={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="transaction detail breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </div>
      <div className="adm-transaction-detail-header-wrap">
        <div className="adm-transaction-detail-header-left">
          <h4>Order Details</h4>
          {getRoleId === 1 &&
          (fetchedStatusId === 2 || fetchedStatusId === 3) ? (
            <div className="detailTrx-header-left-notice">
              <img src={infoIcon} alt="Info-Icon" />
              <h6>
                Only warehouse admin eligible to accept/reject order & request
                stock
              </h6>
            </div>
          ) : getRoleId === 2 && fetchedStatusId === 2 ? (
            <div className="detailTrx-header-left-notice">
              <img src={infoIcon} alt="Info-Icon" />
              <h6>
                Please double check customer payment proof on billing
                information
              </h6>
            </div>
          ) : getRoleId === 2 && fetchedStatusId === 3 ? (
            <div className="detailTrx-header-left-notice">
              <img src={infoIcon} alt="Info-Icon" />
              <h6>
                You only able to send order when all stock status{" "}
                <span style={{ color: "#43936C" }}>"Sufficient"</span>
              </h6>
            </div>
          ) : null}
        </div>
        <div className="adm-transaction-detail-status">
          <div
            className={
              fetchedStatusId === 2 || fetchedStatusId === 3
                ? "transaction-detail-status-top status-top-actionable-modifier"
                : "transaction-detail-status-top"
            }
          >
            {renderCurrentStatus().map((val, index) =>
              val.id === fetchedStatusId ? (
                <>
                  <h6 className="status-active">{val.status}</h6>
                  {val.id <= fetchedStatusId && fetchedStatusId < 5 ? (
                    <img
                      src={inactiveNextArrow}
                      style={{ transform: "rotate(-90deg" }}
                    />
                  ) : null}
                </>
              ) : fetchedStatusId >= 6 ? (
                <h6 className="status-fail">{val}</h6>
              ) : (
                <>
                  <h6 className="status-inactive">{val.status}</h6>
                  {index < 2 ? (
                    <img
                      src={inactiveNextArrow}
                      style={{ transform: "rotate(-90deg" }}
                    />
                  ) : null}
                </>
              )
            )}
          </div>
          {fetchedStatusId === 2 ? (
            <>
              <div className="transaction-detail-status-bottom">
                <h6>Confirm Order #{parentId}</h6>
                <div>
                  <AdmBtnSecondary
                    fontSize="0.75rem"
                    height="32px"
                    width="72px"
                    onClick={(event) => confirmTransactionPay(event, parentId)}
                    disabled={getRoleId === 1}
                  >
                    Reject
                  </AdmBtnSecondary>
                  <AdmBtnPrimary
                    fontSize="0.75rem"
                    height="32px"
                    width="72px"
                    onClick={(event) => confirmTransactionPay(event, parentId)}
                    disabled={getRoleId === 1}
                  >
                    Accept
                  </AdmBtnPrimary>
                </div>
              </div>
            </>
          ) : fetchedStatusId === 3 ? (
            <>
              <div className="transaction-detail-status-bottom">
                <h6>Delivery Action</h6>
                <div>
                  <AdmBtnSecondary
                    fontSize="0.75rem"
                    height="32px"
                    width="72px"
                    onClick={(event) =>
                      confirmTransactionDelivery(event, parentId)
                    }
                    disabled={getRoleId === 1}
                  >
                    Reject
                  </AdmBtnSecondary>
                  <AdmBtnPrimary
                    fontSize="0.75rem"
                    height="32px"
                    width="72px"
                    onClick={(event) =>
                      confirmTransactionDelivery(event, parentId)
                    }
                    disabled={
                      getRoleId === 1 ||
                      !transactionDetail.every(isAllSufficient)
                    }
                  >
                    Send
                  </AdmBtnPrimary>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="adm-transaction-detail-contents-wrap">
        <div className="adm-transaction-detail-1stRow">
          <div className="transaction-detail-1stRow-left">
            <div>
              <h5>Items From Order #{parentId}</h5>
              {fetchedStatusId === 2 || fetchedStatusId === 3 ? (
                getRoleId === 1 ? (
                  <button disabled>
                    <img
                      src={stockRequestInactiveIcon}
                      alt="stock-request-icon"
                    />
                    Request Stock
                  </button>
                ) : (
                  <Link
                    to={{
                      pathname: "/admin/stock-request",
                    }}
                    className="link-no-decoration"
                  >
                    <button>
                      <img src={stockRequestIcon} alt="stock-request-icon" />
                      Request Stock
                    </button>
                  </Link>
                )
              ) : null}
            </div>
            <TableContainer
              component={Paper}
              style={{ borderRadius: 0, boxShadow: "none" }}
            >
              <Table
                sx={{ minWidth: "100%" }}
                aria-label="transaction items detail"
              >
                <TableHead>
                  <TableRow
                    style={{ backgroundColor: "#FCB537", height: "64px" }}
                  >
                    <StyledTableCell align="left">Item</StyledTableCell>
                    <StyledTableCell align="left">Purchase Qty</StyledTableCell>
                    <StyledTableCell align="left">
                      Warehouse Stock
                    </StyledTableCell>
                    <StyledTableCell align="left">Stock Status</StyledTableCell>
                    <StyledTableCell align="left">Price @</StyledTableCell>
                    <StyledTableCell align="left">Total</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionDetail.map((val) => (
                    <StyledTableRow key={`items-detail-0${val.product_id}`}>
                      <StyledTableCell
                        align="left"
                        component="th"
                        scope="row"
                        className="txt-capitalize"
                      >
                        {val.product_name}
                      </StyledTableCell>
                      <StyledTableCell align="left">{val.qty}</StyledTableCell>
                      <StyledTableCell align="left">
                        {val.total_stock}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {val.stock_status === "Sufficient" &&
                        fetchedStatusId < 4 ? (
                          <span className="transaction-detail-sufficient-label">
                            {val.stock_status}
                          </span>
                        ) : fetchedStatusId === 4 ? (
                          <span className="transaction-detail-done-label">
                            On Delivery
                          </span>
                        ) : fetchedStatusId === 5 ? (
                          <span className="transaction-detail-done-label">
                            Delivered
                          </span>
                        ) : fetchedStatusId > 5 ? (
                          <span className="transaction-detail-insufficient-label">
                            Cancelled
                          </span>
                        ) : (
                          <span
                            className="transaction-detail-insufficient-label"
                            onClick={() => onClickModalRequest(val)}
                            style={{ cursor: "pointer" }}
                          >
                            {val.stock_status}
                          </span>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Rp {thousandSeparator(val.product_price)}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        Rp {thousandSeparator(val.total_price)}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="transaction-detail-1stRow-right">
            <h5>Order Summary</h5>
            <TableContainer
              component={Paper}
              style={{ borderRadius: 0, boxShadow: "none" }}
            >
              <Table
                sx={{ minWidth: "100%" }}
                aria-label="transaction bill summary"
              >
                <TableHead>
                  <TableRow
                    style={{ backgroundColor: "#FCB537", height: "64px" }}
                  >
                    <StyledTableCell align="left" style={{ fontWeight: 600 }}>
                      Description
                    </StyledTableCell>
                    <StyledTableCell align="left" style={{ fontWeight: 600 }}>
                      Price
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactionSummDesc.map((val, index) => (
                    <StyledTableRow key={`transaction-summary-0${index}`}>
                      <StyledTableCell align="left" component="th" scope="row">
                        {val}
                      </StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        {index === 0
                          ? `Rp ${thousandSeparator(parentTransactionAmount)}`
                          : index === 1
                          ? `Rp ${thousandSeparator(parentShipFee)}`
                          : `Rp ${thousandSeparator(
                              parentTransactionAmount + parentShipFee
                            )}`}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="adm-transaction-detail-2ndRow">
          <div className="transaction-detail-2ndRow-left">
            <h5>Shipping Information</h5>
            <div>
              <p>{recipient}</p>
              <p className="txt-capitalize">{address}</p>
              <p>{phone_number}</p>
              <p>{email}</p>
            </div>
          </div>
          <div className="transaction-detail-2ndRow-mid">
            <h5>Billing Information</h5>
            <div>
              <p>Payment method</p>
              <p className="txt-uppercase">{bank_name}</p>
            </div>
            <div>
              <p>Account number</p>
              <p>{account_number}</p>
            </div>
            <div>
              <p>Payment proof</p>
              <span onClick={modalClick}>Check Receipt</span>
            </div>
          </div>
          <div className="transaction-detail-2ndRow-right">
            <h5>Delivery Information</h5>
            <div>
              <p>Courier</p>
              <p>{courier?.split(" ")[0]}</p>{" "}
              {/* Kasih symbol "?" biar klo data kosong, ga error undefined */}
            </div>
            <div>
              <p>Delivery type</p>
              <p>{courier?.split(" ")[1]}</p>{" "}
              {/* Kasih symbol "?" biar klo data kosong, ga error undefined */}
            </div>
            <div>
              <p>Warehouse origin</p>
              <p>{parentWhName}</p>
            </div>
          </div>
        </div>
      </div>
      <Modal open={modalToggle} close={onCloseModal}>
        {payProofModal(parentId, customerPayProof)}
      </Modal>
      <Modal
        open={handleModal}
        close={() => setHandleModal(false)}
        classModal="modal-stock-request p-0"
      >
        {renderModalRequestStock()}
      </Modal>
    </div>
  );
}

export default AdminTransactionDetail;
