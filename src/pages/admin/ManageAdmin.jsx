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
import Textbox from "../../components/admin/AdmTextbox";
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
import chevronDown from "../../assets/components/Chevron-Down.svg";
import CircularProgress from '@mui/material/CircularProgress';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      border: 0,
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
      fontWeight: 600
    },
    [`&.${tableCellClasses.body}`]: {
        border: 0,
        color: "#5A5A5A",
        fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#F4F4F4",
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
    },
    // Show last border
    '&:last-child td, &:last-child th': {
      borderBottom: "1px solid #CACACA"
    },
}));

function ManageAdmin() {
    const [loadData, setLoadData] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data

    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [submitLoad, setSubmitLoad] = useState(false); //* State kondisi loading ketika submit button ter-trigger, hingga proses selesai

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

    const [toggleDropdown, setToggleDropdown] = useState(false); //* Atur toggle dropdown filter product per page

    const [selectedWhDropdown, setSelectedWhDropdown] = useState("Select Warehouse To Assign"); //* Sebagai placeholder ketika assign warehouse belum dipilih & sudah dipilih

    const [dropdownActiveDetector, setDropdownActiveDetector] = useState(0); //* Utk kondisi klo value terpilih, warna text menyala, klo tidak warna text abu-abu

    // FETCH & useEFFECT SECTION
    const getRoleId = useSelector((state) => state.auth.role_id);

    const fetchAdminList = async () => { //* Utk render data list admin
        try {
            const res = await axios.get(`${API_URL}/admin/list`);
            setAdminList(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageAdmin - Adm");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const fetchWarehouse = async () => { //* Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            setWarehouses(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageAdmin - Wh");
            console.log(error);
            setErrorFetch(true);
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

    // RENDER MODAL ADD ADMIN
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
                        borderRadius={"8px"}
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
                            borderRadius={"8px"}
                        />
                        <img 
                            src={(showPass === "password") ? ShowPassFalse : ShowPassTrue} 
                            alt="Show-Pass-Icon" 
                            onClick={showPassHandler} 
                        />
                    </div>
                    <div className="add-adm-modal-body-dropdown">
                        <label>Warehouse</label>
                        <div className="manage-adm-dropdown-wrap">
                            <button 
                                className="manage-adm-dropdown-btn" 
                                style={{color: dropdownActiveDetector? "#070707" : "#CACACA"}}
                                onClick={dropdownClick}
                                onBlur={dropdownBlur}
                            >
                                {selectedWhDropdown}
                                <img 
                                    src={chevronDown} 
                                    style={{
                                        transform: toggleDropdown ? "rotate(-180deg)" : "rotate(0deg)"
                                    }}
                                    alt="Dropdown-Arrow"
                                />
                            </button>
                            <ul 
                                className="manage-adm-dropdown-menu" 
                                style={{
                                    transform: toggleDropdown ? "translateY(0)" : "translateY(-5px)",
                                    opacity: toggleDropdown ? 1 : 0,
                                    zIndex: toggleDropdown ? 100 : -10,
                                }}
                            >
                                {warehouses?.map((val, index) => (
                                    parseInt(val.id) === addAdmInput.assign_warehouse ? //* parseInt karena yg dri BE berbentuk string
                                    <li 
                                        value={val.id} 
                                        className="manage-adm-dropdown-selected"
                                        key={index}
                                    >
                                        {val.name}
                                    </li> 
                                    : 
                                    <li
                                        value={val.id}
                                        onClick={(event) => selectWarehouse(event, val.name)}
                                        key={index}
                                    >
                                        {val.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="add-adm-modal-foot">
                    <button onClick={onCloseModal} disabled={submitLoad}>Cancel</button>
                    <button 
                        onClick={onSubmitAddAdm} 
                        disabled={!new_username || !new_password || !assign_warehouse || submitLoad}
                    >
                        {submitLoad ? <CircularProgress style={{padding: "0.25rem"}}/> : "Confirm"}
                    </button>
                </div>
            </>
        )
    };

    // RENDER DROPDOWN SELECT WAREHOUSE ON ADD ADMIN MODAL
    const dropdownClick = () => { //* Buka tutup menu dropdown
        setToggleDropdown(!toggleDropdown);
    };

    const dropdownBlur = () => { //* Tutup menu dropdown ketika click diluar wrap menu dropdown
        setToggleDropdown(false)
    };

    const selectWarehouse = (event, warehouseName) => { //* Atur value warehouse yg di-assign & behavior dropdown stlh action terjadi
        setAddAdmInput((prevState) => {
            return { ...prevState, assign_warehouse: parseInt(event.target.value) };
        });
        setSelectedWhDropdown(warehouseName);
        setToggleDropdown(false);
        setDropdownActiveDetector(dropdownActiveDetector + 1);
        fetchWarehouse();
    };

    const userCharMax = 45;

    const passCharMax = 70;

    // CLICK/SUBMIT FUNCTION SECTION
    const onSubmitAddAdm = async (event) => { //* Untuk trigger submit button
        event.preventDefault();

        setSubmitLoad(true);
        
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
                setSelectedWhDropdown("Select Warehouse To Assign");
                setDropdownActiveDetector(0);
                setSubmitLoad(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Add new admin/warehouse admin success!',
                    text: `Username: ${inputtedAdm.new_username}`,
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override',
                        confirmButton: 'adm-swal-btn-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue'
                  });
                fetchAdminList();
                fetchWarehouse();
            } catch (error) {
                console.log(error);
                setSubmitLoad(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override',
                        confirmButton: 'adm-swal-btn-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue'
                });
            };
        } else {
            setSubmitLoad(false);
            errorToast("Please input all form, username (max 45 char), & pass (max 75 char)");
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
                                        aria-label="manage admin breadcrumb"
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
                                                        <StyledTableRow key={`${val.id}-${val.name}`}>
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