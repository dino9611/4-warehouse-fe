import React, { useEffect, useState, useRef } from 'react';
import "./styles/AdminSideBar.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
  } from "react-router-dom";
import { useSelector } from "react-redux";
import {FiHome} from "react-icons/fi";
import logoWhite from "../../assets/logo-footer.svg";
import chevronDown from "../../assets/components/Chevron-Down-White.svg";

function AdminSideBar(props) {
    const {routes} = props;
    console.log("sidebar", routes);

    const DetectPath = () => {
        return useLocation().pathname;
    };

    console.log("sidebar 23", DetectPath());

    let currentPath = DetectPath();

    const [navValue, setNavValue] = useState("dashboard");

    const [ecommToggle, setEcommToggle] = useState(false);

    const activateNav = (event) => {
        let selectedValue = event.target.innerText.toLowerCase();
        setNavValue(selectedValue);
    };

    const ecommToggleClick = () => {
        setEcommToggle(!ecommToggle)
    };

    const getRoleId = useSelector((state) => state.auth.role_id);

    // ? Testing klo page nya lg sesuai url, text button akan ter-higlight bold putih (blm berhasil)
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
    // ? END OF SECTION

    return (
        <div className="adm-sidebar-main-wrap">
            <div className="adm-sidebar-brand-wrap">
                <img src={logoWhite} alt="The-Local-Logo"/>
            </div>
            <div className="adm-sidebar-list-wrap">
                <Link 
                    to={routes.dashboard} 
                    className={currentPath.includes(routes.dashboard) ? 
                        "link-no-decoration adm-sidebar-item-wrap sidebar-active" 
                        : 
                        "link-no-decoration adm-sidebar-item-wrap"
                    }
                    onClick={(event) => activateNav(event)}
                >
                    <div className="adm-sidebar-item-label">
                        <div className="adm-dashboard-icon" />
                        <h6>Dashboard</h6>
                    </div>
                    {currentPath.includes(routes.dashboard) ? <div className="adm-sidebar-active-nav" /> : null}
                </Link>
                <div className="adm-sidebar-dropdown-wrap">
                    <div 
                        className={(currentPath.includes(routes.manageProduct) ||  currentPath.includes(routes.transactions)) ? 
                            "adm-sidebar-item-wrap sidebar-active" 
                            : 
                            "adm-sidebar-item-wrap"
                        }
                        onClick={ecommToggleClick}
                    >
                        <div className="adm-sidebar-item-label">
                            <div className="adm-ecommerce-icon" />
                            <h6>eCommerce</h6>
                        </div>
                        <div className="adm-toggle-icon" style={{transform: ecommToggle ? "rotate(-180deg)" : "rotate(0deg)"}} />
                    </div>
                    <div 
                        className="adm-sidebar-dropdown-menu"
                        style={{
                            height: ecommToggle ? "100%" : 0, 
                            paddingTop: ecommToggle ? "1rem" : 0,
                        }}
                    >
                        <Link 
                            to={routes.manageProduct}
                            className="link-no-decoration"
                            style={{
                                color: currentPath.includes(routes.manageProduct) ? "#FCB537" : null, 
                                fontSize: ecommToggle ? "0.75rem" : 0,
                                marginLeft: ecommToggle ? 0 : "-20%",
                                marginTop: ecommToggle ? 0 : "-10%",
                                opacity: ecommToggle ? 1 : 0, 
                                zIndex: ecommToggle ? 1 : -1
                            }}
                            onClick={(event) => activateNav(event)}
                        >
                            Manage Products
                            {currentPath.includes(routes.manageProduct) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                        <Link 
                            to={routes.transactions} className="link-no-decoration"
                            className="link-no-decoration"
                            style={{
                                color: currentPath.includes(routes.transactions) ? "#FCB537" : null,
                                marginLeft: ecommToggle ? 0 : "-20%",
                                fontSize: ecommToggle ? "0.75rem" : 0,
                                marginTop: ecommToggle ? 0 : "-10%",
                                opacity: ecommToggle ? 1 : 0, 
                                zIndex: ecommToggle ? 1 : -1
                            }}
                            onClick={(event) => activateNav(event)}
                        >
                            Manage Transaction
                            {currentPath.includes(routes.transactions) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                    </div>
                </div>
                {/* <Link to={routes.manageProduct} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap"
                        // tabIndex="0" 
                        // ref={divRef2} 
                        // onClick={(event) => testClick(event, divRef2)} 
                        // onBlur={(event) => remove(event, divRef2)}
                    >
                        <div className="adm-ecommerce-icon"></div>
                        <h6>eCommerce</h6>
                    </div>
                </Link>
                <Link to={routes.transactions} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h6>Manage Transaction</h6>
                    </div>
                </Link> */}
                {/* Fitur stock opname utk warehouse admin blm ada */}
                {/* <Link to={routes.stockOpname} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h6>Stock Opname</h6>
                    </div>
                </Link> */}
                <Link to={routes.warehouses} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <div className="adm-inventory-icon" />
                        <h6>Inventory</h6>
                    </div>
                </Link>
                <Link to={routes.stockRequest} className="link-no-decoration">
                    <div className="adm-sidebar-item-wrap">
                        <FiHome className="adm-sidebar-icon"/>
                        <h6>Stock Request</h6>
                    </div>
                </Link>
                {getRoleId === 1 ?
                    <>
                        <Link to={routes.warehouses} className="link-no-decoration">
                            <div className="adm-sidebar-item-wrap">
                                <div className="adm-warehouse-icon" />
                                <h6>Manage Warehouse</h6>
                            </div>
                        </Link>
                        <Link to={routes.manageAdmin} className="link-no-decoration">
                            <div className="adm-sidebar-item-wrap">
                                <div className="adm-admins-icon" />
                                <h6>Manage Admin</h6>
                            </div>
                        </Link>
                    </>
                    :
                    null
                }
            </div>
        </div>
    );
}

export default AdminSideBar;