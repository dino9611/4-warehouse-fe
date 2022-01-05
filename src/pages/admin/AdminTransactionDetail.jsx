import "./styles/AdminTransactionDetail.css";
import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import { styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import thousandSeparator from "../../helpers/ThousandSeparator";
import AdmBtnPrimary from "../../components/admin/AdmBtnPrimary";
import { successToast, errorToast } from "../../redux/actions/ToastAction";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      border: 0,
      fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
      border: 0,
      color: "#5A5A5A"
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#F4F4F4",
    },
    // Show last border
    '&:last-child td, &:last-child th': {
      borderBottom: "1px solid #CACACA"
    },
}));

function AdminTransactionDetail() {
    const transactionFromParent = useLocation();

    const {id: parentId, warehouse_id: parentWhId, transaction_amount: parentTransactionAmount, shipping_fee: parentShipFee} = transactionFromParent.state;

    const [transactionDetail, setTransactionDetail] = useState([]);

    const [statusIdData, setStatusIdData] = useState({}); // Buat render ulang klo status berubah (ex: stlh accept/send/reject)

    const [shippingInfo, setShippingInfo] = useState({});

    const transactionSummDesc = ["Items Total", "Shipping Fee", "Grand Total"];

    const {status_id: fetchedStatusId} = statusIdData; // Buat render ulang klo status berubah (ex: stlh accept/send/reject)

    const {recipient, address, phone_number, email, bank_name, account_number, courier} = shippingInfo;

    const fetchTransactionDetail = async () => { // Utk render data produk yang dibeli
        try {
            const res = await axios.get(`${API_URL}/transaction/detail?whid=${parentWhId}&id=${parentId}`);
            setTransactionDetail(res.data);
            setStatusIdData(res.data[0])
        } catch (error) {
            console.log(error);
        }
    };

    const fetchShippingInfo = async () => { // Utk render data detail pengiriman & pembayaran
        try {
            const res = await axios.get(`${API_URL}/transaction/detail-shipping?id=${parentId}`);
            setShippingInfo(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTransactionDetail();
        fetchShippingInfo();
    }, []);

    const breadcrumbs = [
        <Link to="/admin/" key="1" className="link-no-decoration adm-breadcrumb-modifier">
          Dashboard
        </Link>,
        <Link to="/admin/manage-transaction" key="2" className="link-no-decoration adm-breadcrumb-modifier">
          Manage Transaction
        </Link>,
        <Typography key="3" color="#070707" style={{fontSize: "0.75rem", margin: "auto"}}>
          Order Details
        </Typography>,
    ];

    const confirmTransactionPay = async (transactionId) => {
        document.querySelector("div.adm-transaction-detail-submission > button").disabled = true;

        try {
            const res = await axios.patch(`${API_URL}/transaction/confirm-payment/${transactionId}`);
            successToast(res.data.message);
            fetchShippingInfo();
        } catch (error) {
            errorToast("Server Error, from AdminTransactionDetail");
            console.log(error);
            document.querySelector("div.adm-transaction-detail-submission > button").disabled = false;
        }
    };

    const confirmTransactionDelivery = async (transactionId) => {
        document.querySelector("div.adm-transaction-detail-submission > button").disabled = true;

        try {
            const res = await axios.patch(`${API_URL}/transaction/confirm-delivery/${transactionId}`);
            successToast(res.data.message);
            fetchShippingInfo();
        } catch (error) {
            errorToast("Server Error, from AdminTransactionDetail");
            console.log(error);
            document.querySelector("div.adm-transaction-detail-submission > button").disabled = false;
        }
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
                <h4>Order #{parentId} Details</h4>
            </div>
            <div className="adm-transaction-detail-status">
                <div className={fetchedStatusId >= 1 && fetchedStatusId < 6 ? "active" : "non-active"}>
                    Wait Payment
                </div>
                <div className={fetchedStatusId > 1 && fetchedStatusId < 6 ? "active" : "non-active"}>{`> > > > > >`}</div>
                <div className={fetchedStatusId >= 2 && fetchedStatusId < 6 ? "active" : "non-active"}>
                    Wait Confirm
                </div>
                <div className={fetchedStatusId > 2 && fetchedStatusId < 6 ? "active" : "non-active"}>{`> > > > > >`}</div>
                <div className={fetchedStatusId >= 3 && fetchedStatusId < 6 ? "active" : "non-active"}>
                    On Process
                </div>
                <div className={fetchedStatusId > 3 && fetchedStatusId < 6 ? "active" : "non-active"}>{`> > > > > >`}</div>
                <div className={fetchedStatusId >= 4 && fetchedStatusId < 6 ? "active" : "non-active"}>
                    On Delivery
                </div>
                <div className={fetchedStatusId > 4 && fetchedStatusId < 6 ? "active" : "non-active"}>{`> > > > > >`}</div>
                <div className={fetchedStatusId >= 5 && fetchedStatusId < 6 ? "active" : "non-active"}>
                    Received
                </div>
                <div className={fetchedStatusId > 5 ? "active" : "non-active"}>{`OR`}</div>
                <div className={fetchedStatusId >= 6 ? "active" : "non-active"}>
                    Rejected & Expired
                </div>
            </div>
            <div className="adm-transaction-detail-contents-wrap">
                <div className="adm-transaction-detail-1stRow">
                    <div className="transaction-detail-1stRow-left">
                        <h5>Items Detail</h5>
                        <TableContainer component={Paper} style={{borderRadius: 0, boxShadow: "none"}}>
                            <Table sx={{ minWidth: "100%" }} aria-label="transaction items detail">
                                <TableHead>
                                    <TableRow style={{backgroundColor: "#FCB537"}}>
                                        <StyledTableCell align="left">Item</StyledTableCell>
                                        <StyledTableCell align="left">Purchase Qty</StyledTableCell>
                                        <StyledTableCell align="left">Warehouse Stock</StyledTableCell>
                                        <StyledTableCell align="left">Stock Status</StyledTableCell>
                                        <StyledTableCell align="left">Price @</StyledTableCell>
                                        <StyledTableCell align="left">Total</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactionDetail
                                    .map((val) => (
                                        <StyledTableRow key={`items-detail-0${val.product_id}`}>
                                            <StyledTableCell 
                                                align="left" 
                                                component="th" 
                                                scope="row" 
                                                className="txt-capitalize"
                                            >
                                                {val.product_name}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                {val.qty}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                {val.total_stock}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                {val.stock_status === "Sufficient" ?
                                                    <span className="transaction-detail-sufficient-label">{val.stock_status}</span>
                                                    :
                                                    <span className="transaction-detail-insufficient-label">{val.stock_status}</span>
                                                }
                                            </StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                Rp {thousandSeparator(val.product_price)}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
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
                        <TableContainer component={Paper} style={{borderRadius: 0, boxShadow: "none"}}>
                            <Table sx={{ minWidth: "100%" }} aria-label="transaction bill summary">
                                <TableHead>
                                    <TableRow style={{backgroundColor: "#FCB537"}}>
                                        <StyledTableCell align="left" style={{fontWeight: 600}}>Description</StyledTableCell>
                                        <StyledTableCell align="left" style={{fontWeight: 600}}>Price</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactionSummDesc
                                    .map((val, index) => (
                                        <StyledTableRow key={`transaction-summary-0${index}`}>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                {val}
                                            </StyledTableCell>
                                            <StyledTableCell align="left" component="th" scope="row">
                                                {index === 0 ?
                                                    `Rp ${thousandSeparator(parentTransactionAmount)}`
                                                    : index === 1 ?
                                                    `Rp ${thousandSeparator(parentShipFee)}`
                                                    :
                                                    `Rp ${thousandSeparator(parentTransactionAmount + parentShipFee)}`
                                                }
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
                            <p style={{fontWeight: 500}}>{recipient}</p>
                            <p className="txt-capitalize">{address}</p>
                            <p>P: {phone_number}</p>
                            <p>E: {email}</p>
                        </div>
                    </div>
                    <div className="transaction-detail-2ndRow-mid">
                        <h5>Billing Information</h5>
                        <div>
                            <p className="txt-uppercase">{bank_name}</p>
                            <p>{account_number}</p>
                        </div>
                    </div>
                    <div className="transaction-detail-2ndRow-right">
                        <h5>Delivery Information</h5>
                        <div>
                            <p>{courier}</p>
                        </div>
                    </div>                     
                </div>
            </div>
            <div className="adm-transaction-detail-submission">
                {fetchedStatusId === 2 ?
                    <AdmBtnPrimary width={"136px"} onClick={() => confirmTransactionPay(parentId)}>
                        Accept
                    </AdmBtnPrimary >
                    : fetchedStatusId === 3 ?
                    <AdmBtnPrimary width={"136px"} onClick={() => confirmTransactionDelivery(parentId)}>
                        Send
                    </AdmBtnPrimary >
                    :
                    <AdmBtnPrimary width={"136px"} disabled={true}>
                        No Action
                    </AdmBtnPrimary >
                }
            </div>
        </div>
    )
}

export default AdminTransactionDetail;