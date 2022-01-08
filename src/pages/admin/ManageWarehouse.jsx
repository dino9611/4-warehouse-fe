import { useState, useEffect } from "react";
import "./styles/ManageWarehouse.css";
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
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";
import AdminSkeletonSimple from "../../components/admin/AdminSkeletonSimple";

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

function ManageWarehouse() {
    const [loadData, setLoadData] = useState(true);
    
    const [errorFetch, setErrorFetch] = useState(false);

    const [warehouses, setWarehouses] = useState([]);

    const [toggleModal, setToggleModal] = useState(false);

    const [addWhInput, setAddWhInput] = useState({ //* Utk bawa input data warehouse ke BE
        warehouse_name: "",
        warehouse_address: "",
        // warehouse_lat: "",
        // warehouse_long: ""
    });

    const charMax = 45;

    // FETCH & useEFFECT SECTION
    const fetchWarehouse = async () => { //* Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            res.data.forEach((val) => {
                val.latitude = parseFloat(val.latitude);
                val.longitude = parseFloat(val.longitude);
            });
            setWarehouses(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageWarehouse");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const {warehouse_name, warehouse_address} = addWhInput;

    useEffect(() => {
        const fetchData = async () => {
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
          Manage Warehouse
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
    };

    const addWhStringHandler = (event) => { //* Utk setState data berbentuk string
        setAddWhInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const createWhModal = () => {
        return (
            <>
                <div className="create-wh-modal-head">
                    <h3>Input new warehouse information</h3>
                </div>
                <div className="create-wh-modal-body">
                    <Textbox
                        type="text"
                        label="Warehouse Name"
                        name="warehouse_name"
                        value={warehouse_name}
                        onChange={(event) => addWhStringHandler(event)}
                        placeholder="Input the warehouse name"
                        maxLength={charMax}
                    />
                    <Textbox
                        type="text"
                        label="Warehouse Address"
                        name="warehouse_address"
                        value={warehouse_address}
                        onChange={(event) => addWhStringHandler(event)}
                        placeholder="Input the warehouse address"
                        maxLength={charMax}
                    />
                    {/* <Textbox
                        type="text"
                        label="Warehouse Geolocation"
                        placeholder="CURRENTLY DISABLED"
                        disabled
                    /> */}
                </div>
                <div className="create-wh-modal-foot">
                    <button onClick={onSubmitNewWh} disabled={!warehouse_name || !warehouse_address}>Confirm</button>
                    <button onClick={onCloseModal}>Cancel</button>
                </div>
            </>
        )
    };

    const onSubmitNewWh = async (event) => { //* Untuk trigger submit button
        event.preventDefault();
        document.querySelector("div.create-wh-modal-foot > button").disabled = true;
        
        let inputtedNewWh = {
            warehouse_name: warehouse_name,
            warehouse_address: warehouse_address,
        };

        if (warehouse_name && warehouse_address && warehouse_name.length <= charMax && warehouse_address.length <= charMax) {
            try {
                await axios.post(`${API_URL}/warehouse/add`, inputtedNewWh);
                setAddWhInput((prevState) => {
                    return {...prevState, warehouse_name: "", warehouse_address: ""}
                });
                document.querySelector("div.create-wh-modal-foot > button").disabled = false;
                Swal.fire({
                    icon: 'success',
                    title: 'Create new warehouse success!',
                    text: `${inputtedNewWh.warehouse_name}`,
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue',
                    confirmButtonClass: 'adm-swal-btn-override', //* CSS custom nya ada di AdminMainParent
                  });
                fetchWarehouse();
            } catch (err) {
                console.log(err);
                document.querySelector("div.create-wh-modal-foot > button").disabled = false;
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
            document.querySelector("div.create-wh-modal-foot > button").disabled = false;
            errorToast("Please make sure all input filled & below 46 characters");
        };
    };

    return (
        <div className="manage-wh-main-wrap">
            {!loadData ?
                <>
                    <div className="manage-wh-breadcrumb-wrap">
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
                            <div className="manage-wh-header-wrap">
                                <h4>Manage Warehouse</h4>
                                <button onClick={modalClick}>+ Create Warehouse</button>
                            </div>
                            <div className="manage-wh-contents-wrap">
                                <TableContainer component={Paper} style={{borderRadius: 0, boxShadow: "none"}}>
                                    <Table sx={{ minWidth: "100%" }} aria-label="transaction items detail">
                                        <TableHead style={{backgroundColor: "#FCB537"}}>
                                            <TableRow>
                                                <StyledTableCell align="left">Warehouse ID</StyledTableCell>
                                                <StyledTableCell align="left">Name</StyledTableCell>
                                                <StyledTableCell align="left">Address</StyledTableCell>
                                                <StyledTableCell align="left">Geolocation</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {warehouses
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
                                                    <StyledTableCell align="left" className="txt-capitalize">{val.name}</StyledTableCell>
                                                    <StyledTableCell align="left" className="txt-capitalize">{val.address}</StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        lat: {val.latitude}
                                                        <br />
                                                        long: {val.longitude}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Modal open={toggleModal} close={onCloseModal}>
                                    {createWhModal()}
                                </Modal>
                            </div>
                        </>       
                    }
                </>
                :
                <AdminSkeletonSimple />
            } 
        </div>
    )
}

export default ManageWarehouse;