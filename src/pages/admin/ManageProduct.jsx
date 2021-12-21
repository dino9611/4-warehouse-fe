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
import Modal from '../../components/Modal';
import Textbox from "../../components/Textbox";
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";
import { useSelector } from "react-redux";
import { successToast, errorToast } from "../../redux/actions/ToastAction";

function ManageProduct() {
    const [products, setProducts] = useState([]);
    
    const [dropdownLength, setDropdownLength] = useState([]); // Utk atur relation dropdown per produk, sehingga action edit & delete unique identik dgn msg2 produk

    const [modalLength, setModalLength] = useState([]); // Utk atur relation delete modal per produk, sehingga delete unique identik dgn msg2 produk
    
    const [passToggle, setPassToggle] = useState(false); // Utk atur showPass pada confirm delete produk
    
    const [showPass, setShowPass] = useState("password"); // Utk rubah input type pada modal delete produk
    
    const [passForDel, setPassForDel] = useState(""); // Utk kirim pass ke BE melakukan validasi confirm delete

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
    const getUsername = useSelector(state => state.auth.username); // Utk kirim username ke BE klo delete produk

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
    }, [page, itemPerPage]);

    useEffect(() => { // Utk create array yg identik dengan masing2 dropdown action menu & modal per produk
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
    const rowsPerPageOptions = [5, 10, 50];

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

    // SELECT PAGE FUNCTION SECTION
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
        let newArr = dropdownLength.map(() => { // Clickaway action dropdown menu/menutup kembali dropdown bila klik diluar dropdown
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
                    />
                    <img 
                        src={(showPass === "password") ? ShowPassFalse : ShowPassTrue} 
                        alt="Show-Pass-Icon" 
                        onClick={showPassHandler} 
                    />
                </div>
                <div className="del-modal-foot-wrap">
                    <button onClick={() => onConfirmDelProd(prodId, index)} disabled={!passForDel}>Confirm</button>
                    <button onClick={() => onCloseModal(index)}>Cancel</button>
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
            } else if (res.data.validationMessage) { // Case salah input password
                errorToast(res.data.validationMessage);
                document.querySelector("div.del-modal-foot-wrap > button").disabled = false;
            } else {
                errorToast(res.data.failMessage); // Case product id tidak ditemukan
                document.querySelector("div.del-modal-foot-wrap > button").disabled = false;
            };
        } catch (error) {
            errorToast("Server Error, from ManageProduct");
            console.log(error);
        }
    };

    return (
        <div className="adm-products-main-wrap">
            <div className="adm-products-header-wrap">
                <h4>Manage Product</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="adm-products-contents-wrap">
                <TableContainer component={Paper} style={{borderRadius: "12px"}}>
                    <div className="adm-products-add-wrap">
                        <Link to="/admin/manage-product/add">
                            <button>+ Add Products</button>
                        </Link>
                    </div>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Image</TableCell>
                                <TableCell align="left">Product ID</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Category</TableCell>
                                <TableCell align="left">Price</TableCell>
                                <TableCell align="left">Stock</TableCell>
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
                                    <TableCell align="left" className="txt-capitalize">{val.name}</TableCell>
                                    <TableCell align="left" className="txt-capitalize">{val.category}</TableCell>
                                    <TableCell align="left">{`Rp ${thousandSeparator(val.price)}`}</TableCell>
                                    <TableCell align="left">
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
                                            <li>
                                                <img src={editIcon} />
                                                <Link 
                                                    to={{
                                                        pathname: "/admin/manage-product/edit",
                                                        state: val
                                                    }}
                                                    className="link-no-decoration"
                                                >
                                                    Edit
                                                </Link>
                                            </li>
                                            <li 
                                                onClick={() => modalClick(index)}
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
                {products.map((val, index) => (
                    <Modal open={modalLength[index]} close={() => onCloseModal(index)}>
                        {delModalContent(val.id, val.SKU, val.name, index)}
                    </Modal>
                ))}
            </div>
        </div>
    )
}

export default ManageProduct;