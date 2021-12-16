import "./styles/EditProduct.css";
import {useLocation} from "react-router-dom";

function EditProduct() {
    let testLocation = useLocation();
    console.log("Dari edit page: ", testLocation.state);

    return (
        <div>
            <h1>Dibawah ini data2nya</h1>
            <div>

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