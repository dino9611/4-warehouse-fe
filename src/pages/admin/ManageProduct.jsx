import React, { useEffect, useState } from 'react';
import "./styles/ManageProduct.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import thousandSeparator from "../../helpers/ThousandSeparator";
import AdminWhStockModal from "../../components/admin/AdminWhStockModal";
import {API_URL} from "../../constants/api";


function ManageProduct() {
    // Ide: 1. render all product, 2. render per warehouse nnti klik angka stok utk tampilin modal
    const [products, setProducts] = useState([]);
    
    // PER WAREHOUSE MODAL SECTION
    const [addProdModal, setAddProdModal] = useState(false);

    const addProdToggle = () => setAddProdModal(!addProdModal);

    // PAGINATION SECTION
    const [page, setPage] = useState(0);

    const [itemPerPage, setItemPerPage] = useState(5);

    const [pageSelected, setPageSelected] = useState(0);

    let pageCountTotal = Math.ceil(products.length / itemPerPage); // Itung total jumlah page yg tersedia

    let pageCountRange = Array(pageCountTotal).fill(null).map((val, index) => index + 1); // Itung range page yang bisa di-klik

    let firstCount = pageCountRange[0]; // Tentuin first page yg mana, utk most first button

    let lastCount = pageCountRange[pageCountRange.length - 1]; // Tentuin last page yg mana, utk most last button

    let showMaxRange = 5 // Tentuin default max range yg tampil/di-render berapa buah

    const renderPageRange = () => {
        return pageCountRange.map((val, index) => {
            if (index === page) {
                return (
                    <button className="adm-products-pagination-btn" value={val} onClick={(event) => selectPage(event)} disabled>
                        {val}
                    </button>
                )
            } else {
                return(
                <button className="adm-products-pagination-btn" value={val} onClick={(event) => selectPage(event)}>
                    {val}
                </button>
                )
            };
        });
    };

    const rowsPerPageOptions = [5, 10, 50];

    const renderRowsOptions = () => {
        return rowsPerPageOptions.map((val) => {
            if (val === itemPerPage) {
                return (
                    <button className="products-per-page-btn" value={val} onClick={(event) => selectPageFilter(event)} disabled>
                        {val}
                    </button>
                )
            } else {
                return(
                    <button className="products-per-page-btn" value={val} onClick={(event) => selectPageFilter(event)}>
                        {val}
                    </button>
                )
            };
        });
    };

    const selectPage = (event) => {
        setPage(event.target.value - 1);
    };

    const selectPageFilter = (event) => {
        setItemPerPage(parseInt(event.target.value));
        setPage(0);
    };

    useEffect(async () => {
        try {
            const res = await axios.get(`${API_URL}/product/pagination`);
            // console.log(res.data);
            setProducts(res.data)
        } catch (error) {
            console.log(error);
        };
    },[]);

    // const showWhModal = AdminWhStockModal();

    // const showWhStock = () => {
    //     console.log("Click detected");
    //     return <AdminWhStockModal addProdModal={addProdModal} addProdToggle={addProdToggle} />
    // }

    return (
        <div className="adm-products-main-wrap">
            <div className="adm-products-header-wrap">
                <h4>Manage Product</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="adm-products-contents-wrap">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="center">Image</TableCell>
                        <TableCell align="center">Product ID</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Stock</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {products
                        .slice(page * itemPerPage, page * itemPerPage + itemPerPage)
                        .map((val) => (
                             <TableRow
                             key={val.id}
                             >
                                 {/* {console.log(val.images[0], "Masuk sini")} */}
                                <TableCell align="center" component="th" scope="row">
                                    <img src={`${API_URL}/src${val.images[0]}`} style={{height: "100px", width: "100px"}} alt={val.name}/>
                                </TableCell>
                                <TableCell align="center">{val.id}</TableCell>
                                <TableCell align="center" className="txt-capitalize">{val.name}</TableCell>
                                <TableCell align="center" className="txt-capitalize">{val.category}</TableCell>
                                <TableCell align="right">{`Rp${thousandSeparator(val.price)}`}</TableCell>
                                <TableCell align="right">
                                    <span style={{cursor: "pointer"}} onClick={addProdToggle}>
                                        {val.total_stock}
                                    </span>
                                    <AdminWhStockModal addProdModal={addProdModal} addProdToggle={addProdToggle} testVal={val.id}/>
                                </TableCell>
                                <TableCell align="center">
                                    <button className="btn btn-primary shadow-none">Pilihan</button>
                                </TableCell>
                             </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="adm-products-pagination">
                    <div className="adm-products-pagination-item">
                        <p>Product per Page:</p>
                        {renderRowsOptions()}
                    </div>
                    <div className="adm-products-pagination-item">
                        <div>{`<`}</div>
                        {renderPageRange()}
                        <div>{`>`}</div>
                    </div>
                </div>
            </TableContainer>
            </div>
        </div>
    )
}

export default ManageProduct;