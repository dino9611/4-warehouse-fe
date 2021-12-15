import React, { useEffect, useState } from 'react';
import "./styles/ManageProduct.css";
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
import {Link} from "react-router-dom";
import deleteTrash from "../../assets/components/Delete-Trash.svg";
import editIcon from "../../assets/components/Edit-Icon.svg";
import chevronDown from "../../assets/components/Chevron-Down.svg";
import Swal from 'sweetalert2';

function ManageProduct() {
    // Ide: 1. render all product, 2. render per warehouse nnti klik angka stok utk tampilin modal
    const [products, setProducts] = useState([]);

    // PAGINATION SECTION
    const [page, setPage] = useState(1);

    const [itemPerPage, setItemPerPage] = useState(5);

    const [prodLength, setProdLength] = useState(0);

    let pageCountTotal = Math.ceil(prodLength / itemPerPage); // Itung total jumlah page yg tersedia

    let pageCountRange = Array(pageCountTotal).fill(null).map((val, index) => index + 1); // Itung range page yang bisa di-klik
    
    let showMaxRange = 5; // Tentuin default max range yg tampil/di-render berapa buah

    let firstCount = pageCountRange[0]; // Tentuin first page yg mana, utk most first button (blm dipake)

    let lastCount = pageCountRange[pageCountRange.length - 1]; // Tentuin last page yg mana, utk most last button (blm dipake)

    // PER WAREHOUSE MODAL SECTION (Belum dipake)
    // const [addProdModal, setAddProdModal] = useState(false);

    // const addProdToggle = () => setAddProdModal(!addProdModal);
    
    // const showWhModal = AdminWhStockModal();

    // const showWhStock = () => {
    //     ("Click detected");
    //     return <AdminWhStockModal addProdModal={addProdModal} addProdToggle={addProdToggle} />
    // }

    // FETCH & RENDER SECTION
    const fetchProdData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/product/pagination?page=${page - 1}&limit=${itemPerPage}`);
            setProducts(res.data);
            setProdLength(parseInt(res.headers["x-total-count"]));
        } catch (error) {
            console.log(error);
        };
    };
    
    useEffect(() => {
        fetchProdData();
        console.log("Line 67: ", products);
    }, [page, itemPerPage]);

    useEffect(() => {
        for (let i = 0; i < products.length; i++) {
            setDropdownLength((prevState) => {
                let newArray = prevState;
                newArray[i] = false;
                return [...newArray];
            })
        };
        // setDropdownLength(dropdownLength.splice(products.length));
        // console.log("Line 87 Manage Product: ", dropdownLength);
    }, [products])

    // RENDER PAGE RANGE SECTION
    const renderPageRange = () => {
        const disabledBtn = (value) => {
            return (
                <button className="adm-products-pagination-btn" value={value} onClick={(event) => selectPage(event)} disabled>
                    {value}
                </button>
            );
        };

        const clickableBtn = (value) => {
            return (
                <button className="adm-products-pagination-btn" value={value} onClick={(event) => selectPage(event)}>
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

    // FILTER ITEM PER PAGE SECTION
    const rowsPerPageOptions = [1, 3, 5, 10, 50];

    const renderRowsOptions = () => {
        return rowsPerPageOptions.map((val) => {
            if (val === itemPerPage) {
                return (
                    <button className="products-per-page-btn" value={val} onClick={(event) => selectPageFilter(event)} disabled>
                        {val}
                    </button>
                );
            } else {
                return(
                    <button className="products-per-page-btn" value={val} onClick={(event) => selectPageFilter(event)}>
                        {val}
                    </button>
                );
            };
        });
    };

    // SELECT FUNCTION SECTION
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

    // RENDER DROPDOWN ACTION MENU
    const [dropdownLength, setDropdownLength] = useState([]);

    const dropdownClick = (index) => {
        if (!dropdownLength[index]) {
            setDropdownLength((prevState) => {
                let newArray = prevState;
                newArray[index] = true;
                return [...newArray];
            });
        } else {
            setDropdownLength((prevState) => {
                let newArray = prevState;
                newArray[index] = false;
                return [...newArray];
            });
        }
        console.log(dropdownLength);
    };

    const dropdownBlur = (index) => {
        if (!dropdownLength[index]) {
            setDropdownLength((prevState) => {
                let newArray = prevState;
                newArray[index] = true;
                return [...newArray];
            });
        } else {
            setDropdownLength((prevState) => {
                let newArray = prevState;
                newArray[index] = false;
                return [...newArray];
            });
        }
    };

    const delProdClick = (prodId, SKU, prodName) => {
        Swal.fire({
            title: `Are you sure delete ${prodName} ?`,
            text: `[ ID: ${prodId} | SKU: ${SKU} ]`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#43936C',
            cancelButtonColor: '#CB3A31',
            confirmButtonText: 'Yes! (NO UNDO)'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
            }
          })
    }

    return (
        <div className="adm-products-main-wrap">
            <div className="adm-products-header-wrap">
                <h4>Manage Product</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="adm-products-contents-wrap">
                <TableContainer component={Paper}>
                    <Link to="/admin/manage-product/add" className="adm-products-add-wrap">
                        <button>+ Add Products</button>
                    </Link>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Image</TableCell>
                                <TableCell align="center">Product ID</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Category</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Stock</TableCell>
                                <TableCell align="center" style={{width: "176px"}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products
                            .map((val, index) => (
                                <TableRow
                                key={val.SKU}
                                >
                                    <TableCell align="center" component="th" scope="row">
                                        <img 
                                            src={`${API_URL}/${val.images[0]}`} 
                                            style={{height: "100px", width: "100px"}} 
                                            alt={val.name}
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        {val.id}
                                        <br />
                                        SKU: {val.SKU}
                                    </TableCell>
                                    <TableCell align="center" className="txt-capitalize">{val.name}</TableCell>
                                    <TableCell align="center" className="txt-capitalize">{val.category}</TableCell>
                                    <TableCell align="right">{`Rp ${thousandSeparator(val.price)}`}</TableCell>
                                    <TableCell align="right">
                                        <span style={{cursor: "pointer"}}>
                                            {val.total_stock}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center" className="adm-products-action-cell">
                                        <button 
                                            className="adm-products-dropdown-btn" 
                                            onClick={() => dropdownClick(index)}
                                            onBlur={() => dropdownBlur(index)}
                                        >
                                            Pilihan
                                            <img 
                                                src={chevronDown} 
                                                style={{
                                                    transform: dropdownLength[index] ? "rotate(-180deg)" : "rotate(0deg)"
                                                }}
                                            />
                                        </button>
                                        <ul 
                                            className="adm-products-dropdown-menu" 
                                            style={{
                                                transform: dropdownLength[index] ? "translateY(0)" : "translateY(-5px)",
                                                opacity: dropdownLength[index] ? 1 : 0,
                                                zIndex: dropdownLength[index] ? 100 : -10,
                                            }}
                                        >
                                            <li 
                                                // onClick={editProdToggle}
                                            >
                                                <img src={editIcon} />
                                                <Link to="/admin/manage-product/edit" className="link-no-decoration">
                                                    Edit
                                                </Link>
                                            </li>
                                            <li 
                                                onClick={() => delProdClick(val.id, val.SKU, val.name)}
                                            >
                                                <img src={deleteTrash} />
                                                Delete
                                            </li>
                                        </ul>
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
                                disabled={page === 1} 
                                onClick={prevPage}
                            >
                                <img src={paginationPrevArrow} alt="Pagination-Prev-Arrow" />
                            </button>
                            {renderPageRange()}
                            <button 
                                className="adm-products-next-btn" 
                                disabled={page === pageCountTotal} 
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