import "./styles/AddProduct.css"

function AdminAddProduct() {

    
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
                            <label for="prod-name">Product Name</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="text" 
                                id="prod-name" 
                                name="prod-name" 
                                placeholder="Example: Javara (Brand, if any) + Coconut Sugar (Name) + 250gr (Size)"
                            />
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label for="prod-category">Category</label>
                        </div>
                        <div className="add-info-form-right">
                            <select name="prod-category" id="prod-category">
                                <option value="" selected disabled hidden>Choose here</option>
                                <option value="Kopi">Kopi</option>
                                <option value="Coklat">Coklat</option>
                                <option value="Susu">Susu</option>
                            </select>
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label for="prod-weight">Product Weight</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="text" 
                                id="prod-weight" 
                                name="prod-weight" 
                                placeholder="(base weight + packaging)"
                            />
                            <p>Gram (g)</p>
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label for="prod-price">Product Price / Pcs</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="number" 
                                id="prod-price" 
                                name="prod-price" 
                                placeholder="Input price (minimum: 1)"
                                min="1"
                            />
                            <p>in Rupiah (Rp)</p>
                        </div>
                    </div>
                    <div className="add-info-form-item">
                        <div className="add-info-form-left">
                            <label for="prod-stock">Stock (per Warehouse)</label>
                        </div>
                        <div className="add-info-form-right">
                            <input 
                                type="number" 
                                id="prod-stock" 
                                name="prod-stock" 
                                placeholder="Input stock (minimum: 0)"
                                min="0"
                                disabled
                            />
                            <p>*Only super admin can fill</p>
                        </div>
                    </div>
                </form>
                <div className="add-desc-form-wrap">
                    <div className="add-desc-form-item">
                        <div className="add-desc-form-left">
                            <label for="prod-desc">Product Description</label>
                        </div>
                        <div className="add-desc-form-right">
                            <textarea 
                                type="text" 
                                rows="8"
                                cols="100"
                                name="prod-desc" 
                                placeholder="High quality Indonesia cacao beans, harvested from the best source possible, offering rich chocolaty taste which will indulge you in satisfaction."
                            >
                            </textarea>
                        </div>
                    </div>
                </div>
                <div className="add-products-submit-wrap d-flex justify-content-end mt-3">
                    <button className="btn btn-warning">Cancel</button>
                    <button className="btn btn-success">Submit</button>
                </div>
            </div>
        </div>
    )
}

export default AdminAddProduct;