import "./styles/AdminSideBar.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import {FiHome} from "react-icons/fi";
import { useRef } from "react";

function AdminSideBar(props) {
    const {routes} = props;

    const divRef1 = useRef();
    const divRef2 = useRef();
    const divRef3 = useRef();

    const testClick = (event, ref) => {
        // console.log(event);
        // console.log(ref.current);
        let element = ref.current;
        element.classList.add("test-add");
    };

    const remove = (event, ref) => {
        // console.log(event);
        // console.log(ref.current);
        let element = ref.current;
        element.classList.remove("test-add");
    };

    return (
        <div className="adm-sidebar-main-wrap">
            <div className="adm-sidebar-brand-wrap">
                <h2>The Local</h2>
            </div>
            <div className="adm-sidebar-list-wrap">
                <Link to={routes.dashboard} className="link-no-decoration">
                        <div className="adm-sidebar-item-wrap" 
                            tabIndex="0" 
                            ref={divRef1} 
                            onClick={(event) => testClick(event, divRef1)} 
                            // onBlur={(event) => remove(event, divRef1)}
                        >
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Dashboard</h5>
                    </div>
                </Link>
                <Link to={routes.manageProduct} className="link-no-decoration">
                        <div className="adm-sidebar-item-wrap" 
                            tabIndex="0" 
                            ref={divRef2} 
                            onClick={(event) => testClick(event, divRef2)} 
                            // onBlur={(event) => remove(event, divRef2)}
                        >
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Manage Product</h5>
                    </div>
                </Link>
                <Link to={routes.editProduct} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Edit Product</h5>
                    </div>
                </Link>
                <Link to={routes.transactions} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Manage Transaction</h5>
                    </div>
                </Link>
                <Link to={routes.warehouses} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Manage Warehouse</h5>
                    </div>
                </Link>
                <Link to={routes.stockRequest} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Stock Request</h5>
                    </div>
                </Link>
                <Link to={routes.manageAdmin} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h5>Manage Admin</h5>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default AdminSideBar;