import "./styles/EditProduct.css";
import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import {Link} from "react-router-dom";
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import { errorToast } from "../../redux/actions/ToastAction";
import {useHistory} from "react-router-dom";
import editIcon from "../../assets/components/Edit-Icon.svg";
import Modal from '../../components/Modal';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import chevronDown from "../../assets/components/Chevron-Down.svg";
import NotFoundPage from "../non-user/NotFoundV1";
import AdminSkeletonModerate from '../../components/admin/AdminSkeletonModerate';
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";
import AdmBtnPrimary from '../../components/admin/AdmBtnPrimary';
import AdmBtnSecondary from "../../components/admin/AdmBtnSecondary";
import infoIcon from "../../assets/components/Info-Yellow.svg";
import CircularProgress from '@mui/material/CircularProgress';

function EditProduct() {
    const prodIdFromParent = useLocation();

    const {id, name: prevName} = prodIdFromParent.state; //* Utk fetch data produk yang ingin di-edit, sengaja agar saat selesai edit, tampilan akan render ulang

    const [skeletonLoad, setSkeletonLoad] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data
    
    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [submitLoad, setSubmitLoad] = useState(false); //* State kondisi loading ketika submit button ter-trigger, hingga proses selesai

    const [editCategory, setEditCategory] = useState([]);

    const [prodNameCounter, setProdNameCounter] = useState(0); //* Utk check characters left input nama produk

    const [charCounter, setCharCounter] = useState(0); //* Utk check characters left input deskripsi produk

    const [editImage, setEditImage] = useState([]); //* State awal image, akan selalu 3 length nya setelah function fetch berjalan

    const [imgCarrier, setImgCarrier] = useState([]); //* Utk membawa data image baru yang akan menggantikan image sebelumnya ke BE

    const [prevImgCarrier, setPrevImgCarrier] = useState(""); //* Utk deteksi image sebelumnya yang akan dihapus di BE

    const [imgIndex, setImgIndex] = useState(null); //* Utk deteksi index image keberapa yang di-edit

    const [editProdInput, setEditProdInput] = useState({}); //* Utk bawa input edit data informasi (bukan image) produk ke BE

    const [modalLength, setModalLength] = useState([]); //* Utk atur relation modal edit image per tile image (currently max 3), sehingga unique identik dgn msg2 image

    const [toggleDropdown, setToggleDropdown] = useState(false); //* Atur toggle dropdown select product category

    const [selectedCategory, setSelectedCategory] = useState("Choose product category"); //* Sebagai placeholder ketika assign category belum dipilih & sudah dipilih

    const prodNameCharMax = 75; //* Max char input nama produk

    const descCharLimit = 2000; //* Max char input deskripsi produk

    let {name, category_id, weight, price, product_cost, description} = editProdInput;

    // FETCH & useEFFECT SECTION
    const getRoleId = useSelector((state) => state.auth.role_id);

    let history = useHistory();

    //* Utk kembali ke manage product
    const toManageProduct = () => history.push("/admin/manage-product");
    
    const fetchProdToEdit = async () => { //* Utk render data produk yang ingin di-edit
        try {
            const res = await axios.get(`${API_URL}/admin/product/detail?id=${id}`);
            setEditProdInput(res.data);
            setSelectedCategory(res.data.category);
            setProdNameCounter(res.data.name.length) //* Utk kalkulasi sisa max char product name
            setCharCounter(res.data.description.length); //* Utk kalkulasi sisa max char description
            let imagesLoop = res.data.images;
            if (imagesLoop.length === 1) { //* Utk bikin length array editImage selalu 3
                for (let i = 0; i < 3; i++) {
                    if (i === 0) {
                        setEditImage((prevState) => {
                            let newArray = prevState;
                            newArray[i] = imagesLoop[i];
                            return [...newArray];
                        });
                    } else {
                        setEditImage((prevState) => {
                            let newArray = prevState;
                            newArray[i] = "";
                            return [...newArray];
                        });
                    };
                };
            } else if (imagesLoop.length === 2) {
                for (let i = 0; i < 3; i++) {
                    if (i === 0 || i === 1) {
                        setEditImage((prevState) => {
                            let newArray = prevState;
                            newArray[i] = imagesLoop[i];
                            return [...newArray];
                        });
                    } else {
                        setEditImage((prevState) => {
                            let newArray = prevState;
                            newArray[i] = "";
                            return [...newArray];
                        });
                    };
                };
            } else {
                for (let i = 0; i < 3; i++) {
                    setEditImage((prevState) => {
                        let newArray = prevState;
                        newArray[i] = imagesLoop[i];
                        return [...newArray];
                    });
                };
            };
        } catch (error) {
            errorToast("Server Error, from EditProduct - Prod");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const fetchCategory = async () => { // Utk render data kategori produk
        try {
            const res = await axios.get(`${API_URL}/product/category`);
            setEditCategory(res.data);
        } catch (error) {
            errorToast("Server Error, from EditProduct - Cat");
            console.log(error);
            setErrorFetch(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProdToEdit();
            await fetchCategory();
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
          Edit Product
        </Typography>,
    ];

    // HANDLER FUNCTIONS SECTION
    const editProdStringHandler = (event) => { //* Utk setState data berbentuk string
        setEditProdInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const editProdNumberHandler = (event, cb) => { //* Utk setState data berbentuk number
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
        } else if (weight === 0 || price === 0 || product_cost === 0) {
            cb((prevState) => {
                return { ...prevState, [event.target.name]: ""};
            });
        } else {
            return
        }
    };

    const editImgHandler = (event, index, prevImg) => { //* Utk setState upload edit image
        let file = event.target.files[0];
        if (file) {
            setImgCarrier((prevState) => {
                let newArray = prevState;
                newArray[0] = file;
                return [...newArray];
            });
            setPrevImgCarrier(prevImg);
            setImgIndex(index);
        } else {
            setImgCarrier("");
            setImgIndex(null);
        };
    };

    // CHECKER FUNCTIONS SECTION
    const prodNameCharCounter = (event) => { //* Hitung characters left utk input product name
        return setProdNameCounter(event.target.value.length);
    };

    const charCounterHandler = (event) => {
        return setCharCounter(event.target.value.length);
    };

    // RENDER DROPDOWN FILTER PRODUCT PER PAGE AMOUNT
    const dropdownClick = (event) => { //* Buka tutup menu dropdown
        event.preventDefault();
        setToggleDropdown(!toggleDropdown);
    };

    const dropdownBlur = () => { //* Tutup menu dropdown ketika click diluar wrap menu dropdown
        setToggleDropdown(false)
    };

    const selectCategoryClick = (event, categoryName) => { //* Atur value warehouse yg di-assign & behavior dropdown stlh action terjadi
        setEditProdInput((prevState) => {
            return { ...prevState, category_id: parseInt(event.target.value) };
        });
        setSelectedCategory(categoryName);
        setToggleDropdown(false);
        fetchCategory();
    };

    // RENDER EDIT IMAGE MODAL SECTION
    const editImgModalContent = (imgSrc, index) => {
        return (
            <>
                <div className="edit-img-modal-head">
                    <h3>Edit {index === 0 ? "Main Image" : index === 1 ? "Second Image" : "Third Image"} of {prevName}</h3>
                    {/* <h6>Please make sure you've choose the correct product category</h6>
                    <h6>(will effect the upload folder on system)</h6> */}
                </div>
                <div className="edit-img-modal-body">
                    <div className="edit-images-tile-wrap">
                        <label 
                            htmlFor="img_carrier"
                            className={imgCarrier[0] ? "edit-images-upload-preview" : "edit-images-upload-item"}
                        >
                            <input 
                                type="file" 
                                id="img_carrier"
                                name="img_carrier"
                                accept=".jpg,.jpeg,.png"
                                onChange={(event) => editImgHandler(event, index, imgSrc)}
                            />
                            {imgCarrier[0] ?
                                <>
                                    <img 
                                        src={URL.createObjectURL(imgCarrier[0])} 
                                        alt="Preview-Image-To-Upload"
                                        className="edit-images-preview"
                                        style={{cursor: "pointer"}}
                                    />
                                </>
                                :
                                <p>{(index === 0) ? "Main Image" : (index === 1) ? "Second Image" : "Third Image"}</p>
                            }
                        </label>
                    </div>
                </div>
                <div className="edit-img-modal-foot">
                    <button onClick={() => onCloseModal(index)}>Cancel</button>
                    <button onClick={(event) => onDeleteImg(event, index, imgSrc)} disabled={index === 0 || !imgSrc}>Delete Image File</button>
                    <button onClick={(event) => onSubmitImgCarrier(event)} disabled={!imgCarrier[0]}>Submit Edit</button>
                </div>
            </>
        )
    };

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
        setImgCarrier([]);
    };

    const onSubmitImgCarrier = async (event) => { //* Untuk trigger submit button pada modal edit image
        event.preventDefault();
        document.querySelector("div.edit-img-modal-foot > button:last-of-type").disabled = true; //! Disable submit button utk prevent submit berulang kali
        document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = true; //! Disable delete img button utk prevent trigger berulang kali
        
        let imgToChange = imgCarrier[0];
        let prevImgToDelete = prevImgCarrier;
        let imgIdxToChange = imgIndex;

        //* Menyiapkan data untuk dikirimkan ke backend & melalui multer (BE) karena ada upload images
        const formData = new FormData();
        formData.append("images", imgToChange);

        let config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "category_id": category_id,
                "image_to_del": prevImgToDelete,
                "img_del_index": imgIdxToChange
            }
        };

        //* Kirim data kategori utk menentukan folder kategori image yang di-upload
        try {
            await axios.patch(`${API_URL}/product/edit/image/${id}`, formData, config);
            Swal.fire({
                icon: 'success',
                title: 'Edit product image success!',
                text: `Product image will refresh`,
                customClass: { //* CSS custom nya ada di AdminMainParent
                    popup: 'adm-swal-popup-override'
                },
                confirmButtonText: 'Continue',
                confirmButtonAriaLabel: 'Continue',
                confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
            });
            setImgCarrier([]);
            document.querySelector("div.edit-img-modal-foot > button:last-of-type").disabled = false;
            document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = false;
            fetchProdToEdit();
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
            document.querySelector("div.edit-img-modal-foot > button:last-of-type").disabled = false;
            document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = false;
        };
    };

    const onDeleteImg = async (event, index, prevImg) => { //* Untuk trigger delete button pada modal edit image
        event.preventDefault();
        document.querySelector("div.edit-img-modal-foot > button:last-of-type").disabled = true; //! Disable submit button utk prevent submit berulang kali
        document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = true; //! Disable delete img button utk prevent trigger berulang kali

        try {
            await axios.delete(`${API_URL}/product/delete/image/${id}`, {headers: {index_del_img: index, prev_img_path: prevImg}});
            Swal.fire({
                icon: 'success',
                title: 'Delete product image success!',
                text: `Product image will refresh`,
                customClass: { //* CSS custom nya ada di AdminMainParent
                    popup: 'adm-swal-popup-override'
                },
                confirmButtonText: 'Continue',
                confirmButtonAriaLabel: 'Continue',
                confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
            });
            setImgCarrier([]);
            document.querySelector("div.edit-img-modal-foot > button:last-of-type").disabled = false;
            document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = false;
            fetchProdToEdit();
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
            document.querySelector("div.edit-img-modal-foot > button:last-of-type").disabled = false;
            document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = false;
        };
    };

    // CLICK/SUBMIT FUNCTION SECTION
    const onSubmitedEditProd = async (event) => { //* Untuk trigger submit button informasi produk (tanpa image, karena edit image terpisah)
        event.preventDefault();
        
        setSubmitLoad(true);
        document.querySelector("div.edit-product-submission-wrap > button:last-of-type").disabled = true; //! Disable submit button input edit product utk prevent submit berulang kali
        const successRedirect = () => history.push("/admin/manage-product");
        
        let inputtedProd = {
            name: name,
            category_id: category_id,
            weight: weight,
            price: price,
            product_cost: product_cost,
            description: description
        };

        if (name || category_id || weight || price || product_cost || description) {
            try {
                await axios.patch(`${API_URL}/product/edit/${id}`, inputtedProd);
                await Swal.fire({
                    icon: 'success',
                    title: 'Edit product success!',
                    text: `Page will go to manage product page after confirm`,
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue',
                    confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
                });
                setSubmitLoad(false);
                successRedirect();
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
                setSubmitLoad(false);
                document.querySelector("div.edit-product-submission-wrap > button:last-of-type").disabled = false;
            };
        } else {
            errorToast("Please make sure all inputs are filled");
            setSubmitLoad(false);
            document.querySelector("div.edit-product-submission-wrap > button:last-of-type").disabled = false;
        };
    };

    return (
        <>
            {(getRoleId === 1) ?
                <div className="edit-product-main-wrap">
                    {!skeletonLoad ?
                        <>
                            <div className="edit-product-breadcrumb-wrap">
                                <Stack spacing={2}>
                                    <Breadcrumbs
                                        separator={<NavigateNextIcon fontSize="small" />}
                                        aria-label="edit product breadcrumb"
                                    >
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>
                            </div>
                            { (!skeletonLoad && errorFetch) ?
                                <AdminFetchFailed />
                                :
                                <>
                                    <div className="edit-product-header-wrap">
                                        <h4>Edit Product {prevName}</h4>
                                    </div>
                                    <div className="edit-product-contents-wrap">
                                        <div className="edit-notice-wrap">
                                            <div>
                                                <img src={infoIcon} alt="Info-Icon"/>
                                                <h6>[Read Carefully] Important Notice During Edit Product</h6>
                                            </div>
                                            <ol>
                                                <li>Edit product images & information (ex: name, category, etc.) is separated form.</li>
                                                <li>Edit & delete product images have its own submit button, access it by click each image you want to edit.</li>
                                                <li>Main image cannot be delete because it's mandatory for each product (only edit available).</li>
                                                <li>Edit product information have its own submit button, located on the bottom of this page.</li>
                                                <li>Edit stock only accessible through Stock Opname page and only eligible for warehouse admin role.</li>
                                                {/* <li>Make sure you've choose correct product category before edit the image.</li> */}
                                            </ol>
                                        </div>
                                        <div className="edit-images-form-wrap"> {/* Bagian upload image produk */}
                                            <div className="edit-images-left-wrap"> {/* Bagian kiri upload image produk */}
                                                <h6>Upload Image</h6>
                                                <p>Eligible file formats are jpg, jpeg, or PNG. Max file size 2.5 MB. </p>
                                                <p>Max upload 3 images. Main image is required for each product.</p>
                                            </div>
                                            <div className="edit-images-right-wrap"> {/* Bagian kanan upload image produk */}
                                                {editImage.map((val, index) => {
                                                    return (
                                                        <div className="edit-images-tile-wrap">
                                                            <label 
                                                                htmlFor={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                                className={editImage[index] ? "edit-images-upload-preview" : "edit-images-upload-item"}
                                                                onClick={!editImage[index] ? () => modalClick(index) : null}
                                                            >
                                                                {editImage[index] ?
                                                                    <>
                                                                        <img 
                                                                            src={`${API_URL}/${val}`}
                                                                            alt={(index === 0) ? "Preview-Main-Image" : (index === 1) ? "Preview-Secondary-Image" : "Preview-Third-Image"}
                                                                            className="edit-images-preview"
                                                                        />
                                                                    </>
                                                                    :
                                                                    <p>{(index === 0) ? "Main Image" : (index === 1) ? "Second Image" : "Third Image"}</p>
                                                                }
                                                            </label>
                                                            {editImage[index] ?
                                                                <span 
                                                                    className="edit-images-icon"
                                                                    onClick={() => modalClick(index)}
                                                                >
                                                                    <img src={editIcon} />
                                                                </span>
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div> {/* ------ End of bagian upload image produk ------ */}
                                        <form id="edit-prod-form" className="edit-info-form-wrap"> {/* Bagian input informasi produk */}
                                            <div className="edit-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="edit-info-form-left"> {/* Bagian kiri input nama produk */}
                                                    <label htmlFor="name">Product Name</label>
                                                    <p>Fill in the product name which includes brand, information such as weight, material, origin, etc.</p>
                                                </div>
                                                <div className="edit-info-form-right"> {/* Bagian kanan input nama produk */}
                                                    <div className="edit-info-right-name-input">
                                                        <input 
                                                            type="text" 
                                                            id="name" 
                                                            name="name" 
                                                            value={name}
                                                            onChange={(event) => editProdStringHandler(event)}
                                                            onKeyUp={(event) => prodNameCharCounter(event)}
                                                            placeholder="Ex: Javara Coconut Sugar 250gr"
                                                            maxLength={prodNameCharMax}
                                                        />
                                                        <span>{prodNameCounter}/{prodNameCharMax}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="edit-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="edit-info-form-left"> {/* Bagian kiri input kategori produk */}
                                                    <label htmlFor="category_id">Category</label>
                                                </div>
                                                <div className="edit-info-form-right"> {/* Bagian kanan input kategori produk */}
                                                    <div className="edit-info-right-category-dropdown">
                                                        <button 
                                                            className="info-right-editCat-dropdown-btn" 
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
                                                            className="info-right-editCat-dropdown-menu" 
                                                            style={{
                                                                transform: toggleDropdown ? "translateY(0)" : "translateY(-5px)",
                                                                opacity: toggleDropdown ? 1 : 0,
                                                                zIndex: toggleDropdown ? 100 : -10,
                                                            }}
                                                        >
                                                            {editCategory.map((val) => (
                                                                val.id === category_id? 
                                                                <li className="info-right-editCat-dropdown-selected">{val.category}</li> 
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
                                            <div className="edit-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="edit-info-form-left"> {/* Bagian kiri input berat produk */}
                                                    <label htmlFor="weight">Product Weight</label>
                                                    <p>Pay attention, product weight will affect courier shipping fee</p>
                                                </div>
                                                <div className="edit-info-form-right"> {/* Bagian kanan input berat produk */}
                                                    <div className="edit-info-right-weight-input">
                                                        <input 
                                                            type="number" 
                                                            id="weight" 
                                                            name="weight" 
                                                            value={weight}
                                                            onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                                            onKeyUp={(event) => noMinusHandler(event, setEditProdInput)}
                                                            onWheel={(event) => event.target.blur()}
                                                            placeholder="Product base weight + packaging"
                                                            min="1"
                                                        />
                                                        <span>gram (g)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="edit-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="edit-info-form-left"> {/* Bagian kiri input harga produk */}
                                                    <label htmlFor="price">Product Price / Pcs</label>
                                                </div>
                                                <div className="edit-info-form-right"> {/* Bagian kanan input harga produk */}
                                                    <div className="edit-info-right-numeric-input">
                                                        <input 
                                                            type="number" 
                                                            id="price" 
                                                            name="price" 
                                                            value={price}
                                                            onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                                            onKeyUp={(event) => noMinusHandler(event, setEditProdInput)}
                                                            onWheel={(event) => event.target.blur()}
                                                            placeholder="Input price (minimum: 1)"
                                                            min="1"
                                                        />
                                                        <span>Rp</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="edit-info-form-item"> {/* Wrapper individu row input */}
                                                <div className="edit-info-form-left"> {/* Bagian kiri input biaya/COGS produk */}
                                                    <label htmlFor="product_cost">Product Cost / Pcs</label> {/* Bagian kanan input biaya/COGS produk */}
                                                </div>
                                                <div className="edit-info-form-right">
                                                    <div className="edit-info-right-numeric-input">
                                                        <input 
                                                            type="number" 
                                                            id="product_cost" 
                                                            name="product_cost" 
                                                            value={product_cost}
                                                            onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                                            onKeyUp={(event) => noMinusHandler(event, setEditProdInput)}
                                                            onWheel={(event) => event.target.blur()}
                                                            placeholder="Product COGS (minimum: 1)"
                                                            min="1"
                                                        />
                                                        <span>Rp</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </form> {/* ------ End of bagian input informasi produk ------ */}
                                        <div className="edit-desc-form-wrap"> {/* Bagian input deskripsi produk */}
                                            <div className="edit-desc-form-item"> {/* Wrapper individu row input deskripsi */}
                                                <div className="edit-desc-form-left"> {/* Bagian kiri input deskripisi produk */}
                                                    <label htmlFor="description">Product Description</label>
                                                    <p>Make sure the product description includes specifications, sizes, materials, expiration dates, and more. The more detailed, the more useful and easy to understand for buyers.</p>                                    
                                                </div>
                                                <div className="edit-desc-form-right"> {/* Bagian kanan input deskripisi produk */}
                                                    <div className="edit-info-right-desc-input">
                                                        <textarea 
                                                            type="text" 
                                                            rows="8"
                                                            cols="100"
                                                            name="description" 
                                                            value={description}
                                                            onChange={(event) => editProdStringHandler(event)}
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
                                        <div className="edit-product-submission-wrap"> {/* Bagian submit form */}
                                            <AdmBtnSecondary width={"10rem"} onClick={toManageProduct}>Cancel</AdmBtnSecondary>
                                            <AdmBtnPrimary
                                                width={"10rem"}
                                                onClick={onSubmitedEditProd}
                                                disabled={!name || !category_id || !weight || !price || !product_cost || !description}
                                            >
                                                {submitLoad ? <CircularProgress style={{padding: "0.25rem"}}/> : "Submit"}
                                            </AdmBtnPrimary>
                                        </div>
                                    </div>
                                    {editImage.map((val, index) => (
                                        <Modal open={modalLength[index]} close={() => onCloseModal(index)}>
                                            {editImgModalContent(val, index)}
                                        </Modal>
                                    ))}
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

export default EditProduct;