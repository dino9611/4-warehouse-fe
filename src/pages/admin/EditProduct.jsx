import "./styles/EditProduct.css";
import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom";
import axios from 'axios';
import {API_URL} from "../../constants/api";
import {Link} from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Swal from 'sweetalert2';
import { useSelector } from "react-redux";
import { errorToast } from "../../redux/actions/ToastAction";
import {useHistory} from "react-router-dom";
import editIcon from "../../assets/components/Edit-Icon.svg";
import Modal from '../../components/Modal';

function EditProduct() {
    const prodIdFromParent = useLocation();

    const {id, name: prevName} = prodIdFromParent.state; // Utk fetch data produk yang ingin di-edit, sengaja agar saat selesai edit, tampilan akan render ulang

    const [skeletonLoad, setSkeletonLoad] = useState(true);
    const [editCategory, setEditCategory] = useState([]);
    const [charCounter, setCharCounter] = useState(2000);

    const [editImage, setEditImage] = useState([]); // State awal image, akan selalu 3 length nya setelah function fetch berjalan

    const [imgCarrier, setImgCarrier] = useState([]); // Utk membawa data image baru yang akan menggantikan image sebelumnya ke BE

    const [prevImgCarrier, setPrevImgCarrier] = useState(""); // Utk deteksi image sebelumnya yang akan dihapus di BE

    const [imgIndex, setImgIndex] = useState(null); // Utk deteksi index image keberapa yang di-edit

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

    const editImgHandler = (event, index, prevImg) => { // Utk setState upload edit image
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

    const charCounterHandler = (event) => {
        return setCharCounter(descCharLimit - event.target.value.length);
    };

    // RENDER EDIT IMAGE MODAL SECTION
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
                    </div>
                </div>
                <div className="edit-img-modal-foot">
                    <button onClick={(event) => onSubmitImgCarrier(event)} disabled={!imgCarrier[0]}>Submit Edit</button>
                    <button onClick={(event) => onDeleteImg(event, index, imgSrc)} disabled={index === 0 || !imgSrc}>Delete Image File</button>
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

    // CLICK/SUBMIT FUNCTION SECTION
    const onSubmitedEditProd = async (event) => { // Untuk trigger submit button informasi produk (tanpa image, karena edit image terpisah)
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

    const onSubmitImgCarrier = async (event) => { // Untuk trigger submit button pada modal edit image
        event.preventDefault();
        document.querySelector("div.edit-img-modal-foot > button").disabled = true;
        document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = true;
        
        let imgToChange = imgCarrier[0];
        let prevImgToDelete = prevImgCarrier;
        let imgIdxToChange = imgIndex;

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
            Swal.fire({
                icon: 'success',
                title: 'Edit product image success!',
                text: `Product image will refresh`,
                confirmButtonColor: '#B24629',
            });
            setImgCarrier([]);
            document.querySelector("div.edit-img-modal-foot > button").disabled = false;
            document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = false;
            fetchProdToEdit();
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...something went wrong, reload/try again',
                confirmButtonColor: '#B24629',
            });
        };
    };

    const onDeleteImg = async (event, index, prevImg) => { // Untuk trigger delete button pada modal edit image
        event.preventDefault();
        document.querySelector("div.edit-img-modal-foot > button").disabled = true;
        document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = true;

        try {
            await axios.delete(`${API_URL}/product/delete/image/${id}`, {headers: {index_del_img: index, prev_img_path: prevImg}});
            Swal.fire({
                icon: 'success',
                title: 'Delete product image success!',
                text: `Product image will refresh`,
                confirmButtonColor: '#B24629',
            });
            setImgCarrier([]);
            document.querySelector("div.edit-img-modal-foot > button").disabled = false;
            document.querySelector("div.edit-img-modal-foot > button:nth-of-type(2)").disabled = false;
            fetchProdToEdit();
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...something went wrong, reload/try again',
                confirmButtonColor: '#B24629',
            });
        };
    };

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
                                <li>Edit product information have its own submit button, located on the bottom of this page.</li>
                                <li>Make sure you've choose correct product category before edit the image.</li>
                                <li>Main image cannot be delete because it's mandatory for each product (only edit available).</li>
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
                                <button>Cancel/Back</button>
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