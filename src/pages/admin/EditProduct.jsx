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
import { errorToast } from "../../redux/actions/ToastAction";
import {useHistory} from "react-router-dom";
import editIcon from "../../assets/components/Edit-Icon.svg";
import Modal from '../../components/Modal';
import Textbox from "../../components/Textbox";

function EditProduct() {
    const prodIdFromParent = useLocation();
    // console.log("Dari edit page: ", prodIdFromParent.state);

    const {id, name: prevName} = prodIdFromParent.state; // Utk fetch data produk yang ingin di-edit, sengaja agar saat selesai edit, tampilan akan render ulang

    const [skeletonLoad, setSkeletonLoad] = useState(true);
    const [editCategory, setEditCategory] = useState([]);
    const [mainImgCheck, setMainImgCheck] = useState(false);
    const [charCounter, setCharCounter] = useState(2000);

    const [editImage, setEditImage] = useState([]); // State awal image, akan selalu 3 length nya setelah function fetch berjalan

    const [imgCarrier, setImgCarrier] = useState([]); // Utk membawa data image baru yang akan menggantikan image sebelumnya ke BE

    const [prevImgCarrier, setPrevImgCarrier] = useState(""); // Utk deteksi image sebelumnya yang akan dihapus di BE

    const [imgIndex, setImgIndex] = useState(null); // Utk deteksi index image keberapa yang di-edit

    // const [testEditImg, setTestEditImg] = useState([]);

    const [editProdInput, setEditProdInput] = useState({}); // Utk bawa input edit data informasi (bukan image) produk ke BE

    const [modalLength, setModalLength] = useState([]); // Utk atur relation modal edit image per tile image (currently max 3), sehingga unique identik dgn msg2 image
    
    const getRoleId = useSelector(state => state.auth.id); // ? Blm kepake

    let history = useHistory(); // Utk redirect ke manage product page stlh submit edit

    const descCharLimit = 2000;

    let {name, category_id, weight, price, product_cost, description} = editProdInput;

    const fetchProdToEdit = async () => { // Utk render data produk yang ingin di-edit
        try {
            const res = await axios.get(`${API_URL}/admin/product/detail?id=${id}`);
            setEditProdInput(res.data);
            setCharCounter(charCounter - res.data.description.length); // Utk kalkulasi sisa max char description
            let imagesLoop = res.data.images;
            if (imagesLoop.length === 1) { // Utk bikin length array editImage selalu 3
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
            console.log(error);
        }
    };

    // console.log("Hasil fetchProdToEdit: ", editProdInput);
    // console.log("Hasil loop setImages: ", editImage);

    const fetchCategory = async () => { // Utk render data kategori produk
        try {
            const res = await axios.get(`${API_URL}/product/category`);
            setEditCategory(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchProdToEdit();
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
        } else if (weight === 0 || price === 0 || product_cost === 0) {
            cb((prevState) => {
                return { ...prevState, [event.target.name]: ""};
            });
        } else {
            return
        }
    };

    // const editImageHandler = (event, indexArr) => { // Utk setState upload image
    //     let file = event.target.files[0];
    //     if (file) {
    //         setEditImage((prevState) => {
    //             let newArray = prevState;
    //             newArray[indexArr] = file;
    //             if (indexArr === 0) {
    //                 setMainImgCheck(true);
    //             }
    //             return [...newArray];
    //         });
    //     } else {
    //         setEditImage((prevState) => {
    //             let newArray = prevState;
    //             newArray[indexArr] = "";
    //             if (indexArr === 0) {
    //                 setMainImgCheck(false);
    //             }
    //             return [...newArray];
    //         });
    //     }
    // };

    // ! Testing edit image
    // const editTestImgHandler = (event) => { // Utk setState upload image
    //     let file = event.target.files[0];
    //     console.log("Line 175: ", file);
    //     if (file) {
    //         setTestEditImg(file);
    //     } else {
    //         setTestEditImg("");
    //     }
    // };

    const editImgHandler = (event, index, prevImg) => { // Utk setState upload image
        let file = event.target.files[0];
        console.log("Line 185: ", file);
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

    // console.log("Line 200: ", imgCarrier);

    // console.log("Line 202: ", prevImgCarrier);

    // const editImgModalClick = (event, indexArr) => {
    //     setEditImage((prevState) => {
    //         let newArray = prevState;
    //         newArray[indexArr] = "";
    //         if (indexArr === 0) {
    //             setMainImgCheck(false);
    //         }
    //         return [...newArray];
    //     });
    // };

    const editImgModalContent = (imgSrc, index) => {
        return (
            <>
                <div className="edit-img-modal-head">
                    <h3>Edit {index === 0 ? "Main Image" : index === 1 ? "Second Image" : "Third Image"} of {prevName}</h3>
                    <h6>Please make sure you've choose the correct product category</h6>
                    <h6>(will effect the upload folder on system)</h6>
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
                        {/* {imgCarrier[0] ?
                            <span 
                                className="edit-images-icon"
                                onClick={() => modalClick(index)}
                            >
                                <img src={editIcon} />
                            </span>
                            :
                            null
                        } */}
                    </div>
                </div>
                <div className="edit-img-modal-foot">
                    <button onClick={(event) => onSubmitImgCarrier(event)} disabled={!imgCarrier[0]}>Submit Edit</button>
                    <button>Delete Image</button>
                    <button onClick={() => onCloseModal(index)}>Cancel</button>
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
    // ! End of Testing edit image

    // const delImgUpload = (event, indexArr) => {
    //         setEditImage((prevState) => {
    //         let newArray = prevState;
    //         newArray[indexArr] = "";
    //         if (indexArr === 0) {
    //             setMainImgCheck(false);
    //         }
    //         return [...newArray];
    //     });
    // };

    const charCounterHandler = (event) => {
        return setCharCounter(descCharLimit - event.target.value.length);
    };

    // CLICK FUNCTION SECTION
    const onSubmitedEditProd = async (event) => { // Untuk trigger submit button (tanpa image, karena edit image terpisah)
        event.preventDefault();
        document.querySelector("button.edit-product-submit-btn").disabled = true;
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
                document.querySelector("button.edit-product-submit-btn").disabled = false;
                await Swal.fire({
                    icon: 'success',
                    title: 'Edit product success!',
                    text: `Page will go to manage product page after confirm`,
                    confirmButtonColor: '#B24629',
                });
                successRedirect();
            } catch (err) {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    confirmButtonColor: '#B24629',
                  });
            };
        } else {
            errorToast("Please make sure all inputs are filled");
        };
    };

    const onSubmitImgCarrier = async (event) => { // Untuk trigger submit button
        event.preventDefault();
        
        let imgToChange = imgCarrier[0];
        let prevImgToDelete = prevImgCarrier;
        let imgIdxToChange = imgIndex;

        // ! Ini buat foto aja
        // Menyiapkan data untuk dikirimkan ke backend & melalui multer (BE) karena ada upload images
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

        // Kirim data kategori utk menentukan folder kategori image yang di-upload
        try {
            await axios.patch(`${API_URL}/product/edit/image/${id}`, formData, config);
        } catch (err) {
            console.log(err);
        };
    };

    // const onSubmitTestImg = async (event) => { // Untuk trigger submit button
    //     event.preventDefault();
        
    //     let uploadTestImg = testEditImg;

    //     // ! Ini buat foto aja
    //     // Menyiapkan data untuk dikirimkan ke backend & melalui multer (BE) karena ada upload images
    //     const formData = new FormData();
    //     formData.append("images", uploadTestImg);

    //     // for (let i = 0; i < uploadedImg.length; i++) {
    //     //     if (uploadedImg[i]) {
    //     //         formData.append("images", uploadedImg[i]); // Key "images" harus sesuai dengan yang di backend & berlaku kebalikannya
    //     //     }
    //     // }

    //     let config = {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //             "category_id": category_id
    //         }
    //     };

    //     // Kirim data kategori utk menentukan folder kategori image yang di-upload
    //     try {
    //         await axios.patch(`${API_URL}/product/edit/image/${id}`, formData, config);
    //     } catch (err) {
    //         console.log(err);
    //     };
    // };

    return (
        <div className="edit-product-main-wrap">
            {!skeletonLoad ?
                <>
                    <div className="edit-product-header-wrap">
                        <h4>Edit Product {prevName}</h4>
                        <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
                    </div>
                    <div className="edit-product-contents-wrap">
                        <div className="edit-notice-wrap">
                            <h4>Important Notice During Edit Product (Read Carefully)</h4>
                            <ol>
                                <li>Edit product images & information (ex: name, category, etc.) is separated.</li>
                                <li>Edit & delete product images have its own submit button, access it by click each image you want to edit.</li>
                                <li>Make sure you've choose correct product category before edit the image.</li>
                                <li>Edit product information have its own submit button, located on the bottom of this page.</li>
                                <li>Edit stock only accessible through Stock Opname page and only eligible for admin/warehouse admin role.</li>
                            </ol>
                        </div>
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
                                                onClick={!editImage[index] ? () => modalClick(index) : null}
                                            >
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
                            {/* <div>
                                <input 
                                    type="file" 
                                    id="test_img"
                                    name="test_img"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(event) => editTestImgHandler(event)}
                                />
                                <button onClick={event => onSubmitTestImg(event)}>Submit</button>
                            </div> */}
                        </div>
                        <form id="edit-prod-form" className="edit-info-form-wrap">
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="name">Product Name</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={name}
                                        onChange={(event) => editProdStringHandler(event)}
                                        placeholder="Example: Javara (Brand, if any) + Coconut Sugar (Name) + 250gr (Size)"
                                    />
                                </div>
                            </div>
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="category_id">Category</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <select 
                                        id="category_id"
                                        name="category_id" 
                                        defaultValue={category_id}
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
                                    <label htmlFor="weight">Product Weight</label>
                                </div>
                                <div className="edit-info-form-right">
                                    <input 
                                        type="number" 
                                        id="weight" 
                                        name="weight" 
                                        value={weight}
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
                                    <label htmlFor="price">Product Price / Pcs</label>
                                </div>
                                <div className="edit-info-form-right">
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
                                    <p>in Rupiah (Rp)</p>
                                </div>
                            </div>
                            <div className="edit-info-form-item">
                                <div className="edit-info-form-left">
                                    <label htmlFor="product_cost">Product Cost / Pcs</label>
                                </div>
                                <div className="edit-info-form-right">
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
                                    <p>in Rupiah (Rp)</p>
                                </div>
                            </div>
                        </form>
                        <div className="edit-desc-form-wrap">
                            <div className="edit-desc-form-item">
                                <div className="edit-desc-form-left">
                                    <label htmlFor="description">Product Description</label>
                                    <p>max char: {charCounter}/{descCharLimit}</p>
                                </div>
                                <div className="edit-desc-form-right">
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
                                </div>
                            </div>
                        </div>
                        <div className="edit-product-submission-wrap">
                            <Link to="/admin/manage-product" className="edit-product-cancel-wrap">
                                <button>Cancel</button>
                            </Link>
                            <button 
                                className="edit-product-submit-btn"
                                onClick={onSubmitedEditProd}
                                disabled={!name || !category_id || !weight || !price || !product_cost || !description}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    {editImage.map((val, index) => (
                        <Modal open={modalLength[index]} close={() => onCloseModal(index)}>
                            {editImgModalContent(val, index)}
                        </Modal>
                    ))}
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