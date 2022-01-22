import React, { useEffect, useState } from 'react';
import "./styles/ManageProduct.css";
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
import {API_URL} from "../../constants/api";
import paginationPrevArrow from "../../assets/components/Pagination-Prev-Bg-White.svg";
import paginationNextArrow from "../../assets/components/Pagination-Next-Bg-White.svg";
import paginationPrevArrowInactive from "../../assets/components/Pagination-Prev-Bg-Gray.svg";
import paginationNextArrowInactive from "../../assets/components/Pagination-Next-Bg-Gray.svg";
import firstPageArrowActive from "../../assets/components/First-Page.svg";
import firstPageArrowInactive from "../../assets/components/First-Page-Gray.svg";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import Modal from '../../components/Modal';
import Textbox from "../../components/admin/AdmTextbox";
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";
import { useSelector } from "react-redux";
import { successToast, errorToast } from "../../redux/actions/ToastAction";
import AdminSkeletonSimple from "../../components/admin/AdminSkeletonSimple";
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";
import AdminLoadSpinner from '../../components/admin/AdminLoadSpinner';
import CircularProgress from '@mui/material/CircularProgress';
import AdmBtnSecondary from "../../components/admin/AdmBtnSecondary"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      border: 0,
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
      fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        border: 0,
        color: "#5A5A5A",
        fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#F4F4F4",
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    },
    // Show last border
    '&:last-child td, &:last-child th': {
      borderBottom: "1px solid #CACACA"
    },
}));

function ManageProduct() {
    const [loadData, setLoadData] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [loadTable, setLoadTable] = useState(true); //* State kondisi utk masking tampilan client saat loading table stlh select page pagination

    const [submitLoad, setSubmitLoad] = useState(false); //* State kondisi loading ketika submit button ter-trigger, hingga proses selesai

    const [stockModalLoad, setStockModalLoad] = useState(true); //* State kondisi loading ketika modal stock breakdown terbuka & fetch data, hingga proses selesai

    const [products, setProducts] = useState([]);
    
    const [dropdownLength, setDropdownLength] = useState([]); //* Utk atur relation dropdown per produk, sehingga action edit & delete unique identik dgn msg2 produk

    const [modalLength, setModalLength] = useState([]); //* Utk atur relation delete modal per produk, sehingga delete unique identik dgn msg2 produk

    const [stockModalLen, setStockModalLen] = useState([]); //* Utk atur relation stock modal per produk, sehingga unique identik dgn msg2 produk

    const [stockModalActive, setStockModalActive] = useState(false); //* Utk jadi depedency useEffect stock modal

    const [stockModalProdId, setStockModalProdId] = useState(""); //* Utk simpen product id mana yg di-get ketika stock modal terbuka

    const [stockBreakdown, setStockBreakdown] = useState([]); //* Utk simpan data stock modal per warehouse
    
    const [passToggle, setPassToggle] = useState(false); //* Utk atur showPass pada confirm delete produk
    
    const [showPass, setShowPass] = useState("password"); //* Utk rubah input type pada modal delete produk
    
    const [passForDel, setPassForDel] = useState(""); //* Utk kirim pass ke BE melakukan validasi confirm delete

    // PAGINATION SECTION
    const [page, setPage] = useState(1);

    const [toggleDropdown, setToggleDropdown] = useState(false); //* Atur toggle dropdown filter product per page

    const [itemPerPage, setItemPerPage] = useState(10);

    const [prodLength, setProdLength] = useState(0);

    const [slicedProducts, setSlicedProducts] = useState([]); //* Utk render tampilan data item keberapa sampai keberapa dari total seluruh data

    let productsRange = Array(prodLength).fill(null).map((val, index) => index + 1); //* Utk bikin array berisi angka urut dari total data produk

    let pageCountTotal = Math.ceil(prodLength / itemPerPage); //* Itung total jumlah page yg tersedia

    let pageCountRange = Array(pageCountTotal).fill(null).map((val, index) => index + 1); // Itung range page yang bisa di-klik
    
    let showMaxRange = 5; //* Tentuin default max range yg tampil/di-render berapa buah

    // FILTER ITEM PER PAGE SECTION
    const rowsPerPageOptions = [10, 50];

    // FETCH & useEFFECT SECTION
    const getUsername = useSelector(state => state.auth.username); //* Utk kirim username ke BE klo delete produk

    const getRoleId = useSelector((state) => state.auth.role_id);

    const fetchProdData = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/product/pagination?page=${page - 1}&limit=${itemPerPage}`);
            setProducts(res.data);
            setProdLength(parseInt(res.headers["x-total-count"]));
        } catch (error) {
            errorToast("Server Error, from ManageProduct");
            console.log(error);
            setErrorFetch(true);
        };
    };

    const fetchStockBreakdown = async () => { //* Utk get data stock per warehouse saat modal stock terbuka
        try {
            const res = await axios.get(`${API_URL}/admin/stock-breakdown/${stockModalProdId}`);
            setStockBreakdown(res.data);
            setStockModalLoad(false);
        } catch(error) {
            errorToast("Gagal")
            console.log(error)
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
            await setLoadTable(false);
            await setLoadData(false);
        };
        fetchData();
    }, [page, itemPerPage]);

    useEffect(() => { //* Utk sumber array showing n - n data of total N data (ex: 1-5 of 25)
        productsRangeSlice();
    }, [prodLength, page, itemPerPage]);

    useEffect(() => { //* Utk create array yg identik dengan masing2 dropdown action menu & modal per produk
        let dropdownArr = [];
        for (let i = 0; i < products.length; i++) {
            dropdownArr[i] = false;
        };
        setDropdownLength([...dropdownArr]);
        let modalArr = [];
        for (let i = 0; i < products.length; i++) {
            modalArr[i] = false;
        };
        setModalLength([...modalArr]);

        let stockArr = []; //* Khusus utk modal national stock breakdown by warehouse
        for (let i = 0; i < products.length; i++) {
            stockArr[i] = false;
        };
        setStockModalLen([...stockArr]);
    }, [products]);

    useEffect(() => {
        if (stockModalActive) {
            fetchStockBreakdown();
        }
    }, [stockModalActive]);

    const breadcrumbs = [
        <Link to="/admin/" key="1" className="link-no-decoration adm-breadcrumb-modifier">
          Dashboard
        </Link>,
        <Typography key="2" color="#070707" style={{fontSize: "0.75rem", margin: "auto"}}>
          {getRoleId === 2 ? "Product List" : "Manage Products"}
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
        setLoadTable(true);
        setLoadData(true);
    };

    // RENDER MODAL NATIONAL STOCK BREAKDOWN BY WAREHOUSE
    const stockModalClick = (index, prodId) => { //* Buka stock modal
        if (!modalLength[index]) {
            setStockModalLen((prevState) => {
                let newArray = prevState;
                newArray[index] = true;
                return [...newArray];
            });
        } else {
            setStockModalLen((prevState) => {
                let newArray = prevState;
                newArray[index] = false;
                return [...newArray];
            });
        };
        setStockModalProdId(prodId); //* Untuk nentuin product id mana yg di-get ke BE
        setStockModalActive(true); //* Untuk dependency useEffect fetchStockBreakdown
    };

    const onCloseStockModal = (index) => { //* Tutup stock modal
        setStockModalLen((prevState) => {
            let newArray = prevState;
            newArray[index] = false;
            return [...newArray];
        });
        setStockBreakdown([]);
        setStockModalProdId(""); //* Untuk clear product id yg telah di-get ke BE
        setStockModalActive(false); //* Untuk dependency useEffect fetchStockBreakdown
        setStockModalLoad(true); //* Untuk make sure buka modal lain, load spinner nya ulang lg
    };

    const stockModalContent = (prodName, total_stock, index) => {
        return (
            <>
                <div className="stockBreakdown-modal-heading-wrap">
                    <h4>{`${prodName} - Stock Breakdown`}</h4>
                </div>
                {!stockModalLoad ?
                    <>
                        <div className="stockBreakdown-modal-body-wrap">
                            <TableContainer>
                                <Table aria-label="stock breakdown table">
                                    <TableHead>
                                        <TableRow style={{backgroundColor: "#FCB537"}}>
                                            <StyledTableCell align="left">Warehouse</StyledTableCell>
                                            <StyledTableCell align="left">Stock</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {stockBreakdown.map((val) => (
                                            <StyledTableRow key={val.id}>
                                                <StyledTableCell align="left" component="th" scope="row">{val.name}</StyledTableCell>
                                                <StyledTableCell align="left">{val.total_stock}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        <StyledTableRow>
                                            <StyledTableCell align="left" style={{fontWeight: 600}}>Grand Total</StyledTableCell>
                                            <StyledTableCell align="left" style={{fontWeight: 600}}>{total_stock}</StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        <div className="stockBreakdown-modal-foot-wrap">
                            <AdmBtnSecondary onClick={() => onCloseStockModal(index)} width={"80px"}>Back</AdmBtnSecondary>
                        </div>
                    </>
                    :
                    <AdminLoadSpinner />
                }
            </>
        )
    };

    // RENDER DROPDOWN ACTION MENU
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
        };
    };

    const dropdownBlur = () => {
        let newArr = dropdownLength.map(() => { //* Clickaway action dropdown menu/menutup kembali dropdown bila klik diluar dropdown
            return false;
        })
        setDropdownLength([...newArr]);
    };

    // RENDER MODAL DELETE PRODUCT
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
        setPassForDel("");
        setShowPass("password");
    };

    const passForDelHandler = (event) => setPassForDel(event.target.value);

    const showPassHandler = () => {
        setPassToggle(!passToggle);
        if (passToggle) {
          setShowPass("text");
        } else {
          setShowPass("password");
        };
    };

    const charMax = 70;
    
    const delModalContent = (prodId, SKU, prodName, index) => {
        return (
            <>
                <div className="del-modal-heading-wrap">
                    <h3>{`Are you sure delete ${prodName} ?`}</h3>
                    <h6>{`[ ID: ${prodId} | SKU: ${SKU} ]`}</h6>
                </div>
                <div className="del-modal-body-wrap">
                    <Textbox
                        type={showPass}
                        label="Input Password to confirm delete"
                        name="passForDel"
                        value={passForDel}
                        onChange={(event) => passForDelHandler(event)}
                        placeholder="Your password"
                        maxLength={charMax}
                    />
                    <img 
                        src={(showPass === "password") ? ShowPassFalse : ShowPassTrue} 
                        alt="Show-Pass-Icon" 
                        onClick={showPassHandler} 
                    />
                </div>
                <div className="del-modal-foot-wrap">
                    <button onClick={() => onCloseModal(index)} disabled={submitLoad}>Cancel</button>
                    <button 
                        onClick={() => onConfirmDelProd(prodId, index)} 
                        disabled={!passForDel || submitLoad}
                    >
                        {submitLoad ? <CircularProgress style={{padding: "0.25rem"}}/> : "Confirm"}
                    </button>
                </div>
            </>
        )
    };

    const onConfirmDelProd = async (prodId, index) => {
        let inputtedPass = passForDel;
        setSubmitLoad(true);

        try {
            const res = await axios.delete(`${API_URL}/product/delete/${prodId}`, {headers: {username: getUsername, pass: inputtedPass}});
            if (res.data.message && !res.data.failMessage) {
                setModalLength((prevState) => {
                    let newArray = prevState;
                    newArray[index] = false;
                    return [...newArray];
                });
                setPassForDel("");
                setShowPass("password");
                successToast(res.data.message);
                fetchProdData();
                if (products.length === 1) { //* Klo list produk hanya 1 pada tabel kemudian delete, akan redirect ke page pagination terakhir
                    setPage(pageCountRange.length - 1);
                };
            } else if (res.data.validationMessage) { //* Case salah input password
                setSubmitLoad(false);
                errorToast(res.data.validationMessage);

            } else {
                setSubmitLoad(false);
                errorToast(res.data.failMessage); //* Case product id tidak ditemukan

            };
        } catch (error) {
            setSubmitLoad(false);
            errorToast("Server Error, from ManageProduct");
            console.log(error);
        }
    };

    // RENDER PAGE RANGE SECTION
    const renderPageRange = () => { //* Utk render button select page pagination
        const disabledBtn = (value, index) => { //* Button page pagination yg saat ini aktif
            return (
                <button 
                    className="adm-products-pagination-btn" 
                    value={value} onClick={(event) => selectPage(event)} 
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
                    className="adm-products-pagination-btn" 
                    value={value} 
                    onClick={(event) => selectPage(event)}
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

            if (page < 5) {
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
        setLoadTable(true);
    };
    
    const prevPage = () => { //* Ganti value page ketika klik previous arrow pagination
        if (page <= 0) {
            return
        } else {
            setPage(page - 1);
            setLoadTable(true);
        }
    };

    const nextPage = () => {
        if (page >= pageCountTotal) { //* Ganti value page ketika klik next arrow pagination
            return
        } else {
            setPage(page + 1);
            setLoadTable(true);
        }
    };

    const toFirstPage = () => { //* Pilih page paling pertama
        setPage(1);
        setLoadTable(true);
    };

    const toLastPage = () => { //* Pilih page paling terakhir
        setPage(pageCountRange.length);
        setLoadTable(true);
    };

    return (
        <div className="adm-products-main-wrap">
            {!loadData ?
                <>
                    <div className="adm-products-breadcrumb-wrap">
                        <Stack spacing={2}>
                            <Breadcrumbs
                                separator={<NavigateNextIcon fontSize="small" />}
                                aria-label="manage product breadcrumb"
                            >
                                {breadcrumbs}
                            </Breadcrumbs>
                        </Stack>
                    </div>
                    { (!loadData && errorFetch) ?
                        <AdminFetchFailed />
                        :
                        <>
                            <div className="adm-products-header-wrap">
                                {(getRoleId === 2) ? <h4>Nationwide Product List & Stock</h4> : <h4>Manage Products</h4>}
                                {(getRoleId === 1) ?
                                    <Link to="/admin/manage-product/add">
                                        <button>+ Add Products</button>
                                    </Link>
                                    :
                                    null
                                } 
                            </div>
                            <div className="adm-products-contents-wrap">
                                <TableContainer component={Paper} className="adm-product-table-override">
                                    <div className="adm-products-filter">
                                        <div className="adm-products-filter-item">
                                            {slicedProducts.length ?
                                                <p>Showing {slicedProducts[0]} - {slicedProducts.slice(-1)} of {prodLength} products</p>
                                                :
                                                <p>Showing 0 of {prodLength} products</p>
                                            }
                                        </div>
                                        <div className="adm-products-filter-item">
                                            <p>Product per Page:</p>
                                            <div className="adm-products-filter-dropdown-wrap">
                                                <button 
                                                    className="adm-products-filter-dropdown-btn" 
                                                    onClick={filterDropdownClick}
                                                    onBlur={filterDropdownBlur}
                                                >
                                                    {itemPerPage}
                                                    <img 
                                                        src={chevronDown} 
                                                        style={{
                                                            transform: toggleDropdown ? "rotate(-180deg)" : "rotate(0deg)"
                                                        }}
                                                        alt="Dropdown-Arrow"
                                                    />
                                                </button>
                                                <ul 
                                                    className="adm-products-filter-dropdown-menu" 
                                                    style={{
                                                        transform: toggleDropdown ? "translateY(0)" : "translateY(-5px)",
                                                        opacity: toggleDropdown ? 1 : 0,
                                                        zIndex: toggleDropdown ? 100 : -10,
                                                    }}
                                                >
                                                    {rowsPerPageOptions.map((val, index) => (
                                                        val === itemPerPage ? 
                                                        <li className="adm-products-filter-dropdown-selected" key={index}>{val}</li> 
                                                        : 
                                                        <li onClick={() => filterItemPerPage(val)} key={index}>{val}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <Table sx={{ minWidth: 650 }} aria-label="manage products table">
                                        <TableHead>
                                            <TableRow style={{backgroundColor: "#FCB537"}}>
                                                <StyledTableCell align="center">Image</StyledTableCell>
                                                <StyledTableCell align="left">Product ID</StyledTableCell>
                                                <StyledTableCell align="left">Name</StyledTableCell>
                                                <StyledTableCell align="left">Category</StyledTableCell>
                                                <StyledTableCell align="left">Price</StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {getRoleId === 1 ? "Stock" : "Nationwide Stock"}
                                                </StyledTableCell>
                                                {getRoleId === 1 ?
                                                    <StyledTableCell align="center" style={{width: "176px"}}>Action</StyledTableCell>
                                                    :
                                                    null
                                                }
                                            </TableRow>
                                        </TableHead>
                                        {!loadTable ?
                                            <TableBody>
                                                {products
                                                .map((val, index) => (
                                                    <StyledTableRow key={val.SKU}>
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
                                                        <StyledTableCell align="left">{`Rp ${thousandSeparator(val.price)}`}</StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            <span 
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "#B24629",
                                                                    fontWeight: 600
                                                                }} 
                                                                onClick={() => stockModalClick(index, val.id)}
                                                            >
                                                                {val.total_stock}
                                                            </span>
                                                        </StyledTableCell>
                                                        {getRoleId === 1 ?
                                                            <StyledTableCell align="center" className="adm-products-action-cell">
                                                                <button 
                                                                    className="adm-products-dropdown-btn" 
                                                                    onClick={() => dropdownClick(index)}
                                                                    onBlur={() => dropdownBlur(index)}
                                                                >
                                                                    Options
                                                                    <img 
                                                                        src={chevronDown} 
                                                                        style={{
                                                                            transform: dropdownLength[index] ? "rotate(-180deg)" : "rotate(0deg)"
                                                                        }}
                                                                        alt="Dropdown-Arrow"
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
                                                                    <Link 
                                                                        to={{
                                                                            pathname: "/admin/manage-product/edit",
                                                                            state: val
                                                                        }}
                                                                        className="link-no-decoration"
                                                                    >
                                                                        <li>
                                                                            <div className="adm-edit-icon" />
                                                                            Edit
                                                                        </li>
                                                                    </Link>
                                                                    <li 
                                                                        onClick={() => modalClick(index)}
                                                                    >
                                                                        <div className="adm-delete-icon" />
                                                                        Delete
                                                                    </li>
                                                                </ul>
                                                            </StyledTableCell>
                                                            :
                                                            null
                                                        }
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                            :
                                            <StyledTableCell colSpan={7} style={{height: "30rem"}}>
                                                <AdminLoadSpinner />
                                            </StyledTableCell>
                                        }
                                    </Table>
                                </TableContainer>
                                <div className="adm-products-pagination">
                                    <div className="adm-products-pagination-item">
                                        <button 
                                            className="adm-products-firstPage-btn" 
                                            disabled={page === 1} 
                                            onClick={toFirstPage}
                                        >
                                            {page === 1 ? <img src={firstPageArrowInactive} alt="Go-To-First-Page-Arrow" /> : <img src={firstPageArrowActive} alt="Go-To-First-Page-Arrow" />}
                                        </button>
                                        <button 
                                            className="adm-products-prev-btn" 
                                            disabled={page === 1} 
                                            onClick={prevPage}
                                        >
                                            {page === 1 ? <img src={paginationPrevArrowInactive} alt="Pagination-Prev-Arrow" /> : <img src={paginationPrevArrow} alt="Pagination-Prev-Arrow" />}
                                        </button>
                                        {renderPageRange()}
                                        <button 
                                            className="adm-products-next-btn" 
                                            disabled={page === pageCountTotal || !products.length} 
                                            onClick={nextPage}
                                        >
                                            {(page === pageCountRange.length || !products.length) ? <img src={paginationNextArrowInactive} alt="Pagination-Next-Arrow" /> : <img src={paginationNextArrow} alt="Pagination-Next-Arrow" />}
                                        </button>
                                        <button 
                                            className="adm-products-lastPage-btn" 
                                            disabled={page === pageCountRange.length} 
                                            onClick={toLastPage}
                                        >
                                            {page === pageCountRange.length ? <img src={firstPageArrowInactive} alt="Go-To-Last-Page-Arrow" style={{transform: "rotate(180deg)"}}/> : <img src={firstPageArrowActive} alt="Go-To-Last-Page-Arrow" style={{transform: "rotate(180deg)"}}/>}
                                        </button>
                                    </div>
                                </div>
                                {products.map((val, index) => (
                                    <>
                                        <Modal 
                                            open={modalLength[index]} 
                                            close={() => onCloseModal(index)}
                                            key={`del-prod-#${val.id}-modal`}
                                        >
                                            {delModalContent(val.id, val.SKU, val.name, index)}
                                        </Modal>
                                        <Modal 
                                            open={stockModalLen[index]} 
                                            close={() => onCloseStockModal(index)}
                                            key={`stock-prod-#${val.id}-modal`}
                                        >
                                            {stockModalContent(val.name, val.total_stock, index)}
                                        </Modal>
                                    </>
                                ))}
                            </div>
                        </>
                    }  
                </>
                :
                <AdminSkeletonSimple />            
            }
        </div>
    )
}

export default ManageProduct;