import React, { useState, useEffect } from "react";

// Library react

import axios from "axios";
import { Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Material UI

// Table

import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

// Tab

import { Box } from "@mui/system";
import Paper from "@mui/material/Paper";
import { Pagination, Tab, Tabs } from "@mui/material";

// Component

import "./styles/stockRequest.css";
import assets from "./../../assets";
import "./styles/ManageTransaction.css";
import { API_URL } from "../../constants/api";
import { successToast, errorToast } from "../../redux/actions/ToastAction";
import NotFoundPage from "../non-user/NotFoundV1";

// Styling for table cell

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    border: 0,
    fontWeight: 600,
    fontSize: "0.75em",
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "#5A5A5A",
    fontWeight: 500,
    fontSize: "0.75em",
  },
}));

// Styling for Table row

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

function StockRequest() {
  const dataAdmin = useSelector((state) => state.auth); // Get admin data from redux

  // STATE

  const [value, setValue] = useState(0); // State untuk menyimpan value tab
  const [handleDropdown, setHandleDropdown] = useState(false);
  const [dataStockRequest, setDataStockRequest] = useState([]); // State untuk menyimpan data stock request

  // Loading State

  const [loadingReject, setLoadingReject] = useState(false); // Loading ketika reject request
  const [loadingAccept, setLoadingAccept] = useState(false); // Loading ketika accept request
  const [loadingPage, setLoadingPage] = useState(false); // Loading pada saat render tabel yang berisi data

  // State pagination

  const [page, setPage] = useState(1); // State halaman
  const [limit, setLimit] = useState(5); // State Untuk mengatur limit data
  const [totalData, setTotalData] = useState(null); // State untuk menyimpan jumlah total semua item

  // Get data from redux

  const getRoleId = useSelector((state) => state.auth.role_id);

  useEffect(() => {
    (async () => {
      if (!loadingAccept || !loadingReject) {
        try {
          setLoadingPage(true);

          let res = await axios.get(
            `${API_URL}/stock/get/stock-request?origin=${
              dataAdmin.warehouse_id
            }&statusId=${value + 1}&page=${page - 1}&limit=${limit}`
          );

          setTotalData(res.headers["x-total-count"]);
          setDataStockRequest(res.data);

          setLoadingPage(false);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [value, loadingReject, loadingAccept, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [value]);

  // EVENT

  // Untuk mengganti value dari tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `manage-transaction-tab-${index}`,
      "aria-controls": `manage-transaction-tabpanel-${index}`,
    };
  }

  // Handle untuk mengganti halaman

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Onclick pada saat admin reject barang

  const onClickRejectRequest = async (ordersId, productId, warehouseId) => {
    try {
      setLoadingReject(true);

      await axios.patch(
        `${API_URL}/stock/reject/stock-request?ordersId=${ordersId}&productId=${productId}&warehouseId=${warehouseId}`
      );

      setLoadingReject(false);

      successToast("Request rejected succesfully!");
    } catch (error) {
      errorToast(error.response.data.message);
      console.log(error);
    }
  };

  // Onclick pada saat admin accept barang

  const onClickAcceptRequest = async (data) => {
    const {
      warehouse_destination,
      warehouse_origin,
      product_id,
      orders_id,
      qty,
    } = data;

    const dataAccept = {
      warehouse_id: warehouse_destination,
      orders_id,
      product_id,
      stock: qty,
    };

    try {
      setLoadingAccept(true);

      await axios.post(
        `${API_URL}/stock/accept/stock-request?ordersId=${orders_id}&productId=${product_id}&warehouseId=${warehouse_origin}`,
        dataAccept
      );

      setLoadingAccept(false);

      successToast("Request accepted successfully!");
    } catch (error) {
      errorToast(error.response.data.message);
      console.log(error);
    }
  };

  const dropdownClick = () => {
    //* Buka tutup menu dropdown
    setHandleDropdown(!handleDropdown);
  };

  const dropdownBlur = () => {
    //* Tutup menu dropdown ketika click diluar wrap menu dropdown
    setHandleDropdown(false);
  };

  // RENDERING

  // Render tab panel

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
          <Box className="adm-transaction-tabpanel-wrap">{children}</Box>
        )}
      </div>
    );
  }

  // Render tab

  const renderTab = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#0A4D3C",
                fontSize: "0.75em",
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="manage transaction tabs"
          >
            <Tab
              label="Ongoing"
              {...a11yProps(0)}
              style={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Rejected"
              {...a11yProps(1)}
              style={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Accepted"
              {...a11yProps(2)}
              style={{ textTransform: "capitalize" }}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {/* {renderTransactionTable(transactions)} */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* {renderTransactionTable(transactions)} */}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* {renderTransactionTable(transactions)} */}
        </TabPanel>
      </Box>
    );
  };

  // Render Table

  const renderTable = () => {
    return (
      <TableContainer
        component={Paper}
        style={{ borderRadius: 0, boxShadow: "none" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="manage transaction table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#FCB537" }}>
              <StyledTableCell align="left">No.</StyledTableCell>
              <StyledTableCell align="left">Last update</StyledTableCell>
              <StyledTableCell align="left">Product name</StyledTableCell>
              <StyledTableCell align="left">Order Id</StyledTableCell>
              <StyledTableCell align="left">
                Warehouse Destination
              </StyledTableCell>
              <StyledTableCell align="left">Qty</StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{loadingPage ? null : renderTableRow()}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render list tabel yang berisi data

  const renderTableRow = () => {
    return dataStockRequest.map((el, index) => {
      var date = new Date(el.last_update);

      var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      return (
        <StyledTableRow key={index}>
          <StyledTableCell align="left">
            {index + page * limit - (limit - 1)}
          </StyledTableCell>
          <StyledTableCell align="left">
            {date.toLocaleDateString("id", options)}
          </StyledTableCell>
          <StyledTableCell align="left">
            {el.name.length > 35
              ? el.name.charAt(0).toUpperCase() + el.name.slice(1, 35) + "..."
              : el.name.charAt(0).toUpperCase() + el.name.slice(1)}
          </StyledTableCell>
          <StyledTableCell align="left">{el.orders_id}</StyledTableCell>
          <StyledTableCell align="left">{el.destination}</StyledTableCell>
          <StyledTableCell align="left">{el.qty}</StyledTableCell>
          <StyledTableCell align="left">
            <div
              className={`${
                el.status_id === 1
                  ? "stock-req-status-ongoing"
                  : el.status_id === 2
                  ? "stock-req-status-rejected"
                  : "stock-req-status-accepted"
              } d-flex align-items-center justify-content-center`}
            >
              {el.status.charAt(0).toUpperCase() + el.status.slice(1)}
            </div>
          </StyledTableCell>
          <StyledTableCell align="center">
            {el.status_id === 1
              ? renderBtnAction(
                  el.orders_id,
                  el.product_id,
                  el.warehouse_origin,
                  el
                )
              : "No action"}
          </StyledTableCell>
        </StyledTableRow>
      );
    });
  };

  // Render btn action untuk setiap row data tabel

  const renderBtnAction = (ordersId, productId, warehouseId, data) => {
    return (
      <div className="d-flex justify-content-center">
        <button
          className="d-flex align-items-center justify-content-center stock-req-btn stock-req-btn-reject mr-2"
          onClick={() => onClickRejectRequest(ordersId, productId, warehouseId)}
          disabled={loadingReject ? true : false}
        >
          {loadingReject ? (
            <Spinner color="danger" size="sm">
              Loading...
            </Spinner>
          ) : (
            <img src={assets.close} alt="reject" />
          )}
        </button>
        <button
          className="d-flex align-items-center justify-content-center stock-req-btn stock-req-btn-accept"
          onClick={() => onClickAcceptRequest(data)}
          disabled={loadingReject ? true : false}
        >
          {loadingAccept ? (
            <Spinner color="success" size="sm">
              Loading...
            </Spinner>
          ) : (
            <img src={assets.centang} alt="accept" />
          )}
        </button>
      </div>
    );
  };

  // Render jika tidak ada data yang dirender akan muncul empty array

  const renderEmptyData = () => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center w-100 p-5">
        <img
          src={assets.emptycart}
          alt="emptycart"
          style={{ width: "160px", aspectRatio: "1" }}
          className="mb-3"
        />
        <div style={{ fontWeight: "500", color: "#070707" }}>
          No data available
        </div>
      </div>
    );
  };

  // Render tombol untuk pagination

  const renderPagination = () => {
    return (
      <Pagination
        page={page}
        onChange={handleChangePage}
        count={Math.ceil(totalData / limit)}
      />
    );
  };

  // Render loading spinner

  const renderSpinner = () => {
    return (
      <>
        <div className="d-flex align-items-center justify-content-center w-100 p-5">
          <Spinner color="success">Loading...</Spinner>
        </div>
      </>
    );
  };

  // Render info sudah berapa data yang tampil

  const renderInfoPage = () => {
    return (
      <div
        className="mb-3 mt-2"
        style={{ fontSize: "0.875em", color: "#5a5a5a" }}
      >
        {`Showing ${
          totalData < limit ? totalData : limit * page
        } of ${totalData} request`}
      </div>
    );
  };

  // Render untuk memilih limit data

  const renderChangeRowsPerPage = () => {
    const itemsPerPageArr = [5, 10, 15];

    return (
      <div className="adm-transaction-dropdown-wrap">
        <button
          className="adm-transaction-dropdown-btn"
          onClick={dropdownClick}
          onBlur={dropdownBlur}
        >
          {limit}
          <img
            src={assets.down}
            style={{
              transform: handleDropdown ? "rotate(-180deg)" : "rotate(0deg)",
            }}
          />
        </button>
        <ul
          className="adm-transaction-dropdown-menu"
          style={{
            transform: handleDropdown ? "translateY(0)" : "translateY(-5px)",
            opacity: handleDropdown ? 1 : 0,
            zIndex: handleDropdown ? 100 : -10,
          }}
        >
          {itemsPerPageArr.map((el, index) => (
            <li key={index} onClick={() => setLimit(el)}>
              {el}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // RETURN

  return (
    <div className="container-fluid vh-100" style={{ overflow: "auto" }}>
      {getRoleId === 2 ?
        <div className="my-2">
          {renderTab()}
          <div className="stock-req-wrapper-table px-4 py-3">
            <div className="d-flex justify-content-between">
              {renderInfoPage()}
              {renderChangeRowsPerPage()}
            </div>
            {renderTable()}
            {loadingPage ? renderSpinner() : null}
            {dataStockRequest.length ? null : renderEmptyData()}
          </div>
          <div className="d-flex align-items-center justify-content-end mt-3">
            {renderPagination()}
          </div>
        </div>
        :
        <NotFoundPage />
      }
    </div>
  );
}

export default StockRequest;
