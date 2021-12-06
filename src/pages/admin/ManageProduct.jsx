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
    
    const [addProdModal, setAddProdModal] = useState(false);

    const addProdToggle = () => setAddProdModal(!addProdModal);

    useEffect(async () => {
        try {
            const res = await axios.get(`${API_URL}/product/pagination`);
            console.log(res.data);
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
                        {products.map((val) => (
                             <TableRow
                             key={val.id}
                             >
                                 {console.log(val.images[0], "Masuk sini")}
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
            </TableContainer>
            </div>
        </div>
    )
}

export default ManageProduct;