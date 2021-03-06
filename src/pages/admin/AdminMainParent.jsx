import "./styles/AdminMainParent.css";
import { Switch, Route } from "react-router-dom";
import AdminSideBar from "../../components/admin/AdminSideBar";
import ManageProduct from "./ManageProduct";
import AdminAddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ManageWarehouse from "./ManageWarehouse";
import ManageAdmin from "./ManageAdmin";
import HomeDashboard from "./HomeDashboard";
import ManageTransaction from "./ManageTransaction";
import AdminTransactionDetail from "./AdminTransactionDetail";
import StockRequest from "./StockRequest";
import LogRequest from "./LogRequest";
import NotFoundPage from "../non-user/NotFoundV1";
import ManageStock from "./ManageStock";

const routePath = {
  dashboard: "/admin/dashboard",
  manageProduct: "/admin/manage-product",
  addProduct: "/admin/manage-product/add",
  editProduct: "/admin/manage-product/edit",
  manageStock: "/admin/manage-stock",
  transactions: "/admin/manage-transaction",
  detailTransaction: "/admin/manage-transaction/detail",
  warehouses: "/admin/manage-warehouse",
  stockRequest: "/admin/stock-request",
  manageAdmin: "/admin/manage-admin",
  logRequest: "/admin/log-request",
};

const routes = [
  {
    path: routePath.dashboard,
    exact: true,
    main: () => <HomeDashboard />,
  },
  {
    path: routePath.manageProduct,
    exact: true,
    main: () => <ManageProduct />,
  },
  {
    path: routePath.addProduct,
    exact: true,
    main: () => <AdminAddProduct />,
  },
  {
    path: routePath.editProduct,
    exact: true,
    main: () => <EditProduct />,
  },
  {
    path: routePath.manageStock,
    exact: true,
    main: () => <ManageStock />,
  },
  {
    path: routePath.transactions,
    exact: true,
    main: () => <ManageTransaction />,
  },
  {
    path: routePath.detailTransaction,
    exact: true,
    main: () => <AdminTransactionDetail />,
  },
  {
    path: routePath.warehouses,
    exact: true,
    main: () => <ManageWarehouse />,
  },
  {
    path: routePath.manageAdmin,
    exact: true,
    main: () => <ManageAdmin />,
  },
  {
    path: routePath.stockRequest,
    exact: true,
    main: () => <StockRequest />,
  },
  {
    path: routePath.logRequest,
    exact: true,
    main: () => <LogRequest />,
  },
  {
    path: "*",
    exact: true,
    main: () => <NotFoundPage />,
  },
];

function AdminMainParent() {
  return (
    <div className="adm-main-parent-wrap">
      <AdminSideBar routes={routePath} className="control-zIndex" />
      <div className="adm-main-content-wrap">
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
  );
}

export default AdminMainParent;
