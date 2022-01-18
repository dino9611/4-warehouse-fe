import React, { useState } from 'react';
import "./styles/AdminSideBar.css";
<<<<<<< HEAD
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { useRef } from "react";
=======
import { Link, useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
>>>>>>> origin/develop
import logoWhite from "../../assets/logo-footer.svg";
import { logoutAction } from "../../redux/actions";
import profileIcon from "../../assets/profpic.svg";

function AdminSideBar(props) {
  const { routes } = props;

<<<<<<< HEAD
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
        <img src={logoWhite} alt="The-Local-Logo" />
      </div>
      <div className="adm-sidebar-list-wrap">
        <Link to={routes.dashboard} className="link-no-decoration">
          <div
            className="adm-sidebar-item-wrap"
            tabIndex="0"
            ref={divRef1}
            onClick={(event) => testClick(event, divRef1)}
            // onBlur={(event) => remove(event, divRef1)}
          >
            <FiHome className="adm-sidebar-icon" />
            <h5>Dashboard</h5>
          </div>
        </Link>
        <Link to={routes.manageProduct} className="link-no-decoration">
          <div
            className="adm-sidebar-item-wrap"
            tabIndex="0"
            ref={divRef2}
            onClick={(event) => testClick(event, divRef2)}
            // onBlur={(event) => remove(event, divRef2)}
          >
            <FiHome className="adm-sidebar-icon" />
            <h5>Manage Product</h5>
          </div>
        </Link>
        <Link to={routes.transactions} className="link-no-decoration">
          <div className="adm-sidebar-item-wrap">
            <FiHome className="adm-sidebar-icon" />
            <h5>Manage Transaction</h5>
          </div>
        </Link>
        <Link to={routes.stockOpname} className="link-no-decoration">
          <div className="adm-sidebar-item-wrap">
            <FiHome className="adm-sidebar-icon" />
            <h5>Stock Opname</h5>
          </div>
        </Link>
        <Link to={routes.stockRequest} className="link-no-decoration">
          <div className="adm-sidebar-item-wrap">
            <FiHome className="adm-sidebar-icon" />
            <h5>Stock Request</h5>
          </div>
        </Link>
        <Link to={routes.warehouses} className="link-no-decoration">
          <div className="adm-sidebar-item-wrap">
            <FiHome className="adm-sidebar-icon" />
            <h5>Manage Warehouse</h5>
          </div>
        </Link>
        <Link to={routes.manageAdmin} className="link-no-decoration">
          <div className="adm-sidebar-item-wrap">
            <FiHome className="adm-sidebar-icon" />
            <h5>Manage Admin</h5>
          </div>
        </Link>
        <Link to={routes.logRequest} className="link-no-decoration">
          <div className="adm-sidebar-item-wrap">
            <FiHome className="adm-sidebar-icon" />
            <h5>Log Request</h5>
          </div>
        </Link>
      </div>
    </div>
  );
=======
    const DetectPath = () => {
        return useLocation().pathname;
    };

    let currentPath = DetectPath();

    const [ecommToggle, setEcommToggle] = useState(false);

    const [inventoryToggle, setInventoryToggle] = useState(false);

    const getAuthData = useSelector((state) => state.auth);

    const {role_id, username, warehouse_name} = getAuthData;

    const dispatch = useDispatch();

    let history = useHistory(); //* Utk redirect ke homepage stlh logout

    const logoutRedirect = () => history.push("/"); //* Utk redirect ke homepage stlh logout

    const onLogout = () => {
        localStorage.removeItem("token");
        dispatch(logoutAction());
        logoutRedirect();
    };

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
                            {role_id === 2 ? "Product List" : "Manage Products"}
                            {currentPath.includes(routes.manageProduct) ? <div className="adm-sidebar-active-nav" /> : null}
                        </Link>
                        <Link 
                            to={routes.transactions}
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
                {role_id === 2 ?
                    <div className="adm-sidebar-dropdown-wrap">
                        <div 
                            className={(currentPath.includes(routes.stockRequest) ||  currentPath.includes(routes.manageStock)) ? 
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
                            <Link //? Fitur stock opname utk warehouse admin blm ada
                                to={routes.manageStock}
                                className="link-no-decoration"
                                style={{
                                    color: currentPath.includes(routes.manageStock) ? "#FCB537" : null,
                                    marginLeft: inventoryToggle ? 0 : "-20%",
                                    fontSize: inventoryToggle ? "0.75rem" : 0,
                                    marginTop: inventoryToggle ? 0 : "-10%",
                                    opacity: inventoryToggle ? 1 : 0, 
                                    zIndex: inventoryToggle ? 1 : -1
                                }}
        
                            >
                                Manage Stock
                                {currentPath.includes(routes.manageStock) ? <div className="adm-sidebar-active-nav" /> : null}
                            </Link>
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
                        </div>
                    </div>
                    :
                    null
                }
                {role_id === 1 ?
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
                <div className="adm-sidebar-foot-profile">
                    <div className="adm-sidebar-foot-profile-pic">
                        <img src={profileIcon} alt="admin-profpic" />
                    </div>
                    <div className="adm-sidebar-foot-profile-info">
                        <div>{username}</div>
                        <div>{role_id === 1 ? "Super Admin" : "Warehouse Admin"}</div>
                        {warehouse_name ? <div>{warehouse_name}</div> : null}
                    </div>
                </div>
                <div className="adm-sidebar-foot-logout">
                    <div className="adm-logout-icon" />
                    <button onClick={onLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
>>>>>>> origin/develop
}

export default AdminSideBar;
