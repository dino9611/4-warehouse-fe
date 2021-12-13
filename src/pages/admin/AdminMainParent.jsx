import "./styles/AdminMainParent.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import ManageProduct from "./ManageProduct";

const routePath = {
    dashboard: "/admin/dashboard",
    manageProduct: "/admin/manage-product",
    addProduct: "/admin/manage-product/add",
    editProduct: "/admin/manage-product/edit",
    transactions: "/admin/manage-transaction",
    warehouses: "/admin/manage-warehouse",
    stockRequest: "/admin/stock-request",
    manageAdmin: "/admin/manage-admin",
}

const routes = [
    {
      path: routePath.dashboard,
      exact: true,
      main: () => <div>Belum ada page dashboard</div>
    },
    {
      path: routePath.manageProduct,
      exact: true,
      main: () => <ManageProduct />
    },
    {
      path: routePath.addProduct,
      exact: true,
      main: () => <div>Belum ada page add product</div>
    },
    {
      path: routePath.editProduct,
      exact: true,
      main: () => <div>Belum ada page edit product</div>
    },
    {
      path: routePath.transactions,
      exact: true,
      main: () => <div>Belum ada page manage transaction</div>
    },
    {
      path: routePath.warehouses,
      exact: true,
      main: () => <div>Belum ada page manage warehouse</div>
    },
    {
      path: routePath.stockRequest,
      exact: true,
      main: () => <div>Belum ada page stock request</div>
    },
    {
      path: routePath.manageAdmin,
      exact: true,
      main: () => <div>Belum ada page manage admin</div>
    },
  ];

function AdminMainParent() {


    return (
        <Router>
            <div className="adm-main-parent-wrap">
                <AdminSideBar routes={routePath} className="control-zIndex"/>
                <div className="adm-main-content-wrap">
                    <AdminNavbar/>
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                children={<route.main />}
                            />
                        ))}
                    </Switch>
                </div>
            </div>
        </Router>
    )
}

export default AdminMainParent;