import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./styles/AddProduct.css";
import {API_URL} from "../../constants/api";
import {Link, useHistory} from "react-router-dom";
import deleteTrash from "../../assets/components/Delete-Trash.svg";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import { useSelector } from "react-redux";
import NotFoundPage from "../non-user/NotFoundV1";
import AdminSkeletonModerate from '../../components/admin/AdminSkeletonModerate';
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";
import { errorToast } from "../../redux/actions/ToastAction";
import AdmBtnPrimary from '../../components/admin/AdmBtnPrimary';
import AdmBtnSecondary from "../../components/admin/AdmBtnSecondary";

function AdminAddProduct() {
    const [skeletonLoad, setSkeletonLoad] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [category, setCategory] = useState([]);

    const [warehouse, setWarehouse] = useState([]);

    const [mainImgCheck, setMainImgCheck] = useState(false); //* Utk validasi foto utama produk sudah di-input oleh admin

    const [prodNameCounter, setProdNameCounter] = useState(0); //* Utk check characters left input nama produk

    const [charCounter, setCharCounter] = useState(0); //* Utk check characters left input deskripsi produk

    const [addImage, setAddImage] = useState([ //* Utk bawa data uploaded image ke BE
        "",
        "",
        ""
    ]);

    const [addProdInput, setAddProdInput] = useState({ //* Utk bawa input data produk ke BE
        prod_name: "",
        prod_category: 0,
        prod_weight: "",
        prod_price: "",
        prod_cost: "",
        prod_desc: ""
    });

    const [toggleDropdown, setToggleDropdown] = useState(false); //* Atur toggle dropdown select product category

    const [selectedCategory, setSelectedCategory] = useState("Choose product category"); //* Sebagai placeholder ketika assign category belum dipilih & sudah dipilih
    
    const [dropdownActiveDetector, setDropdownActiveDetector] = useState(0);

    const prodNameCharMax = 75; //* Max char input nama produk

    const descCharLimit = 2000; //* Max char input deskripsi produk

    let { 
        images, 
        prod_name, 
        prod_category, 
        prod_weight, 
        prod_price, 
        prod_cost, 
        prod_desc 
    } = addProdInput;

    // FETCH & useEFFECT SECTION
    const getRoleId = useSelector((state) => state.auth.role_id);

    let history = useHistory();

    //* Utk kembali ke manage product
    const toManageProduct = () => history.push("/admin/manage-product");

    const fetchCategory = async () => { //* Utk render data kategori produk
        try {
            const res = await axios.get(`${API_URL}/product/category`);
            setCategory(res.data);
        } catch (error) {
            errorToast("Server Error, from AddProduct - Cat");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const fetchWarehouse = async () => { //* Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            res.data.forEach((val) => {
                val.stock = "";
            });
            setWarehouse(res.data);
        } catch (error) {
            errorToast("Server Error, from AddProduct - Wh");
            console.log(error);
            setErrorFetch(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategory();
            await fetchWarehouse();
            await setSkeletonLoad(false);
        };
        fetchData();
    }, []);

    const breadcrumbs = [
        <Link to="/admin/" key="1" className="link-no-decoration adm-breadcrumb-modifier">
          Dashboard
        </Link>,
        <Link to="/admin/manage-product" key="2" className="link-no-decoration adm-breadcrumb-modifier">
          Manage Products
        </Link>,
        <Typography key="3" color="#070707" style={{fontSize: "0.75rem", margin: "auto"}}>
          Add Product
        </Typography>,
    ];

    // HANDLER FUNCTIONS SECTION
    const addProdStringHandler = (event) => { //* Utk setState data berbentuk string
        setAddProdInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const addProdNumberHandler = (event, cb) => { //* Utk setState data berbentuk number
        cb((prevState) => {
            return { ...prevState, [event.target.name]: parseInt(event.target.value) };
        });
    };
    
    const noMinusHandler = (event, cb) => { //* Biar input number tidak negatif (-)
        let input = event.target.value;
        if (input < 0) {
            cb((prevState) => {
                return { ...prevState, [event.target.name]: input * -1 };
            });
        } else if (prod_weight === 0 || prod_price === 0 || prod_cost === 0) {
            cb((prevState) => {
                return { ...prevState, [event.target.name]: ""};
            });
        } else {
            return
        }
    };

    const addStockHandler = (event, index) => { //* Khusus setState data stock
        let input = event.target.value;
        setWarehouse((prevState) => {
            let newArray = prevState;
            newArray[index].stock = parseInt(input);
            return [...newArray];
        });
    };

    const stockNoMinHandler = (event, index) => { //* Biar input number stock tidak negatif (-)
        let input = event.target.value;
        if (input < 0) {
            setWarehouse((prevState) => {
                let newArray = prevState;
                newArray[index].stock = parseInt(input) * -1;
                return [...newArray];
            });
        } else {
            return
        }
    };

    const addImageHandler = (event, indexArr) => { //* Utk setState upload image
        let file = event.target.files[0];
        if (file) {
            setAddImage((prevState) => {
                let newArray = prevState;
                newArray[indexArr] = file;
                if (indexArr === 0) {
                    setMainImgCheck(true);
                }
                return [...newArray];
            });
        } else {
            setAddImage((prevState) => {
                let newArray = prevState;
                newArray[indexArr] = "";
                if (indexArr === 0) {
                    setMainImgCheck(false);
                }
                return [...newArray];
            });
        }
    };

    const delImgUpload = (event, indexArr) => { //* Utk remove image yg sudah di-upload
            setAddImage((prevState) => {
            let newArray = prevState;
            newArray[indexArr] = "";
            if (indexArr === 0) {
                setMainImgCheck(false);
            }
            return [...newArray];
        });
    }

    // CHECKER FUNCTIONS SECTION
    const prodNameCharCounter = (event) => { //* Hitung characters left utk input product name
        return setProdNameCounter(event.target.value.length);
    };

    const charCounterHandler = (event) => { //* Hitung characters left utk product descripption
        return setCharCounter(event.target.value.length);
    };

    const stockTrueChecker = (value) => value.stock + 1 > 0 && typeof(value.stock) === "number";

    // RENDER DROPDOWN FILTER PRODUCT PER PAGE AMOUNT
    const dropdownClick = (event) => { //* Buka tutup menu dropdown
        event.preventDefault();
        setToggleDropdown(!toggleDropdown);
    };

    const dropdownBlur = () => { //* Tutup menu dropdown ketika click diluar wrap menu dropdown
        setToggleDropdown(false)
    };

    const selectCategoryClick = (event, categoryName) => { //* Atur value warehouse yg di-assign & behavior dropdown stlh action terjadi
        setAddProdInput((prevState) => {
            return { ...prevState, prod_category: parseInt(event.target.value) };
        });
        setSelectedCategory(categoryName);
        setDropdownActiveDetector(dropdownActiveDetector + 1);
        setToggleDropdown(false);
        fetchCategory();
    };

    // CLICK FUNCTION SECTION
    const onSubmitAddProd = async (event) => { //* Untuk trigger submit button
        event.preventDefault();
        document.querySelector("div.add-products-submission-wrap > button:last-of-type").disabled = true;
        
        let uploadedImg = addImage;
        let inputtedProd = {
            images: images,
            prod_name: prod_name,
            prod_category: prod_category,
            prod_weight: prod_weight,
            prod_price: prod_price,
            prod_cost: prod_cost,
            prod_desc: prod_desc
        };
        let inputtedStock = warehouse;

        //* Menyiapkan data untuk dikirimkan ke backend & melalui multer (BE) karena ada upload images
        const formData = new FormData();
        for (let i = 0; i < uploadedImg.length; i++) {
            if (uploadedImg[i]) {
                formData.append("images", uploadedImg[i]); //* Key "images" harus sesuai dengan yang di backend & berlaku kebalikannya
            }
        }
        formData.append("dataProduct", JSON.stringify(inputtedProd));
        formData.append("dataStock", JSON.stringify(inputtedStock));
        let config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        //* Kirim data kategori utk menentukan folder kategori image yang di-upload
        try {
            await axios.post(`${API_URL}/product/determine-category`, inputtedProd);
        } catch (err) {
            errorToast("Server Error, from AddProduct - Post cat");
            console.log(err);
            document.querySelector("div.add-products-submission-wrap > button:last-of-type").disabled = false;
        };

        if (prod_name && prod_category && prod_weight && prod_price && prod_cost && prod_desc && (warehouse.every(stockTrueChecker))) {
            try {
                await axios.post(`${API_URL}/product/add`, formData, config);
                setAddImage((prevState) => {
                    let newArray = prevState;
                    newArray.forEach((val, index) => {
                        newArray[index] = "";
                    })
                    return [...newArray];
                });
                setMainImgCheck(false);
                setAddProdInput((prevState) => {
                    return {...prevState, prod_name: "", prod_category: 0, prod_weight: "", prod_price: "", prod_cost: "", prod_desc: ""}
                });
                setWarehouse((prevState) => {
                    let newArray = prevState;
                    newArray.forEach((val, index) => {
                        newArray[index].stock = "";
                    })
                    return [...newArray];
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Add product success!',
                    text: `${inputtedProd.prod_name}`,
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue',
                    confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
                });
                document.querySelector("div.add-products-submission-wrap > button:last-of-type").disabled = false;
            } catch (err) {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue',
                    confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
                });
                document.querySelector("div.add-products-submission-wrap > button:last-of-type").disabled = false;
            };
        } else {
            errorToast("Please make sure all inputs filled");
            document.querySelector("div.add-products-submission-wrap > button:last-of-type").disabled = false;
        };
    };
    
    return (
        <>
            {(getRoleId === 1) ?
                <div className="add-products-main-wrap">
                    {!skeletonLoad ?
                        <>
                            <div className="add-products-breadcrumb-wrap">
                                <Stack spacing={2}>
                                    <Breadcrumbs
                                        separator={<NavigateNextIcon fontSize="small" />}
                                        aria-label="add product breadcrumb"
                                    >
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>
                            </div>
                            { (!skeletonLoad && errorFetch) ?
                                <AdminFetchFailed />
                                :
                                <>
                                    <div className="add-products-header-wrap">
                                        <h4>Add New Product</h4>
                                    </div>
                                    <div className="add-products-contents-wrap">
                                        <div className="add-images-form-wrap"> {/* Bagian upload image produk */}
                                            <div className="add-images-left-wrap"> {/* Bagian kiri upload image produk */}
                                                <h6>Upload Image</h6>
                                                <p>Eligible file formats are jpg, jpeg, or PNG. Max file size 2.5 MB. </p>
                                                <p>Max upload 3 images. Main image is required for each product.</p>
                                            </div>
                                            <div className="add-images-right-wrap"> {/* Bagian kanan upload image produk */}
                                                {addImage.map((val, index) => {
                                                    return (
                                                        <div className="add-images-tile-wrap">
                                                            <label 
                                                                htmlFor={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                                className={addImage[index] ? "add-images-upload-preview" : "add-images-upload-item"}
                                                            >
                                                                <input 
                                                                    type="file" 
                                                                    id={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                                    name={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                                    accept=".jpg,.jpeg,.png"
                                                                    onChange={(event) => addImageHandler(event, index)} 
                                                                    disabled={addImage[index]}
                                                                />
                                                                {addImage[index] ?
                                                                    <>
                                                                        <img 
                                                                            src={URL.createObjectURL(addImage[index])} 
                                                                            alt={(index === 0) ? "Preview-Main-Image" : (index === 1) ? "Preview-Secondary-Image" : "Preview-Third-Image"}
                                                                            className="add-images-preview"
                                                                        />
                                                                    </>
                                                                    :
                                                                    <p>{(index === 0) ? "Main Image" : (index === 1) ? "Second Image" : "Third Image"}</p>
                                                                }
                                                            </label>
                                                            {addImage[index] ?
                                                                <span 
                                                                    className="add-images-del-icon"
                                                                    onClick={(event) => delImgUpload(event, index)}
                                                                >
                                                                    <img src={deleteTrash} />
                                                                </span>
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div> {/* ------ End of bagian upload image produk ------ */}
                                        <form id="add-prod-form" className="add-info-form-wrap"> {/* Bagian input informasi produk */}
                                            <div className="add-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="add-info-form-left"> {/* Bagian kiri input nama produk */}
                                                    <label htmlFor="prod_name">Product Name</label>
                                                    <p>Fill in the product name which includes brand, information such as weight, material, origin, etc.</p>
                                                </div>
                                                <div className="add-info-form-right"> {/* Bagian kanan input nama produk */}
                                                    <div className="add-info-right-name-input">
                                                        <input 
                                                            type="text" 
                                                            id="prod_name" 
                                                            name="prod_name" 
                                                            value={prod_name}
                                                            onChange={(event) => addProdStringHandler(event)}
                                                            onKeyUp={(event) => prodNameCharCounter(event)}
                                                            placeholder="Ex: Javara Coconut Sugar 250gr"
                                                            maxLength={prodNameCharMax}
                                                        />
                                                        <span>{prodNameCounter}/{prodNameCharMax}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="add-info-form-left"> {/* Bagian kiri input kategori produk */}
                                                    <label htmlFor="prod_category">Category</label>
                                                </div>
                                                <div className="add-info-form-right"> {/* Bagian kanan input kategori produk */}
                                                    <div className="add-info-right-category-dropdown">
                                                        <button 
                                                            className="info-right-category-dropdown-btn" 
                                                            style={{color: dropdownActiveDetector? "#070707" : "#CACACA"}}
                                                            onClick={(event) => dropdownClick(event)}
                                                            onBlur={dropdownBlur}
                                                        >
                                                            {selectedCategory}
                                                            <img 
                                                                src={chevronDown} 
                                                                style={{
                                                                    transform: toggleDropdown ? "rotate(-180deg)" : "rotate(0deg)"
                                                                }}
                                                            />
                                                        </button>
                                                        <ul 
                                                            className="info-right-category-dropdown-menu" 
                                                            style={{
                                                                transform: toggleDropdown ? "translateY(0)" : "translateY(-5px)",
                                                                opacity: toggleDropdown ? 1 : 0,
                                                                zIndex: toggleDropdown ? 100 : -10,
                                                            }}
                                                        >
                                                            {category.map((val) => (
                                                                val.id === addProdInput.prod_category ? 
                                                                <li className="info-right-category-dropdown-selected">{val.category}</li> 
                                                                : 
                                                                <li
                                                                    value={val.id}
                                                                    onClick={(event) => selectCategoryClick(event, val.category)}
                                                                >
                                                                    {val.category}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="add-info-form-left"> {/* Bagian kiri input berat produk */}
                                                    <label htmlFor="prod_weight">Product Weight</label>
                                                    <p>Pay attention, product weight will affect courier shipping fee</p>
                                                </div>
                                                <div className="add-info-form-right"> {/* Bagian kanan input berat produk */}
                                                    <div className="add-info-right-weight-input">
                                                        <input 
                                                            type="number" 
                                                            id="prod_weight" 
                                                            name="prod_weight" 
                                                            value={prod_weight}
                                                            onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                                            onKeyUp={(event) => noMinusHandler(event, setAddProdInput)}
                                                            onWheel={(event) => event.target.blur()}
                                                            placeholder="Product base weight + packaging"
                                                            min="1"
                                                        />
                                                        <span>gram (g)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="add-info-form-left"> {/* Bagian kiri input harga produk */}
                                                    <label htmlFor="prod_price">Product Price / Pcs</label>
                                                </div>
                                                <div className="add-info-form-right"> {/* Bagian kanan input harga produk */}
                                                    <div className="add-info-right-numeric-input">
                                                        <input 
                                                            type="number" 
                                                            id="prod_price" 
                                                            name="prod_price" 
                                                            value={prod_price}
                                                            onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                                            onKeyUp={(event) => noMinusHandler(event, setAddProdInput)}
                                                            onWheel={(event) => event.target.blur()}
                                                            placeholder="Input price (minimum: 1)"
                                                            min="1"
                                                        />
                                                        <span>Rp</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="add-info-form-left"> {/* Bagian kiri input biaya/COGS produk */}
                                                    <label htmlFor="prod_cost">Product Cost / Pcs</label>
                                                </div>
                                                <div className="add-info-form-right"> {/* Bagian kanan input biaya/COGS produk */}
                                                    <div className="add-info-right-numeric-input">
                                                        <input 
                                                            type="number" 
                                                            id="prod_cost" 
                                                            name="prod_cost" 
                                                            value={prod_cost}
                                                            onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                                            onKeyUp={(event) => noMinusHandler(event, setAddProdInput)}
                                                            onWheel={(event) => event.target.blur()}
                                                            placeholder="Product COGS (minimum: 1)"
                                                            min="1"
                                                        />
                                                        <span>Rp</span>
                                                    </div>
                                                </div>
                                            </div>
                                                {warehouse.map((val, index) => (
                                                    <div className="add-info-form-item" key={`Gudang-${val.id}`}> {/* Wrapper individu row input */}
                                                        <div className="add-info-form-left"> {/* Bagian kiri input stok per gudang */}
                                                            <label htmlFor={`stock_0${val.id}`}>Stock {val.name}</label>
                                                            <p>Only super admin can fill</p>
                                                        </div>
                                                        <div className="add-info-form-right"> {/* Bagian kanan input stok per gudang */}
                                                            <div className="add-info-right-numeric-input">
                                                                <input 
                                                                    type="number" 
                                                                    className="add-stock-input-wrap"
                                                                    id={`stock_0${val.id}`}
                                                                    name={`stock_0${val.id}`}
                                                                    value={val.stock}
                                                                    onChange={(event) => addStockHandler(event, index)}
                                                                    onKeyUp={(event) => stockNoMinHandler(event, index)}
                                                                    onWheel={(event) => event.target.blur()}
                                                                    placeholder="Input stock (minimum: 0)"
                                                                    min="0"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </form> {/* ------ End of bagian input informasi produk ------ */}
                                        <div className="add-desc-form-wrap"> {/* Bagian input deskripsi produk */}
                                            <div className="add-desc-form-item"> {/* Wrapper individu row input deskripsi */}
                                                <div className="add-desc-form-left"> {/* Bagian kiri input deskripisi produk */}
                                                    <label htmlFor="prod_desc">Product Description</label>
                                                    <p>Make sure the product description includes specifications, sizes, materials, expiration dates, and more. The more detailed, the more useful and easy to understand for buyers.</p>
                                                </div>
                                                <div className="add-desc-form-right"> {/* Bagian kanan input deskripisi produk */}
                                                    <div className="add-info-right-desc-input">
                                                        <textarea 
                                                            type="text" 
                                                            rows="8"
                                                            cols="100"
                                                            name="prod_desc" 
                                                            value={prod_desc}
                                                            onChange={(event) => addProdStringHandler(event)}
                                                            onKeyUp={(event) => charCounterHandler(event)}
                                                            placeholder="High quality Indonesia cacao beans, harvested from the best source possible, offering rich chocolaty taste which will indulge you in satisfaction."
                                                            maxlength="2000"
                                                        >
                                                        </textarea>
                                                        <span>max char: {charCounter}/{descCharLimit}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> {/* ------ End of bagian input deskripsi produk ------ */}
                                        <div className="add-products-submission-wrap"> {/* Bagian submit form */}
                                            <AdmBtnSecondary width={"10rem"} onClick={toManageProduct}>Cancel</AdmBtnSecondary>
                                            <AdmBtnPrimary
                                                width={"10rem"}
                                                onClick={onSubmitAddProd}
                                                disabled={!mainImgCheck || !prod_name || !prod_category || !prod_weight || !prod_price || !prod_cost || !(warehouse.every(stockTrueChecker)) || !prod_desc}
                                            >
                                                Submit
                                            </AdmBtnPrimary>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                        :
                        <AdminSkeletonModerate />
                    }
                </div>
                :
                <NotFoundPage />
            }
        </>
    )
}

export default AdminAddProduct;