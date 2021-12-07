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
import paginationPrevArrow from "../../assets/components/Pagination-Prev-Arrow.svg";
import paginationNextArrow from "../../assets/components/Pagination-Next-Arrow.svg";
import Select from 'react-select';


function ManageProduct() {
    // Ide: 1. render all product, 2. render per warehouse nnti klik angka stok utk tampilin modal
    const [products, setProducts] = useState([]);
    
    // PER WAREHOUSE MODAL SECTION
    const [addProdModal, setAddProdModal] = useState(false);

    const addProdToggle = () => setAddProdModal(!addProdModal);

    // PAGINATION SECTION
    const [page, setPage] = useState(0);

    const [itemPerPage, setItemPerPage] = useState(3);

    const [prodLength, setProdLength] = useState(0);

    const [pageSelected, setPageSelected] = useState(0); // Belum digunakan, besar % hapus

    let pageCountTotal = Math.ceil(prodLength / itemPerPage); // Itung total jumlah page yg tersedia

    let pageCountRange = Array(pageCountTotal).fill(null).map((val, index) => index + 1); // Itung range page yang bisa di-klik

    let firstCount = pageCountRange[0]; // Tentuin first page yg mana, utk most first button

    let lastCount = pageCountRange[pageCountRange.length - 1]; // Tentuin last page yg mana, utk most last button

    let showMaxRange = 4; // Tentuin default max range yg tampil/di-render berapa buah

    const renderPageRange = () => {
        let sisaPagination = products.length % itemPerPage;

        return pageCountRange.map((val, index) => {
            if (index === page) {
                return (
                    <button className="adm-products-pagination-btn" value={val} onClick={(event) => selectPage(event)} disabled>
                        {val}
                    </button>
                )
            } else if (index === showMaxRange) {
                return (
                    <span>. . .</span>
                )
            } else if (index > showMaxRange && index < pageCountTotal - 1) {
                return
            } else {
                return (
                    <button className="adm-products-pagination-btn" value={val} onClick={(event) => selectPage(event)}>
                        {val}
                    </button>
                )
            };
        });
    };

    const rowsPerPageOptions = [3, 5, 10, 50];

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
    
    const prevPage = () => {
        if (page <= 0) {
            return
        } else {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        if (page + 1 >= pageCountTotal) {
            return
        } else {
            setPage(page + 1);
        }
    };

    const selectPageFilter = (event) => {
        setItemPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const fetchProdData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/product/pagination?page=${page}&limit=${itemPerPage}`);
            setProducts(res.data);
            setProdLength(parseInt(res.headers["x-total-count"]));
        } catch (error) {
            console.log(error);
        };
    };
    
    useEffect(() => {
        fetchProdData();
    },[page, itemPerPage]);
    
    console.log("Page setelah useEffect 01", page);
    console.log("Prodlength setelah useEffect 02", prodLength);
    console.log("Products setelah useEffect 03", products);

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
                            .map((val) => (
                                <TableRow
                                key={val.SKU}
                                >
                                    {/* {console.log(val.images[0], "Masuk sini")} */}
                                    <TableCell align="center" component="th" scope="row">
                                        {/* Render image blm selesai */}
                                        <img src={`${API_URL}/src${val.images[0]}`} style={{height: "100px", width: "100px"}} alt={val.name}/>
                                    </TableCell>
                                    <TableCell align="left">
                                        {val.id}
                                        <br />
                                        SKU: {val.SKU}
                                    </TableCell>
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
                            <button 
                                className="adm-products-prev-btn" 
                                disabled={!page ? true : false} 
                                onClick={prevPage}
                            >
                                <img src={paginationPrevArrow} alt="Pagination-Prev-Arrow" />
                            </button>
                            {renderPageRange()}
                            <button 
                                className="adm-products-next-btn" 
                                disabled={(page + 1 === pageCountTotal) ? true : false} 
                                onClick={nextPage}
                            >
                                <img src={paginationNextArrow} alt="Pagination-Next-Arrow" />
                            </button>
                        </div>
                    </div>
                </TableContainer>
            </div>
        </div>
    )
}

export default ManageProduct;