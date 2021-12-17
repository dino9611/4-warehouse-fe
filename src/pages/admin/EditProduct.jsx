import "./styles/EditProduct.css";
import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import {Link} from "react-router-dom";
import deleteTrash from "../../assets/components/Delete-Trash.svg";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";

function EditProduct() {
    const dataFromParent = useLocation();
    // console.log("Dari edit page: ", dataFromParent.state);

    const {images, id, name, category_id, weight, price, product_cost, description} = dataFromParent.state;

    const [skeletonLoad, setSkeletonLoad] = useState(true);
    const [editCategory, setEditCategory] = useState([]);
    const [mainImgCheck, setMainImgCheck] = useState(false);
    const [charCounter, setCharCounter] = useState(2000 - description.length);

    const [editImage, setEditImage] = useState([
        images[0],
        images[1],
        images[2]
    ]);

    const getRoleId = useSelector(state => state.auth.username);

    const [editProdInput, setEditProdInput] = useState({ // Utk bawa input edit data produk ke BE
        prod_name: name,
        prod_category: category_id,
        prod_weight: weight,
        prod_price: price,
        prod_cost: product_cost,
        prod_desc: description
      });

    const descCharLimit = 2000;

    let { 
        prod_name, 
        prod_category, 
        prod_weight, 
        prod_price, 
        prod_cost, 
        prod_desc 
    } = editProdInput;

    const fetchCategory = async () => { // Utk render data kategori produk
        try {
            const res = await axios.get(`${API_URL}/product/category`);
            setEditCategory(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchCategory();
        setSkeletonLoad(false);
    }, []);

    // HANDLER && CHECKER FUNCTIONS SECTION
    const editProdStringHandler = (event) => { // Utk setState data berbentuk string
        setEditProdInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const editProdNumberHandler = (event, cb) => { // Utk setState data berbentuk number
        cb((prevState) => {
            return { ...prevState, [event.target.name]: parseInt(event.target.value) };
        });
    };
    
    const noMinusHandler = (event, cb) => { // Biar input number tidak negatif (-)
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

    const editImageHandler = (event, indexArr) => { // Utk setState upload image
        let file = event.target.files[0];
        if (file) {
            setEditImage((prevState) => {
                let newArray = prevState;
                newArray[indexArr] = file;
                if (indexArr === 0) {
                    setMainImgCheck(true);
                }
                return [...newArray];
            });
        } else {
            setEditImage((prevState) => {
                let newArray = prevState;
                newArray[indexArr] = "";
                if (indexArr === 0) {
                    setMainImgCheck(false);
                }
                return [...newArray];
            });
        }
    };

    const delImgUpload = (event, indexArr) => {
            setEditImage((prevState) => {
            let newArray = prevState;
            newArray[indexArr] = "";
            if (indexArr === 0) {
                setMainImgCheck(false);
            }
            return [...newArray];
        });
    }

    const charCounterHandler = (event) => {
        return setCharCounter(descCharLimit - event.target.value.length);
    };

    // CLICK FUNCTION SECTION
    const onSubmitedEditProd = async (event) => { // Untuk trigger submit button
        event.preventDefault();
        
        let uploadedImg = editImage;
        let inputtedProd = {
            prod_name: prod_name,
            prod_category: prod_category,
            prod_weight: prod_weight,
            prod_price: prod_price,
            prod_cost: prod_cost,
            prod_desc: prod_desc
        };

        // Menyiapkan data untuk dikirimkan ke backend & melalui multer (BE) karena ada upload images
        const formData = new FormData();
        for (let i = 0; i < uploadedImg.length; i++) {
            if (uploadedImg[i]) {
                formData.append("images", uploadedImg[i]); // Key "images" harus sesuai dengan yang di backend & berlaku kebalikannya
            }
        }
        formData.append("dataProduct", JSON.stringify(inputtedProd));
        let config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };

        // Kirim data kategori utk menentukan folder kategori image yang di-upload
        try {
            await axios.post(`${API_URL}/product/determine-category`, inputtedProd);
        } catch (err) {
            console.log(err);
        };

        if (mainImgCheck || prod_name || prod_category || prod_weight || prod_price || prod_cost || prod_desc) {
            try {
                await axios.patch(`${API_URL}/product/edit/${id}`, formData, config);
                setEditImage((prevState) => {
                    let newArray = prevState;
                    newArray.forEach((val, index) => {
                        newArray[index] = "";
                    })
                    return [...newArray];
                });
                setMainImgCheck(false);
                setEditProdInput((prevState) => {
                    return {...prevState, prod_name: "", prod_category: 0, prod_weight: "", prod_price: "", prod_cost: "", prod_desc: ""}
                });
                document.querySelector("button.edit-product-submit-btn").disabled = true;
                Swal.fire({
                    icon: 'success',
                    title: 'Add product success!',
                    text: `${inputtedProd.prod_name}`,
                    confirmButtonColor: '#B24629',
                  });
            } catch (err) {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    confirmButtonColor: '#B24629',
                  });
            };
        } else {
            alert("Pastikan terisi semua (discount price tidak wajib)");
        };
    };

    return (
        <div className="edit-product-main-wrap">
            {!skeletonLoad ?
                <>
                    <div className="edit-product-header-wrap">
                        <h4>Edit Product {name}</h4>
                        <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
                    </div>
                    <div className="edit-product-contents-wrap">
                        <div className="edit-images-form-wrap">
                            <div className="edit-images-left-wrap">
                                <h5>Upload Image</h5>
                                <p>Please ensure the image uploaded is meeting our standard/minimum guideline</p>
                            </div>
                            <div className="edit-images-right-wrap">
                                {editImage.map((val, index) => {
                                    return (
                                        <div className="edit-images-tile-wrap">
                                            <label 
                                                htmlFor={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                className={editImage[index] ? "edit-images-upload-preview" : "edit-images-upload-item"}
                                            >
                                                <input 
                                                    type="file" 
                                                    id={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                    name={(index === 0) ? "main_img" : (index === 1) ? "secondary_img" : "third_img"}
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={(event) => editImageHandler(event, index)} 
                                                    disabled={editImage[index]}
                                                />
                                                {editImage[index] ?
                                                    <>
                                                        <img 
                                                        src={`${API_URL}/${val}`}
                                                            // src={URL.createObjectURL(editImage[index])} 
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
                                                    className="edit-images-del-icon"
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
                        </div>
                        <form id="edit-prod-form" className="edit-info-form-wrap">
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="prod_name">Product Name</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <input 
                                        type="text" 
                                        id="prod_name" 
                                        name="prod_name" 
                                        value={prod_name}
                                        onChange={(event) => editProdStringHandler(event)}
                                        placeholder="Example: Javara (Brand, if any) + Coconut Sugar (Name) + 250gr (Size)"
                                    />
                                </div>
                            </div>
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="prod_category">Category</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <select 
                                        id="prod_category"
                                        name="prod_category" 
                                        defaultValue={prod_category}
                                        onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                        style={{textTransform: "capitalize"}}
                                    >
                                        <option value={0} disabled hidden>Select here</option>
                                        {editCategory.map((val) => (
                                            <option value={val.id} key={`00${val.id}-${val.category}`} style={{textTransform: "capitalize"}}>
                                                {val.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="prod_weight">Product Weight</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <input 
                                        type="number" 
                                        id="prod_weight" 
                                        name="prod_weight" 
                                        value={prod_weight}
                                        onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                        onKeyUp={(event) => noMinusHandler(event, setEditProdInput)}
                                        onWheel={(event) => event.target.blur()}
                                        placeholder="(base weight + packaging)"
                                        min="1"
                                    />
                                    <p>Gram (g)</p>
                                </div>
                            </div>
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="prod_price">Product Price / Pcs</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <input 
                                        type="number" 
                                        id="prod_price" 
                                        name="prod_price" 
                                        value={prod_price}
                                        onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                        onKeyUp={(event) => noMinusHandler(event, setEditProdInput)}
                                        onWheel={(event) => event.target.blur()}
                                        placeholder="Input price (minimum: 1)"
                                        min="1"
                                    />
                                    <p>in Rupiah (Rp)</p>
                                </div>
                            </div>
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="prod_cost">Product Cost / Pcs</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <input 
                                        type="number" 
                                        id="prod_cost" 
                                        name="prod_cost" 
                                        value={prod_cost}
                                        onChange={(event) => editProdNumberHandler(event, setEditProdInput)}
                                        onKeyUp={(event) => noMinusHandler(event, setEditProdInput)}
                                        onWheel={(event) => event.target.blur()}
                                        placeholder="Product COGS (minimum: 1)"
                                        min="1"
                                    />
                                    <p>in Rupiah (Rp)</p>
                                </div>
                            </div>
                        </form>
                        <div className="edit-desc-form-wrap">
                            <div className="edit-desc-form-item">
                                <div className="edit-desc-form-left">
                                    <label htmlFor="prod_desc">Product Description</label>
                                    <p>max char: {charCounter}/{descCharLimit}</p>
                                </div>
                                <div className="edit-desc-form-right">
                                    <textarea 
                                        type="text" 
                                        rows="8"
                                        cols="100"
                                        name="prod_desc" 
                                        value={prod_desc}
                                        onChange={(event) => editProdStringHandler(event)}
                                        onKeyUp={(event) => charCounterHandler(event)}
                                        placeholder="High quality Indonesia cacao beans, harvested from the best source possible, offering rich chocolaty taste which will indulge you in satisfaction."
                                        maxlength="2000"
                                    >
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="edit-stock-notice-wrap">
                            <h5>Notice if you need edit stock</h5>
                            <h6>Edit stock only accessible through Stock Opname page and only eligible for admin/warehouse admin role.</h6>
                        </div>
                        <div className="edit-product-submission-wrap">
                            <Link to="/admin/manage-product" className="edit-product-cancel-wrap">
                                <button>Cancel</button>
                            </Link>
                            <button 
                                className="edit-product-submit-btn"
                                onClick={onSubmitedEditProd}
                                disabled={!mainImgCheck || !prod_name || !prod_category || !prod_weight || !prod_price || !prod_cost || !prod_desc}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>
                :
                <Stack spacing={3}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "48px", width: "20%"}}/>
                        <Skeleton variant="text" animation="wave" style={{borderRadius: "12px", height: "48px", width: "25%"}}/>        
                    </div>
                    <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "320px", width: "100%"}} />
                    <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "320px", width: "100%"}} />
                    <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "320px", width: "100%"}} />
                    <div style={{display: "flex", columnGap: "24px", justifyContent: "flex-end"}}>
                        <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "48px", width: "160px"}} />
                        <Skeleton variant="rectangular" animation="wave" style={{borderRadius: "12px", height: "48px", width: "160px"}} />
                    </div>
                </Stack>
            }
        </div>
    )
}

export default EditProduct;

// headers: {
//     adminPass: inputtedPass
//     {
//       data: {dataProdukInginDirubah},
//       adminPass: inputtedAdminPass
//     }
//     Di BE, req.body.data, req.body.adminPass
//   }

// Edit foto endpoint nya bedain
// Foto pertama hanya bisa edit
// Tombol delete foto hanya ada di foto 2 & 3