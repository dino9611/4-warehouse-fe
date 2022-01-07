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

    const DetectPath = () => {
        return useLocation().pathname;
    };

    let currentPath = DetectPath();

    const [ecommToggle, setEcommToggle] = useState(false);

    const [inventoryToggle, setInventoryToggle] = useState(false);
    
    const getRoleId = useSelector((state) => state.auth.role_id);

    const ecommToggleClick = () => {
        setEcommToggle(!ecommToggle)
    };

    const inventoryToggleClick = () => {
        setInventoryToggle(!inventoryToggle)
    };


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
    
                        >
                            Manage Transaction
                            {currentPath.includes(routes.transactions) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                    </div>
                </div>
                <div className="adm-sidebar-dropdown-wrap">
                    <div 
                        className={currentPath.includes(routes.stockRequest) ? 
                            "adm-sidebar-item-wrap sidebar-active" 
                            : 
                            "adm-sidebar-item-wrap"
                        }
                        onClick={inventoryToggleClick}
                    >
                        <div className="adm-sidebar-item-label">
                            <div className="adm-inventory-icon" />
                            <h6>Inventory</h6>
                        </div>
                        <div className="adm-toggle-icon" style={{transform: inventoryToggle ? "rotate(-180deg)" : "rotate(0deg)"}} />
                    </div>
                    <div 
                        className="adm-sidebar-dropdown-menu"
                        style={{
                            height: inventoryToggle ? "100%" : 0, 
                            paddingTop: inventoryToggle ? "1rem" : 0,
                        }}
                    >
                        <Link 
                            to={routes.stockRequest}
                            className="link-no-decoration"
                            style={{
                                color: currentPath.includes(routes.stockRequest) ? "#FCB537" : null, 
                                fontSize: inventoryToggle ? "0.75rem" : 0,
                                marginLeft: inventoryToggle ? 0 : "-20%",
                                marginTop: inventoryToggle ? 0 : "-10%",
                                opacity: inventoryToggle ? 1 : 0, 
                                zIndex: inventoryToggle ? 1 : -1
                            }}
    
                        >
                            Stock Request
                            {currentPath.includes(routes.stockRequest) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                        {/* <Link //? Fitur stock opname utk warehouse admin blm ada
                            to={routes.stockOpname} className="link-no-decoration"
                            className="link-no-decoration"
                            style={{
                                color: currentPath.includes(routes.stockOpname) ? "#FCB537" : null,
                                marginLeft: inventoryToggle ? 0 : "-20%",
                                fontSize: inventoryToggle ? "0.75rem" : 0,
                                marginTop: inventoryToggle ? 0 : "-10%",
                                opacity: inventoryToggle ? 1 : 0, 
                                zIndex: inventoryToggle ? 1 : -1
                            }}
    
                        >
                            Manage Transaction
                            {currentPath.includes(routes.stockOpname) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link> */}
                    </div>
                </div>
                {getRoleId === 1 ?
                    <>
                        <Link 
                            to={routes.warehouses} 
                            className={currentPath.includes(routes.warehouses) ? 
                                "link-no-decoration adm-sidebar-item-wrap sidebar-active" 
                                : 
                                "link-no-decoration adm-sidebar-item-wrap"
                            }
    
                        >
                            <div className="adm-sidebar-item-label">
                                <div className="adm-warehouse-icon" />
                                <h6>Manage Warehouse</h6>
                            </div>
                            {currentPath.includes(routes.warehouses) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                        <Link 
                            to={routes.manageAdmin} 
                            className={currentPath.includes(routes.manageAdmin) ? 
                                "link-no-decoration adm-sidebar-item-wrap sidebar-active" 
                                : 
                                "link-no-decoration adm-sidebar-item-wrap"
                            }
    
                        >
                            <div className="adm-sidebar-item-label">
                                <div className="adm-admins-icon" />
                                <h6>Manage Admin</h6>
                            </div>
                            {currentPath.includes(routes.manageAdmin) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                    </>
                    :
                    null
                }
            </div>
            <div className="adm-sidebar-foot-wrap">
                Test
            </div>
        </div>
    );
}

export default AdminSideBar;