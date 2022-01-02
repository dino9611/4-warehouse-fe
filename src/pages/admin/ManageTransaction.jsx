import React, { useEffect, useState } from 'react';
import "./styles/ManageTransaction.css";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import thousandSeparator from "../../helpers/ThousandSeparator";
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";
import Modal from '../../components/Modal';
import AdmBtnPrimary from '../../components/admin/AdmBtnPrimary';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import AcceptIcon from "../../assets/centangijo.svg";
import RejectIcon from "../../assets/close.svg";
import paginationPrevArrow from "../../assets/components/Pagination-Prev-Arrow.svg";
import paginationNextArrow from "../../assets/components/Pagination-Next-Arrow.svg";
import {Link} from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`manage-transaction-tabpanel-${index}`}
      aria-labelledby={`manage-transaction-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="adm-transaction-tabpanel-wrap">
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `manage-transaction-tab-${index}`,
    'aria-controls': `manage-transaction-tabpanel-${index}`,
  };
}

function ManageTransaction() {
    const [loadData, setLoadData] = useState(true);

    const [transactions, setTransactions] = useState([]);

    const [value, setValue] = React.useState(0);

    // const [dropdownLength, setDropdownLength] = useState([]);

    const [toggleDropdown, setToggleDropwdown] = useState(false); // Atur toggle dropdown filter product per page

    const [modalLength, setModalLength] = useState([]);

     // PAGINATION SECTION
     const [page, setPage] = useState(1);

     const [itemPerPage, setItemPerPage] = useState(10);
 
     const [transactionLength, setTransactionLength] = useState(0);
 
     let pageCountTotal = Math.ceil(transactionLength / itemPerPage); // Itung total jumlah page yg tersedia
 
     let pageCountRange = Array(pageCountTotal).fill(null).map((val, index) => index + 1); // Itung range page yang bisa di-klik
     
     let showMaxRange = 10; // Tentuin default max range yg tampil/di-render berapa buah
 
     // FILTER ITEM PER PAGE SECTION
    const rowsPerPageOptions = [10, 50];

    // RENDER PAGE RANGE SECTION
    const renderPageRange = () => {
        const disabledBtn = (value) => {
            return (
                <button className="adm-transaction-pagination-btn" value={value} onClick={(event) => selectPage(event)} disabled>
                    {value}
                </button>
            );
        };

        const clickableBtn = (value) => {
            return (
                <button className="adm-transaction-pagination-btn" value={value} onClick={(event) => selectPage(event)}>
                    {value}
                </button>
            );
        };

        if (pageCountRange.length <= showMaxRange) {
            return pageCountRange.map((val, index) => {
                if (val === page) {
                    return disabledBtn(val);
                } else {
                    return clickableBtn(val);
                };
            });
        } else {
            let filteredArr;

            if (page <= 5) {
                filteredArr = pageCountRange.slice(0, 0 + 5)
            } else {
                let slicingCounter = page - 6
                filteredArr = pageCountRange.slice(2 + slicingCounter, slicingCounter + 2 + 5)
            };
    
            return filteredArr.map((val, index) => {
                if (val === page) {
                    return disabledBtn(val);
                } else if (index >= showMaxRange) {
                    return
                } else if (index > showMaxRange && index < pageCountTotal - 1) {
                    return
                } else {
                    return clickableBtn(val);
                };
            });
        };
    };

    // SELECT PAGE FUNCTION SECTION
    const selectPageFilter = (event) => {
        setItemPerPage(parseInt(event.target.value));
        setPage(1);
    };

    const selectPage = (event) => {
        setPage(parseInt(event.target.value));
    };
    
    const prevPage = () => {
        if (page <= 0) {
            return
        } else {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        if (page >= pageCountTotal) {
            return
        } else {
            setPage(page + 1);
        }
    };
    // --------------

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getAuthData = useSelector((state) => state.auth);

    const {warehouse_id} = getAuthData;

    const fetchTransactions = async () => {
        try {
            if (value === 0) {
                const res = await axios.get(`${API_URL}/transaction/all-transactions?page=${page - 1}&limit=${itemPerPage}`);
                // console.log(res.data)
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } else if (value === 1) {
                const res = await axios.get(`${API_URL}/transaction/wait-pay-transactions?page=${page - 1}&limit=${itemPerPage}`);
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } else if (value === 2) {
                const res = await axios.get(`${API_URL}/transaction/wait-confirm-transactions?page=${page - 1}&limit=${itemPerPage}`);
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } else if (value === 3) {
                const res = await axios.get(`${API_URL}/transaction/onprocess-transactions?page=${page - 1}&limit=${itemPerPage}`);
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } else if (value === 4) {
                const res = await axios.get(`${API_URL}/transaction/delivery-transactions?page=${page - 1}&limit=${itemPerPage}`);
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } else if (value === 5) {
                const res = await axios.get(`${API_URL}/transaction/received-transactions?page=${page - 1}&limit=${itemPerPage}`);
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } else {
                const res = await axios.get(`${API_URL}/transaction/fail-transactions?page=${page - 1}&limit=${itemPerPage}`);
                setTransactions(res.data);
                setTransactionLength(parseInt(res.headers["x-total-count"]));
            } 
        } catch (error) {
            console.log(error);
        } 
        // finally {
        //     let dropdownArr = [];
        //     for (let i = 0; i < transactions.length; i++) {
        //         dropdownArr[i] = false;
        //     };
        //     setDropdownLength([...dropdownArr]);

        //     let modalArr = [];
        //     for (let i = 0; i < transactions.length; i++) {
        //         modalArr[i] = false;
        //     };
        //     setModalLength([...modalArr]);
        // };
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchTransactions();
            await setLoadData(false);
        }
        fetchData();
    }, [value, page, itemPerPage])

    const renderTransactionTable = (arrayToMap) => {
        return (
            <>
                {!loadData ?
                    <>
                        <TableContainer component={Paper} className="adm-table-style-override">
                            <Table sx={{ minWidth: 650 }} aria-label="manage transaction table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" width="106px">Order ID</TableCell>
                                        <TableCell align="left" width="280px">Transaction Date</TableCell>
                                        <TableCell align="left" width="160px">Status</TableCell>
                                        <TableCell align="left">Total</TableCell>
                                        <TableCell align="left">Assigned Warehouse</TableCell>
                                        {/* <TableCell align="left">Stock Status</TableCell> */}
                                        <TableCell align="left">Payment Proof</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {arrayToMap
                                    .map((val, index) => (
                                        <TableRow key={`transaction-0${val.id}`}>
                                            <TableCell align="left" component="th" scope="row">
                                                {val.id}
                                            </TableCell>
                                            <TableCell align="left">{val.transaction_date}</TableCell>
                                            <TableCell align="left" className="txt-capitalize">
                                                <div
                                                    id="adm-status-label"
                                                    className={
                                                        val.status_id === 1 || val.status_id === 2 ||  val.status_id === 3 ? "adm-process"
                                                        :
                                                        val.status_id === 4 ||  val.status_id === 5 ? "adm-success"
                                                        :
                                                        "adm-fail"
                                                    }
                                                >
                                                    {val.status}
                                                </div>
                                            </TableCell>
                                            <TableCell align="left">
                                                {`Rp ${thousandSeparator(val.transaction_amount)}`}
                                                <br />
                                                {`Shipping: Rp ${thousandSeparator(val.shipping_fee)}`}
                                            </TableCell>
                                            <TableCell align="left">
                                                {val.warehouse_name}
                                            </TableCell>
                                            {/* <TableCell align="left">
                                                Sufficient/Not Sufficient
                                            </TableCell> */}
                                            <TableCell align="left">
                                                <span className="adm-transaction-payproof-action" onClick={() => modalClick(index)}>
                                                    Detail
                                                </span>
                                            </TableCell>
                                            <TableCell align="center" style={{width: "176px"}}>
                                                <Link 
                                                    to={{
                                                        pathname: "/admin/manage-transaction/detail",
                                                        state: val
                                                    }}
                                                    className="link-no-decoration adm-transaction-detail-action"
                                                >
                                                    Transaction Detail
                                                </Link>
                                                {/* {val.status_id === 2 ?
                                                    renderDropdown(index)
                                                    : val.status_id === 3 ?
                                                    <AdmBtnPrimary width={"6rem"}>Send</AdmBtnPrimary>
                                                    :
                                                    <AdmBtnPrimary width={"6rem"} disabled={true}>No Action</AdmBtnPrimary>
                                                } */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="adm-transaction-pagination">
                                <div className="adm-transaction-pagination-item">
                                    <p>Product per Page:</p>
                                    <button 
                                        className="adm-transaction-dropdown-btn" 
                                        onClick={dropdownClick}
                                        onBlur={dropdownBlur}
                                    >
                                        {itemPerPage}
                                        <img 
                                            src={chevronDown} 
                                            style={{
                                                transform: toggleDropdown ? "rotate(90deg)" : "rotate(-90deg)"
                                            }}
                                        />
                                    </button>
                                    <ul 
                                        className="adm-transaction-dropdown-menu" 
                                        style={{
                                            transform: toggleDropdown ? "translateX(0)" : "translateX(-5px)",
                                            opacity: toggleDropdown ? 1 : 0,
                                            zIndex: toggleDropdown ? 100 : -10,
                                        }}
                                    >
                                        {rowsPerPageOptions.map((val) => (
                                            val === itemPerPage ? 
                                            <li className="adm-transaction-dropdown-selected">{val}</li> 
                                            : 
                                            <li
                                                onClick={() => selectFilterYear(val)}
                                            >
                                                {val}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="adm-transaction-pagination-item">
                                    <button 
                                        className="adm-transaction-prev-btn" 
                                        disabled={page === 1} 
                                        onClick={prevPage}
                                    >
                                        <img src={paginationPrevArrow} alt="Pagination-Prev-Arrow" />
                                    </button>
                                    {renderPageRange()}
                                    <button 
                                        className="adm-transaction-next-btn" 
                                        disabled={page === pageCountTotal} 
                                        onClick={nextPage}
                                    >
                                        <img src={paginationNextArrow} alt="Pagination-Next-Arrow" />
                                    </button>
                                </div>
                            </div>
                        </TableContainer>
                    </>    
                    :
                    <div className="adm-transaction-spinner-wrap">
                        <CircularProgress />
                    </div>
                }
            </>
        )
    };

    // RENDER DROPDOWN ACTION MENU
    // const dropdownClick = (index) => {
    //     if (!dropdownLength[index]) {
    //         setDropdownLength((prevState) => {
    //             let newArray = prevState;
    //             newArray[index] = true;
    //             return [...newArray];
    //         });
    //     } else {
    //         setDropdownLength((prevState) => {
    //             let newArray = prevState;
    //             newArray[index] = false;
    //             return [...newArray];
    //         });
    //     };
    // };

    // const dropdownBlur = () => {
    //     let newArr = dropdownLength.map(() => { // Clickaway action dropdown menu/menutup kembali dropdown bila klik diluar dropdown
    //         return false;
    //     })
    //     setDropdownLength([...newArr]);
    // };

    // const renderDropdown = (index) => {
    //     return (
    //         <div className="adm-transaction-dropdown-parent">
    //             <button 
    //                 className="adm-transaction-dropdown-btn" 
    //                 onClick={() => dropdownClick(index)}
    //                 onBlur={() => dropdownBlur(index)}
    //             >
    //                 Options
    //                 <img 
    //                     src={chevronDown} 
    //                     style={{
    //                         transform: dropdownLength[index] ? "rotate(-180deg)" : "rotate(0deg)"
    //                     }}
    //                 />
    //             </button>
    //             <ul 
    //                 className="adm-transaction-dropdown-menu" 
    //                 style={{
    //                     transform: dropdownLength[index] ? "translateY(0)" : "translateY(-5px)",
    //                     opacity: dropdownLength[index] ? 1 : 0,
    //                     zIndex: dropdownLength[index] ? 100 : -10,
    //                 }}
    //             >
    //                 <li className="acc-hover">
    //                     <img src={AcceptIcon} />
    //                     Accept
    //                 </li>
    //                 <li className="reject-hover">
    //                     <img src={RejectIcon} />
    //                     Reject
    //                 </li>
    //             </ul>
    //         </div>
    //     )
    // };

    // RENDER DROPDOWN FILTER YEAR
    const filterYearLimit = 4;

    // const nowYear = date.getFullYear();

    // let yearRange = Array(filterYearLimit).fill(null).map((val, index) => nowYear - index); // Itung range filter year yang bisa dipilih

    const dropdownClick = () => {
        setToggleDropwdown(!toggleDropdown);
    };

    const dropdownBlur = () => {
        setToggleDropwdown(false)
    };

    const selectFilterYear = (yearValue) => {
        setItemPerPage(yearValue);
        setToggleDropwdown(false);
        setLoadData(true);
    };

    // RENDER MODAL SHOW PAYMENT PROOF
    const modalClick = (index) => {
        if (!modalLength[index]) {
            setModalLength((prevState) => {
                let newArray = prevState;
                newArray[index] = true;
                return [...newArray];
            });
        } else {
            setModalLength((prevState) => {
                let newArray = prevState;
                newArray[index] = false;
                return [...newArray];
            });
        };
    };

    const onCloseModal = (index) => {
        setModalLength((prevState) => {
            let newArray = prevState;
            newArray[index] = false;
            return [...newArray];
        });
    };

    const renderImgError = () => {
        const errPath = "/assets/images/Test_Broken_Img.png"
        document.querySelector("div.payproof-modal-body-wrap > img").src=`${API_URL}${errPath}`;
    };

    const payProofModal = (orderId, paymentProof, index) => {
        return (
            <>
                <div className="payproof-modal-heading-wrap">
                    <h4>{`Order ID ${orderId} - Payment Proof`}</h4>
                </div>
                <div className="payproof-modal-body-wrap">
                    <img 
                        src={`${API_URL}${paymentProof}`}
                        alt={`Payment-Proof-Order-${orderId}`}
                        onError={renderImgError}
                    />
                </div>
                <div className="payproof-modal-foot-wrap">
                    <AdmBtnPrimary width={"6rem"} onClick={() => onCloseModal(index)}>Back</AdmBtnPrimary>
                </div>
            </>
        )
    };

    return (
        <div className="adm-transaction-main-wrap">
            <div className="adm-transaction-header-wrap">
                <h4>Manage Transaction</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="adm-transaction-contents-wrap">
                <div>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs 
                                value={value} 
                                onChange={handleChange}
                                TabIndicatorProps={{
                                    style: {
                                      backgroundColor: "#0A4D3C"
                                     }
                                    }}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="manage transaction tabs"
                            >
                                <Tab label="All" {...a11yProps(0)} style={{textTransform: "capitalize"}}/>
                                <Tab label="Wait Payment" {...a11yProps(1)} style={{textTransform: "capitalize"}}/>
                                <Tab label="Wait Confirm" {...a11yProps(2)} style={{textTransform: "capitalize"}}/>
                                <Tab label="On Process" {...a11yProps(0)} style={{textTransform: "capitalize"}}/>
                                <Tab label="On Delivery" {...a11yProps(1)} style={{textTransform: "capitalize"}}/>
                                <Tab label="Received" {...a11yProps(2)} style={{textTransform: "capitalize"}}/>
                                <Tab label="Rejected & Expired" {...a11yProps(2)} style={{textTransform: "capitalize"}}/>
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                        <TabPanel value={value} index={5}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                        <TabPanel value={value} index={6}>
                            {renderTransactionTable(transactions)}
                        </TabPanel>
                    </Box>
                </div>
                {transactions.map((val, index) => (
                    <Modal open={modalLength[index]} close={() => onCloseModal(index)}>
                        {payProofModal(val.id, val.payment_proof, index)}
                    </Modal>
                ))}
            </div>
        </div>
    )
}

export default ManageTransaction;