import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "./styles/stockRequest.css";

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
  const location = useLocation();
  const dataAdmin = useSelector((state) => state.auth);

  console.log(dataAdmin);

  useEffect(() => {
    (async () => {})();
  }, []);

  return (
    <div className="container-fluid mt-5">
      <Table sx={{ minWidth: 650 }} aria-label="manage transaction table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#FCB537" }}>
            <StyledTableCell align="left">No.</StyledTableCell>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="left">
              Warehouse Destination
            </StyledTableCell>
            <StyledTableCell align="left">Qty</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell align="left">Order ID</StyledTableCell>
            <StyledTableCell align="left">Transaction Date</StyledTableCell>
            <StyledTableCell align="left">Status</StyledTableCell>
            <StyledTableCell align="left">Total Amount</StyledTableCell>
            <StyledTableCell align="left">Assigned Warehouse</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default StockRequest;
