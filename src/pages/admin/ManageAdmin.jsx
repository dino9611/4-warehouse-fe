import { useState, useEffect } from "react";
import "./styles/ManageAdmin.css";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {API_URL} from "../../constants/api";
import Modal from '../../components/Modal';
import Textbox from "../../components/Textbox";
import Swal from 'sweetalert2';
import { errorToast } from "../../redux/actions/ToastAction";
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSelector } from "react-redux";
import NotFoundPage from "../non-user/NotFoundV1";
import AdminSkeletonSimple from "../../components/admin/AdminSkeletonSimple";
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      border: 0,
      fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        border: 0,
        color: "#5A5A5A"
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#F4F4F4",
    },
    // Show last border
    '&:last-child td, &:last-child th': {
      borderBottom: "1px solid #CACACA"
    },
}));

function ManageAdmin() {
    const [loadData, setLoadData] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [adminList, setAdminList] = useState([]);

    const [warehouses, setWarehouses] = useState([]);

    const [toggleModal, setToggleModal] = useState(false);

    const [showPass, setShowPass] = useState("password"); //* Utk rubah input type form pass pada modal add admin

    const [passToggle, setPassToggle] = useState(false); //* Utk atur showPass pada modal add admin

    const [addAdmInput, setAddAdmInput] = useState({ //* Utk bawa input data new admin ke BE
        new_username: "",
        new_password: "",
        assign_warehouse: 0
      });

    const userCharMax = 45;

    const passCharMax = 70;

    // FETCH & useEFFECT SECTION
    const getRoleId = useSelector((state) => state.auth.role_id);

    const fetchAdminList = async () => { //* Utk render data list admin
        try {
            const res = await axios.get(`${API_URL}/admin/list`);
            setAdminList(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageAdmin - Adm");
            console.log(error);
        }
    };

    const fetchWarehouse = async () => { //* Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            setWarehouses(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageAdmin - Wh");
            console.log(error);
        }
    };

    let {new_username, new_password, assign_warehouse} = addAdmInput;

    useEffect(() => {
        const fetchData = async () => {
            await fetchAdminList();
            await fetchWarehouse();
            await setLoadData(false);
        };
        fetchData();
    }, []);

    const breadcrumbs = [
        <Link to="/admin/" key="1" className="link-no-decoration adm-breadcrumb-modifier">
          Dashboard
        </Link>,
        <Typography key="2" color="#070707" style={{fontSize: "0.75rem", margin: "auto"}}>
          Manage Admin
        </Typography>,
    ];

    // RENDER MODAL CREATE WAREHOUSE
    const modalClick = () => {
        if (!toggleModal) {
            setToggleModal(true);
        } else {
            setToggleModal(false);
        };
    };

    const onCloseModal = () => {
        setToggleModal(false);
        setShowPass("password");
    };

    const showPassHandler = () => {
        setPassToggle(!passToggle);
        if (passToggle) {
          setShowPass("text");
        } else {
          setShowPass("password");
        };
    };

    const addAdmStringHandler = (event) => { //* Utk setState data berbentuk string
        setAddAdmInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const addAdmNumberHandler = (event) => { //* Utk setState data berbentuk number
        setAddAdmInput((prevState) => {
            return { ...prevState, [event.target.name]: parseInt(event.target.value) };
        });
    };

    const AddAdminModal = () => {
        return (
            <>
                <div className="add-adm-modal-head">
                    <h3>Input new admin/warehouse admin data</h3>
                </div>
                <div className="add-adm-modal-body">
                    <Textbox
                        type="text"
                        label="Admin Username"
                        name="new_username"
                        value={new_username}
                        onChange={(event) => addAdmStringHandler(event)}
                        placeholder="Input the new admin username"
                        maxLength={userCharMax}
                    />
                    <div>
                        <Textbox
                            type={showPass}
                            label="Set Password"
                            name="new_password"
                            value={new_password}
                            onChange={(event) => addAdmStringHandler(event)}
                            placeholder="Set the new admin password"
                            maxLength={passCharMax}
                            style={{paddingRight: "30px"}}
                        />
                        <img 
                            src={(showPass === "password") ? ShowPassFalse : ShowPassTrue} 
                            alt="Show-Pass-Icon" 
                            onClick={showPassHandler} 
                        />
                    </div>
                    <div>
                        <label htmlFor="assign_warehouse">Warehouse</label>
                        <select 
                            id="assign_warehouse"
                            name="assign_warehouse" 
                            defaultValue={assign_warehouse}
                            onChange={(event) => addAdmNumberHandler(event)}
                            style={{textTransform: "capitalize"}}
                        >
                            <option value={0} disabled hidden>Select warehouse to assign</option>
                            {warehouses.map((val) => (
                                <option value={val.id} key={`00${val.id}-${val.name}`} style={{textTransform: "capitalize"}}>
                                    {`${val.name} (${val.address})`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="add-adm-modal-foot">
                    <button onClick={onCloseModal}>Cancel</button>
                    <button onClick={onSubmitAddAdm} disabled={!new_username || !new_password || !assign_warehouse}>Confirm</button>
                </div>
            </>
        )
    };

    const onSubmitAddAdm = async (event) => { //* Untuk trigger submit button
        event.preventDefault();
        document.querySelector("div.add-adm-modal-foot > button").disabled = true;
        
        let inputtedAdm = {
            new_username: new_username,
            new_password: new_password,
            assign_warehouse: assign_warehouse
        };

        if (new_username && new_password && assign_warehouse && new_username.length <= userCharMax && new_password.length <= passCharMax) {
            try {
                await axios.post(`${API_URL}/admin/add`, inputtedAdm);
                setAddAdmInput((prevState) => {
                    return {...prevState, new_username: "", new_password: "", assign_warehouse: 0}
                });
                document.querySelector("div.add-adm-modal-foot > button").disabled = false;
                Swal.fire({
                    icon: 'success',
                    title: 'Add new admin/warehouse admin success!',
                    text: `Username: ${inputtedAdm.new_username}`,
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue',
                    confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
                  });
                fetchAdminList();
            } catch (error) {
                console.log(error);
                document.querySelector("div.add-adm-modal-foot > button").disabled = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue',
                    confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
                });
            };
        } else {
            document.querySelector("div.add-adm-modal-foot > button").disabled = false;
            errorToast("Please input all form");
        };
    };

    return (
        <>
            {(getRoleId === 1) ?
                <div className="manage-adm-main-wrap">
                    {!loadData ?
                        <>
                            <div className="manage-adm-breadcrumb-wrap">
                                <Stack spacing={2}>
                                    <Breadcrumbs
                                        separator={<NavigateNextIcon fontSize="small" />}
                                        aria-label="transaction detail breadcrumb"
                                    >
                                        {breadcrumbs}
                                    </Breadcrumbs>
                                </Stack>
                            </div>
                            { (!loadData && errorFetch) ?
                                <AdminFetchFailed />
                                :
                                <>
                                    <div className="manage-adm-header-wrap">
                                        <h4>Manage Admin</h4>
                                        <button onClick={modalClick}>+ Add Admin</button>
                                    </div>
                                    <div className="manage-adm-contents-wrap">
                                        <TableContainer component={Paper} style={{borderRadius: 0, boxShadow: "none"}}>
                                            <Table sx={{ minWidth: "100%" }} aria-label="transaction items detail">
                                                <TableHead style={{backgroundColor: "#FCB537"}}>
                                                    <TableRow>
                                                        <StyledTableCell align="left">User ID</StyledTableCell>
                                                        <StyledTableCell align="left">Username</StyledTableCell>
                                                        <StyledTableCell align="left">Role</StyledTableCell>
                                                        <StyledTableCell align="left">Warehouse ID</StyledTableCell>
                                                        <StyledTableCell align="left">Warehouse Name</StyledTableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {adminList
                                                    .map((val) => (
                                                        <StyledTableRow
                                                        key={`${val.id}-${val.name}`}
                                                        >
                                                            <StyledTableCell 
                                                                align="left" 
                                                                component="th" 
                                                                scope="row" 
                                                                style={{width: "200px"}}
                                                            >
                                                                {val.id}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="left">{val.username}</StyledTableCell>
                                                            <StyledTableCell align="left" className="txt-capitalize">{(val.role_id === 2) ? `${val.role}/Warehouse Admin` : val.role}</StyledTableCell>
                                                            <StyledTableCell align="left" style={{width: "200px"}}>{val.warehouse_id}</StyledTableCell>
                                                            <StyledTableCell align="left">{val.warehouse_name}</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Modal open={toggleModal} close={onCloseModal}>
                                            {AddAdminModal()}
                                        </Modal>
                                    </div>
                                </>
                            }
                        </>
                        :
                        <AdminSkeletonSimple />
                    }
                </div>
                :
                <NotFoundPage />
            }
        </>
    )
}

export default ManageAdmin;