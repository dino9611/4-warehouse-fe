import React, { useEffect, useState } from 'react';
import "./styles/ManageStock.css";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import thousandSeparator from "../../helpers/ThousandSeparator";
import AdminWhStockModal from "../../components/admin/AdminWhStockModal";
import {API_URL} from "../../constants/api";
import paginationPrevArrow from "../../assets/components/Pagination-Prev-Bg-White.svg";
import paginationNextArrow from "../../assets/components/Pagination-Next-Bg-White.svg";
import paginationPrevArrowInactive from "../../assets/components/Pagination-Prev-Bg-Gray.svg";
import paginationNextArrowInactive from "../../assets/components/Pagination-Next-Bg-Gray.svg";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import { useSelector } from "react-redux";
import { errorToast } from "../../redux/actions/ToastAction";
import AdminSkeletonSimple from "../../components/admin/AdminSkeletonSimple";
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";
import NotFoundPage from "../non-user/NotFoundV1";
import AdmBtnPrimary from '../../components/admin/AdmBtnPrimary';
import Swal from 'sweetalert2';
import Modal from '../../components/Modal';
import Textbox from "../../components/Textbox";
import AdmBtnSecondary from '../../components/admin/AdmBtnSecondary';

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

function ManageStock() {
    const [loadData, setLoadData] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [products, setProducts] = useState([]);

    const [editStockInput, setEditStockInput] = useState({});
    console.log(editStockInput); //!Test

    const [newStock, setNewStock] = useState([]);

    const [modalLength, setModalLength] = useState([]); //* Atur length dropdown edit stock agar dinamis

    // PAGINATION SECTION
    const [page, setPage] = useState(1);

    const [toggleDropdown, setToggleDropdown] = useState(false); //* Atur toggle dropdown filter product per page

    const [itemPerPage, setItemPerPage] = useState(5);

    const [prodLength, setProdLength] = useState(0);

    const [slicedProducts, setSlicedProducts] = useState([]); //* Utk render tampilan data item keberapa sampai keberapa dari total seluruh data

    let productsRange = Array(prodLength).fill(null).map((val, index) => index + 1); //* Utk bikin array berisi angka urut dari total data produk

    let pageCountTotal = Math.ceil(prodLength / itemPerPage); //* Itung total jumlah page yg tersedia

    let pageCountRange = Array(pageCountTotal).fill(null).map((val, index) => index + 1); // Itung range page yang bisa di-klik
    
    let showMaxRange = 5; //* Tentuin default max range yg tampil/di-render berapa buah

    //! let firstCount = pageCountRange[0]; //! Tentuin first page yg mana, utk most first button (blm dipake)

    //! let lastCount = pageCountRange[pageCountRange.length - 1]; //! Tentuin last page yg mana, utk most last button (blm dipake)

    // FILTER ITEM PER PAGE SECTION
    const rowsPerPageOptions = [5, 10, 50];

    // FETCH & useEFFECT SECTION
    const getAuthData = useSelector((state) => state.auth);

    const {role_id, warehouse_id, warehouse_name} = getAuthData;

    const fetchProdData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/warehouse-product/pagination?page=${page - 1}&limit=${itemPerPage}&whid=${warehouse_id}`);
            setProducts(res.data);
            setProdLength(parseInt(res.headers["x-total-count"]));
            setEditStockInput(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageProduct");
            console.log(error);
            setErrorFetch(true);
        };
    };

    const productsRangeSlice = () => { //* Utk setSlicedProducts berdasarkan value page yg aktif & filter itemPerPage
        if (page === 1) {
            setSlicedProducts(productsRange.slice(0, itemPerPage));
        } else {
            setSlicedProducts(productsRange.slice(itemPerPage * page - itemPerPage, itemPerPage * page));
        };
    };
    
    useEffect(() => {
        const fetchData = async () => {
            await fetchProdData();
            await setLoadData(false);
        };
        fetchData();
    }, [page, itemPerPage]);

    useEffect(() => { //* Utk sumber array showing n - n data of total N data (ex: 1-5 of 25)
        productsRangeSlice();
    }, [prodLength, page, itemPerPage]);

    const breadcrumbs = [
        <Link to="/admin/" key="1" className="link-no-decoration adm-breadcrumb-modifier">
          Dashboard
        </Link>,
        <Typography key="2" color="#070707" style={{fontSize: "0.75rem", margin: "auto"}}>
          Manage Stock
        </Typography>,
    ];

    // RENDER DROPDOWN FILTER PRODUCT PER PAGE AMOUNT
    const filterDropdownClick = () => { //* Buka tutup menu dropdown
        setToggleDropdown(!toggleDropdown);
    };

    const filterDropdownBlur = () => { //* Tutup menu dropdown ketika click diluar wrap menu dropdown
        setToggleDropdown(false)
    };

    const filterItemPerPage = (itemValue) => { //* Atur value filter item per page & behavior dropdown stlh action terjadi
        setItemPerPage(itemValue);
        setPage(1);
        setToggleDropdown(false);
        setLoadData(true);
    };
    
    // RENDER MODAL TO EDIT STOCK
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

    const editStockModal = (prodId, prodName, currentStock, whName, index) => {
        return (
            <>
                <div className="edit-stock-modal-head">
                    <h3 className="txt-capitalize">{`ID #${prodId} - ${prodName}`}</h3>
                </div>
                <div className="edit-stock-modal-body">
                    <h5>{`Current Stock at ${whName} = ${currentStock}`}</h5>
                    <Textbox
                        type="number"
                        label="Set Stock"
                        name="newStock"
                        value={newStock}
                        onChange={editStockHandler}
                        placeholder="Input new stock"
                        borderRadius={"8px"}
                    />
                </div>
                <div className="edit-stock-modal-foot">
                    <AdmBtnSecondary width={"6rem"} onClick={() => onCloseModal(index)}>Cancel</AdmBtnSecondary>
                    <AdmBtnPrimary width={"6rem"} onClick={() => onCloseModal(index)}>Submit</AdmBtnPrimary>
                </div>
            </>
        )
    };

    // RENDER PAGE RANGE SECTION
    const renderPageRange = () => { //* Utk render button select page pagination
        const disabledBtn = (value, index) => { //* Button page pagination yg saat ini aktif
            return (
                <button 
                    className="admWh-stock-pagination-btn" 
                    value={value} onClick={selectPage} 
                    disabled
                    key={index}
                >
                    {value}
                </button>
            );
        };

        const clickableBtn = (value, index) => { //* Button page pagination yg tdk aktif & bisa di-klik
            return (
                <button 
                    className="admWh-stock-pagination-btn" 
                    value={value} 
                    onClick={selectPage}
                    key={index}
                >
                    {value}
                </button>
            );
        };

        if (pageCountRange.length <= showMaxRange) {
            return pageCountRange.map((val, index) => {
                if (val === page) { //* Bila value button = value page --> aktif saat ini
                    return disabledBtn(val, index);
                } else {
                    return clickableBtn(val, index);
                };
            });
        } else {
            let filteredArr;

            if (page <= 5) {
                filteredArr = pageCountRange.slice(0, 0 + 5); //* Slice array utk tampilan button select page pagination bila <= 5 buah
            } else {
                let slicingCounter = page - 6;
                filteredArr = pageCountRange.slice(2 + slicingCounter, slicingCounter + 2 + 5);
                //* Slice array utk tampilan button select page pagination tengah2 (ex: 2-3-*4*-5, klik 5 jadi, 3-4-*5*-6)
            };
    
            return filteredArr.map((val, index) => {
                if (val === page) {
                    return disabledBtn(val, index);
                } else if (index >= showMaxRange) { //* Bila index >= range maksimum = tidak render
                    return
                } else if (index > showMaxRange && index < pageCountTotal - 1) {
                    return
                } else {
                    return clickableBtn(val, index);
                };
            });
        };
    };

    // SELECT PAGE FUNCTION SECTION
    const selectPage = (event) => { //* Rubah value page sesuai value button pagination yg di-klik
        setPage(parseInt(event.target.value));
    };
    
    const prevPage = () => { //* Ganti value page ketika klik previous arrow pagination
        if (page <= 0) {
            return
        } else {
            setPage(page - 1);
        }
    };

    const nextPage = () => {
        if (page >= pageCountTotal) { //* Ganti value page ketika klik next arrow pagination
            return
        } else {
            setPage(page + 1);
        }
    };

    // HANDLER FUNCTIONS SECTION
    const editStockHandler = (event) => { //* Utk setState edit stock
        setNewStock(parseInt(event.target.value));
    };

    // CLICK/SUBMIT FUNCTION SECTION
    const submitEditStock = async (event, prodId) => {

        try {
            await axios.patch(`${API_URL}/product/edit/stock/${prodId}`, newStock);
            Swal.fire({
                icon: 'success',
                title: 'Edit product success!',
                text: `Page will go to manage product page after confirm`,
                customClass: { //* CSS custom nya ada di AdminMainParent
                    popup: 'adm-swal-popup-override',
                    confirmButton: 'adm-swal-btn-override'
                },
                confirmButtonText: 'Continue',
                confirmButtonAriaLabel: 'Continue'
            });
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...something went wrong, reload/try again',
                customClass: { //* CSS custom nya ada di AdminMainParent
                    popup: 'adm-swal-popup-override',
                    confirmButton: 'adm-swal-btn-override'
                },
                confirmButtonText: 'Continue',
                confirmButtonAriaLabel: 'Continue'
            });
        };
    };

    return (
        <>
            {(role_id === 2) ?
                <div className="admWh-stock-main-wrap">
                    {!loadData ?
                        <>
                            <div className="admWh-stock-breadcrumb-wrap">
                                <Stack spacing={2}>
                                    <Breadcrumbs
                                        separator={<NavigateNextIcon fontSize="small" />}
                                        aria-label="manage stock breadcrumb"
                                    >
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>
                            </div>
                            { (!loadData && errorFetch) ?
                                <AdminFetchFailed />
                                :
                                <>
                                    <div className="admWh-stock-header-wrap">
                                        <h4>Manage Stock {warehouse_name}</h4>
                                    </div>
                                    <div className="admWh-stock-contents-wrap">
                                        <TableContainer component={Paper} className="adm-product-table-override">
                                            <div className="admWh-stock-filter">
                                                <div className="admWh-stock-filter-item">
                                                    {slicedProducts.length ?
                                                        <p>Showing {slicedProducts[0]} - {slicedProducts.slice(-1)} of {prodLength} products</p>
                                                        :
                                                        <p>Showing 0 of {prodLength} products</p>
                                                    }
                                                </div>
                                                <div className="admWh-stock-filter-item">
                                                    <p>Product per Page:</p>
                                                    <div className="admWh-stock-filter-dropdown-wrap">
                                                        <button 
                                                            className="admWh-stock-filter-dropdown-btn" 
                                                            onClick={filterDropdownClick}
                                                            onBlur={filterDropdownBlur}
                                                        >
                                                            {itemPerPage}
                                                            <img 
                                                                src={chevronDown} 
                                                                style={{
                                                                    transform: toggleDropdown ? "rotate(-180deg)" : "rotate(0deg)"
                                                                }}
                                                            />
                                                        </button>
                                                        <ul 
                                                            className="admWh-stock-filter-dropdown-menu" 
                                                            style={{
                                                                transform: toggleDropdown ? "translateY(0)" : "translateY(-5px)",
                                                                opacity: toggleDropdown ? 1 : 0,
                                                                zIndex: toggleDropdown ? 100 : -10,
                                                            }}
                                                        >
                                                            {rowsPerPageOptions.map((val, index) => (
                                                                val === itemPerPage ? 
                                                                <li className="admWh-stock-filter-dropdown-selected" key={index}>{val}</li> 
                                                                : 
                                                                <li onClick={() => filterItemPerPage(val)} key={index}>{val}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <Table sx={{ minWidth: 650 }} aria-label="manage stock table">
                                                <TableHead>
                                                    <TableRow style={{backgroundColor: "#FCB537"}}>
                                                        <StyledTableCell align="center">Image</StyledTableCell>
                                                        <StyledTableCell align="left">Product ID</StyledTableCell>
                                                        <StyledTableCell align="left">Name</StyledTableCell>
                                                        <StyledTableCell align="left">Category</StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            Stock
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center" style={{width: "176px"}}>Action</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {products
                                                    .map((val, index) => (
                                                        <StyledTableRow
                                                            key={val.SKU}
                                                        >
                                                            <StyledTableCell align="center" component="th" scope="row">
                                                                <img 
                                                                    src={`${API_URL}/${val.images[0]}`} 
                                                                    style={{height: "80px", width: "80px"}} 
                                                                    alt={val.name}
                                                                />
                                                            </StyledTableCell>
                                                            <StyledTableCell align="left">
                                                                {val.id}
                                                                <br />
                                                                SKU: {val.SKU}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="left" className="txt-capitalize">{val.name}</StyledTableCell>
                                                            <StyledTableCell align="left" className="txt-capitalize">{val.category}</StyledTableCell>
                                                            <StyledTableCell align="left">
                                                                {val.warehouse_stock}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center" className="txt-capitalize">
                                                                <span 
                                                                    className="adm-edit-stock-txtBtn" 
                                                                    onClick={() => modalClick(index)}
                                                                >
                                                                    Edit Stock
                                                                </span>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <div className="admWh-stock-pagination">
                                            <div className="admWh-stock-pagination-item">
                                                <button 
                                                    className="admWh-stock-prev-btn" 
                                                    disabled={page === 1} 
                                                    onClick={prevPage}
                                                >
                                                    {page === 1 ? <img src={paginationPrevArrowInactive} alt="Pagination-Prev-Arrow" /> : <img src={paginationPrevArrow} alt="Pagination-Prev-Arrow" />}
                                                </button>
                                                {renderPageRange()}
                                                <button 
                                                    className="admWh-stock-next-btn" 
                                                    disabled={page === pageCountTotal || !products.length} 
                                                    onClick={nextPage}
                                                >
                                                    {(page === pageCountRange.length || !products.length) ? <img src={paginationNextArrowInactive} alt="Pagination-Next-Arrow" /> : <img src={paginationNextArrow} alt="Pagination-Next-Arrow" />}
                                                </button>
                                            </div>
                                        </div>
                                        {products.map((val, index) => (
                                            <Modal 
                                                open={modalLength[index]} 
                                                close={() => onCloseModal(index)}
                                                key={`edit-prod-#${val.id}-stock`}
                                            >
                                                {editStockModal(val.id, val.name, val.warehouse_stock, warehouse_name, index)}
                                            </Modal>
                                        ))}
                                    </div>
                                </>
                            }  
                        </>
                        :
                        <AdminSkeletonSimple />            
                    }
                </div>
                :
                <NotFoundPage />
            }
        </>
    )
}

export default ManageStock;