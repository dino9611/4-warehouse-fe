import "./styles/EditProduct.css";
import {useLocation} from "react-router-dom";

function EditProduct() {
    let testLocation = useLocation();
    console.log("Dari edit page: ", testLocation.state);

    const {images, id, SKU, name, category, price, total_stock} = testLocation.state;

    return (
        <div>
            <h1>Dibawah ini data2nya</h1>
            <div>
                <h6>{images[0]}</h6>
                <h6>{id}</h6>
                <h6>{SKU}</h6>
                <h6>{name}</h6>
                <h6>{category}</h6>
                <h6>{price}</h6>
                <h6>{total_stock}</h6>
            </div>
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