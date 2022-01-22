import React, { useState, useEffect } from "react";

// Library react

import axios from "axios";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Component MUI

import {
  Breadcrumbs,
  Pagination,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

// Components custom

import "./styles/logRequest.css";
import "./styles/stockRequest.css";
import assets from "./../../assets";
import { API_URL } from "../../constants/api";
import NotFoundPage from "../non-user/NotFoundV1";

// Styling tabel cell

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

// Styling tabel row

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

// Array breadcrumbs

const breadcrumbs = [
  <Link
    to="/admin/"
    key="1"
    className="link-no-decoration adm-breadcrumb-modifier"
  >
    Dashboard
  </Link>,
  <Link key="2" className="link-no-decoration adm-breadcrumb-modifier">
    Log request
  </Link>,
];

function LogRequest() {
  const dataAdmin = useSelector((state) => state.auth); // Get data admin from redux

  // STATE

  const [value, setValue] = useState(0); // Untuk meyimpan data value tab
  const [dataLogRequest, setDataLogRequest] = useState([]); // Menyimpan data log request

  // state pagination

  const [page, setPage] = useState(1); // Value page
  const [limit, setLimit] = useState(5); // Value limit
  const [totalItem, setTotalItem] = useState(null); // Total item
  const [handleDropdown, setHandleDropdown] = useState(false);

  // Loading state

  const [loadingPage, setLoadingPage] = useState(false); // Loading render data

  // Get data from redux

  const getRoleId = useSelector((state) => state.auth.role_id);

  useEffect(() => {
    (async () => {
      try {
        setLoadingPage(true);

        let res = await axios.get(
          `${API_URL}/stock/get/log-request?statusId=${value}&warehouseId=${
            dataAdmin.warehouse_id
          }&page=${page - 1}&limit=${limit}`
        );

        setTotalItem(parseInt(res.headers["x-total-count"]));
        setDataLogRequest(res.data);

        setLoadingPage(false);
      } catch (error) {
        console.log(error);
        console.log(error.response.data.message);
      }
    })();
  }, [value, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [value]);

  // EVENT

  // Handle mengubah value tab

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `manage-transaction-tab-${index}`,
      "aria-controls": `manage-transaction-tabpanel-${index}`,
    };
  }

  // Handle untuk mengubah halaman

  const handleChangePage = (event, value) => {
    setPage(value);
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

  // Render breadcrukmb

  const renderBreadcrumb = () => {
    return (
      <Stack spacing={2}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="transaction detail breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
    );
  };

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
              label="Stock in"
              {...a11yProps(0)}
              style={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Stock out"
              {...a11yProps(1)}
              style={{ textTransform: "capitalize" }}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}></TabPanel>
        <TabPanel value={value} index={1}></TabPanel>
      </Box>
    );
  };

  // Render tabel

  const renderTable = () => {
    return (
      <Table sx={{ minWidth: 650 }} aria-label="manage transaction table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#FCB537" }}>
            <StyledTableCell align="left">No.</StyledTableCell>
            <StyledTableCell align="left">Last Update</StyledTableCell>
            <StyledTableCell align="left">Orders Id</StyledTableCell>
            <StyledTableCell align="left">Product Name</StyledTableCell>
            <StyledTableCell align="left">Warehouse Origin</StyledTableCell>
            <StyledTableCell align="left">
              Warehouse Destination
            </StyledTableCell>
            <StyledTableCell align="left">Qty</StyledTableCell>
            <StyledTableCell align="center">Status Request</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{loadingPage ? null : renderTableRow()}</TableBody>
      </Table>
    );
  };

  // Render tabel row

  const renderTableRow = () => {
    return dataLogRequest.map((el, index) => {
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
          <StyledTableCell align="left">{el.orders_id}</StyledTableCell>
          <StyledTableCell align="left">
            {el.name.length > 35
              ? el.name.charAt(0).toUpperCase() + el.name.slice(1, 35) + "..."
              : el.name.charAt(0).toUpperCase() + el.name.slice(1)}
          </StyledTableCell>
          <StyledTableCell align="left">{el.origin}</StyledTableCell>
          <StyledTableCell align="left">{el.destination}</StyledTableCell>
          <StyledTableCell align="left">{el.qty}</StyledTableCell>
          <StyledTableCell align="left">
            <div className="log-req-accepted d-flex align-items-center justify-content-center">
              {el.status.charAt(0).toUpperCase() + el.status.slice(1)}
            </div>
          </StyledTableCell>
        </StyledTableRow>
      );
    });
  };

  // Render ketika tidak ada data yang dirender

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

  // Render tombol pagination

  const renderPagination = () => {
    return (
      <Pagination
        page={page}
        onChange={handleChangePage}
        count={Math.ceil(totalItem / limit)}
      />
    );
  };

  // Render loading spinner

  const renderSpinner = () => {
    return (
      <>
        <div className="d-flex align-items-center justify-content-center w-100 p-5">
          <Spinner color="success">Loading...</Spinner>;
        </div>
      </>
    );
  };

  // Render info page

  // Render info sudah berapa data yang tampil

  const renderInfoPage = () => {
    return (
      <div
        className="mb-3 mt-2"
        style={{ fontSize: "0.875em", color: "#5a5a5a" }}
      >
        {`Showing ${
          totalItem < limit ? totalItem : limit * page
        } of ${totalItem} request`}
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

  return (
    <div className="container-fluid vh-100 p-4" style={{ overflow: "auto" }}>
      {getRoleId === 2 ?
        <>
          <div className="my-2">
            <div className="mb-4">{renderBreadcrumb()}</div>
            {renderTab()}
            <div className="stock-req-wrapper-table px-4 py-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                {renderInfoPage()}
                {renderChangeRowsPerPage()}
              </div>
              {renderTable()}
              {loadingPage ? renderSpinner() : null}
              {dataLogRequest.length ? null : renderEmptyData()}
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end mt-3">
            {renderPagination()}
          </div>
        </>
        :
        <NotFoundPage />
      }
    </div>
  );
}

export default LogRequest;
