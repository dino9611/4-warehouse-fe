import "./styles/AdminMainParent.css";
import {
    Switch,
    Route
} from "react-router-dom";
import AdminSideBar from "../../components/admin/AdminSideBar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import ManageProduct from "./ManageProduct";
import AdminAddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ManageWarehouse from "./ManageWarehouse";
import ManageAdmin from "./ManageAdmin";
import HomeDashboard from "./HomeDashboard";
import ManageTransaction from "./ManageTransaction";

const routePath = {
    dashboard: "/admin/dashboard",
    manageProduct: "/admin/manage-product",
    addProduct: "/admin/manage-product/add",
    editProduct: "/admin/manage-product/edit",
    stockOpname: "/admin/stock-opname",
    transactions: "/admin/manage-transaction",
    warehouses: "/admin/manage-warehouse",
    stockRequest: "/admin/stock-request",
    manageAdmin: "/admin/manage-admin",
}

const routes = [
    {
      path: routePath.dashboard,
      exact: true,
      main: () => <HomeDashboard />
    },
    {
      path: routePath.manageProduct,
      exact: true,
      main: () => <ManageProduct />
    },
    {
      path: routePath.addProduct,
      exact: true,
      main: () => <AdminAddProduct />
    },
    {
      path: routePath.editProduct,
      exact: true,
      main: () => <EditProduct />
    },
    {
      path: routePath.stockOpname,
      exact: true,
      main: () => <div>Belum ada page stock opname</div>
    },
    {
      path: routePath.transactions,
      exact: true,
      main: () => <ManageTransaction />
    },
    {
      path: routePath.warehouses,
      exact: true,
      main: () => <ManageWarehouse />
    },
    {
      path: routePath.stockRequest,
      exact: true,
      main: () => <div>Belum ada page stock request</div>
    },
    {
      path: routePath.manageAdmin,
      exact: true,
      main: () => <ManageAdmin />
    },
  ];

function AdminMainParent() {
    return (
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
    )
}

export default AdminMainParent;