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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import Modal from '../../components/Modal';
import Textbox from "../../components/Textbox";
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";
import { useSelector } from "react-redux";
import { successToast, errorToast } from "../../redux/actions/ToastAction";
import AdminSkeletonSimple from "../../components/admin/AdminSkeletonSimple";
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";

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

function ManageProduct() {
    const [loadData, setLoadData] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [products, setProducts] = useState([]);
    
    const [dropdownLength, setDropdownLength] = useState([]); //* Utk atur relation dropdown per produk, sehingga action edit & delete unique identik dgn msg2 produk

    const [modalLength, setModalLength] = useState([]); //* Utk atur relation delete modal per produk, sehingga delete unique identik dgn msg2 produk
    
    const [passToggle, setPassToggle] = useState(false); //* Utk atur showPass pada confirm delete produk
    
    const [showPass, setShowPass] = useState("password"); //* Utk rubah input type pada modal delete produk
    
    const [passForDel, setPassForDel] = useState(""); //* Utk kirim pass ke BE melakukan validasi confirm delete

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
    const getUsername = useSelector(state => state.auth.username); // Utk kirim username ke BE klo delete produk

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
    }, [products])

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
        setLoadData(true);
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
                    <button onClick={() => onCloseModal(index)}>Cancel</button>
                    <button onClick={() => onConfirmDelProd(prodId, index)} disabled={!passForDel}>Confirm</button>
                </div>
            </>
        )
    };

    const onConfirmDelProd = async (prodId, index) => {
        let inputtedPass = passForDel;
        document.querySelector("div.del-modal-foot-wrap > button").disabled = true;

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
            } else if (res.data.validationMessage) { //* Case salah input password
                errorToast(res.data.validationMessage);
                document.querySelector("div.del-modal-foot-wrap > button").disabled = false;
            } else {
                errorToast(res.data.failMessage); //* Case product id tidak ditemukan
                document.querySelector("div.del-modal-foot-wrap > button").disabled = false;
            };
        } catch (error) {
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

    //! PER WAREHOUSE MODAL SECTION (Belum dipake)
    // const [addProdModal, setAddProdModal] = useState(false);

    // const addProdToggle = () => setAddProdModal(!addProdModal);
    
    // const showWhModal = AdminWhStockModal();

    // const showWhStock = () => {
    //     ("Click detected");
    //     return <AdminWhStockModal addProdModal={addProdModal} addProdToggle={addProdToggle} />
    // }
    //! -----------------------------------------

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
                                        <TableBody>
                                            {products
                                            .map((val, index) => (
                                                <StyledTableRow key={val.SKU}>
                                                    <StyledTableCell align="center" component="th" scope="row">
                                                        <img 
                                                            src={`${API_URL}/${val.images[0]}`} 
                                                            style={{height: "100px", width: "100px"}} 
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
                                                        <span style={{cursor: "pointer"}}>
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
                                    </Table>
                                </TableContainer>
                                <div className="adm-products-pagination">
                                    <div className="adm-products-pagination-item">
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
                                    </div>
                                </div>
                                {products.map((val, index) => (
                                    <Modal 
                                        open={modalLength[index]} 
                                        close={() => onCloseModal(index)}
                                        key={`del-prod-#${val.id}-modal`}
                                    >
                                        {delModalContent(val.id, val.SKU, val.name, index)}
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
    )
}

export default ManageProduct;