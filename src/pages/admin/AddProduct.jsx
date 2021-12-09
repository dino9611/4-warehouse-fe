import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./styles/AddProduct.css";
import {API_URL} from "../../constants/api";
import {Link} from "react-router-dom";

function AdminAddProduct() {
    const [role, setRole] = useState("superAdmin"); // Hanya untuk testing
    const [category, setCategory] = useState([]);
    const [warehouse, setWarehouse] = useState([]);

    const [addProdInput, setAddProdInput] = useState({ // Utk bawa input data produk ke BE
        image: "",
        prod_name: "",
        prod_category: 0,
        prod_weight: "",
        prod_price: "",
        prod_cost: "",
        prod_desc: ""
      });
    // console.log(addProdInput);

    const [addWhStock, setAddWhStock] = useState({ // Utk bawa input data stok produk ke BE
        wh_id_01: 1,
        stock_01: "",
        wh_id_02: 2,
        stock_02: "",
        wh_id_03: 3,
        stock_03: ""
    });
    // console.log(addWhStock);

    let { 
        image, 
        prod_name, 
        prod_category, 
        prod_weight, 
        prod_price, 
        prod_cost, 
        prod_desc 
    } = addProdInput;

    let {
        wh_id_01,
        stock_01,
        wh_id_02,
        stock_02,
        wh_id_03,
        stock_03
    } = addWhStock;

    let stockList = [stock_01, stock_02, stock_03];

    const fetchCategory = async () => { // Utk render data kategori produk
        try {
            const res = await axios.get(`${API_URL}/product/category`);
            setCategory(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const fetchWarehouse = async () => { // Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            setWarehouse(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchWarehouse();
        // console.log("Setelah useEffect", addWhStock);
    }, []);

    // HANDLER FUNCTIONS SECTION
    const addProdStringHandler = (event) => { // Utk setState data berbentuk string
        setAddProdInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const addProdNumberHandler = (event, cb) => { // Utk setState data berbentuk number
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
        } else {
            return
        }
    };
    
    return (
        <div className="add-products-main-wrap">
            <div className="add-products-header-wrap">
                <h4>Tambah Produk bambang</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="add-products-contents-wrap">
                <div className="add-images-form-wrap">
                    <div className="add-images-left-wrap">
                        <h5>Upload Image</h5>
                        <p>Please ensure the image uploaded is meeting our standard/minimum guideline</p>
                    </div>
                    <div className="add-images-right-wrap">
                        <div className="add-images-upload-item">
                            <p>Main Image</p>
                        </div>
                        <div className="add-images-upload-item">
                            <p>Second Image</p>
                        </div>
                        <div className="add-images-upload-item">
                            <p>Third Image</p>
                        </div>
                    </div>
                </div>
                <form id="add-prod-form" className="add-info-form-wrap">
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label htmlFor="prod_name">Product Name</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="text" 
                                id="prod_name" 
                                name="prod_name" 
                                value={prod_name}
                                onChange={(event) => addProdStringHandler(event)}
                                placeholder="Example: Javara (Brand, if any) + Coconut Sugar (Name) + 250gr (Size)"
                            />
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label htmlFor="prod_category">Category</label>
                        </div>
                        <div className="add-info-form-right">
                            <select 
                                id="prod_category"
                                name="prod_category" 
                                defaultValue={prod_category}
                                onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                style={{textTransform: "capitalize"}}
                            >
                                <option value={0} disabled hidden>Select here</option>
                                {category.map((val) => (
                                    <option value={val.id} key={`00${val.id}-${val.category}`} style={{textTransform: "capitalize"}}>
                                        {val.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label htmlFor="prod_weight">Product Weight</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="number" 
                                id="prod_weight" 
                                name="prod_weight" 
                                value={prod_weight}
                                onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                onKeyUp={(event) => noMinusHandler(event, setAddProdInput)}
                                placeholder="(base weight + packaging)"
                                min="1"
                            />
                            <p>Gram (g)</p>
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label htmlFor="prod_price">Product Price / Pcs</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="number" 
                                id="prod_price" 
                                name="prod_price" 
                                value={prod_price}
                                onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                onKeyUp={(event) => noMinusHandler(event, setAddProdInput)}
                                placeholder="Input price (minimum: 1)"
                                min="1"
                            />
                            <p>in Rupiah (Rp)</p>
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label htmlFor="prod_cost">Product Cost / Pcs</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="number" 
                                id="prod_cost" 
                                name="prod_cost" 
                                value={prod_cost}
                                onChange={(event) => addProdNumberHandler(event, setAddProdInput)}
                                onKeyUp={(event) => noMinusHandler(event, setAddProdInput)}
                                placeholder="Product COGS (minimum: 1)"
                                min="1"
                            />
                            <p>in Rupiah (Rp)</p>
                        </div>
                    </div>
                    {/* <div className="add-info-form-item"> */}
                        {warehouse.map((val, index) => (
                            <div className="add-info-form-item" key={`Gudang-${val.id}`}>
                                <div className="add-info-form-left">
                                    <label htmlFor={`stock_0${val.id}`}>Stock {val.name}</label>
                                </div>
                                <div className="add-info-form-right">
                                    <input 
                                        type="number" 
                                        id={`stock_0${val.id}`}
                                        name={`stock_0${val.id}`}
                                        value={stockList[index]}
                                        onChange={(event) => addProdNumberHandler(event, setAddWhStock)}
                                        onKeyUp={(event) => noMinusHandler(event, setAddWhStock)}
                                        placeholder="Input stock (minimum: 0)"
                                        min="0"
                                        disabled={role === "admin"}
                                    />
                                    <p>*Only super admin can fill</p>
                                </div>
                            </div>
                        ))}
                </form>
                <div className="add-desc-form-wrap">
                    <div className="add-desc-form-item">
                        <div className="add-desc-form-left">
                            <label htmlFor="prod_desc">Product Description</label>
                        </div>
                        <div className="add-desc-form-right">
                            <textarea 
                                type="text" 
                                rows="8"
                                cols="100"
                                name="prod_desc" 
                                value={prod_desc}
                                onChange={(event) => addProdStringHandler(event)}
                                placeholder="High quality Indonesia cacao beans, harvested from the best source possible, offering rich chocolaty taste which will indulge you in satisfaction."
                            >
                            </textarea>
                        </div>
                    </div>
                </div>
                <div className="add-products-submission-wrap">
                    <Link to="/admin/manage-product" className="add-products-cancel-wrap">
                        <button>Cancel</button>
                    </Link>
                    <button className="add-products-submit-btn">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminAddProduct;