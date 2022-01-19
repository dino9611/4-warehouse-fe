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
import { useSelector } from "react-redux";
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AdminFetchFailed from "../../components/admin/AdminFetchFailed";
import AdminSkeletonSimple from "../../components/admin/AdminSkeletonSimple";
import NotFoundPage from "../non-user/NotFoundV1";
import Select from "react-select";
import { debounce } from "throttle-debounce";
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

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        height: "46px",
        boxShadow: state.isFocused ? "none" : "none",
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color: "#CACACA"
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#fff' : '#5A5A5A'
    }),
}

function ManageWarehouse() {
    const [loadData, setLoadData] = useState(true); //* State kondisi utk masking tampilan client saat state sdg fetch data
    
    const [errorFetch, setErrorFetch] = useState(false); //* State kondisi utk masking tampilan client ketika fetch data error

    const [submitLoad, setSubmitLoad] = useState(false); //* State kondisi loading ketika submit button ter-trigger, hingga proses selesai

    const [warehouses, setWarehouses] = useState([]);

    const [toggleModal, setToggleModal] = useState(false);

    const [addWhInput, setAddWhInput] = useState({ //* Utk bawa input data warehouse ke BE
        warehouse_name: "",
        warehouse_address: "",
        warehouse_latitude: "",
        warehouse_longitude: ""
    });

    const [dataProvince, setDataProvince] = useState([]);

    const [pickProvince, setPickProvince] = useState("");

    const [dataCity, setDataCity] = useState([]);

    const [pickCity, setPickCity] = useState("");

    const charMax = 45;

    const {warehouse_name, warehouse_address, warehouse_latitude, warehouse_longitude} = addWhInput;

    // FETCH & useEFFECT SECTION
    const getRoleId = useSelector((state) => state.auth.role_id);
    
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

    const fetchProvince = async () => { //* Utk render selection data province rajaongkir
        try {
            const res = await axios.get(`${API_URL}/warehouse/province`);
            setDataProvince(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageWarehouse");
            console.log(error);
            setErrorFetch(true);
        }
    };

    const fetchCity = async () => { //* Utk render selection data city rajaongkir
        try {
            const res = await axios.get(`${API_URL}/warehouse/city/${pickProvince.province}`);
            setDataCity(res.data);
        } catch (error) {
            errorToast("Server Error, from ManageWarehouse");
            console.log(error);
            setErrorFetch(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchWarehouse();
            await setLoadData(false);
        };
        fetchData();
    }, []);

    useEffect(() => { //* Get selection data province ketika buka modal create warehouse
        if (!dataProvince.length && toggleModal) {
            fetchProvince();
        }
    }, [toggleModal]);

    useEffect(() => { //* Get selection data city ketika province sudah dipilih
        if (pickProvince && toggleModal) {
            fetchCity();
        }
    }, [pickProvince]);

    const breadcrumbs = [
        <Link to="/admin/" key="1" className="link-no-decoration adm-breadcrumb-modifier">
          Dashboard
        </Link>,
        <Typography key="2" color="#070707" style={{fontSize: "0.75rem", margin: "auto"}}>
          Manage Warehouse
        </Typography>,
    ];

    // HANDLER FUNCTIONS SECTION
    const provinceChange = (pickProvince) => {
        setPickCity(""); //* Biar klo close modal saat value pickCity terisi kemudian ganti province, value pickCity dibersihkan
        setPickProvince(pickProvince);
    };

    const cityChange = (pickCity) => {
        setPickCity(pickCity);
    };

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
                        onChange={addWhStringHandler}
                        placeholder="Input the warehouse name"
                        maxLength={charMax}
                        borderRadius={"8px"}
                    />
                    <Textbox
                        type="text"
                        label="Warehouse Address"
                        name="warehouse_address"
                        value={warehouse_address}
                        onChange={addWhStringHandler}
                        placeholder="Input the warehouse address"
                        maxLength={charMax}
                        borderRadius={"8px"}
                    />
                    <label>Province</label>
                    <Select
                        defaultValue={pickProvince}
                        styles={customStyles}
                        placeholder="Select Province"
                        onChange={debounce(250, (pickProvince) => provinceChange(pickProvince))}
                        options={dataProvince}
                        theme={(theme) => ({
                            ...theme,
                            border: "none",
                            borderRadius: "8px",
                            colors: {
                              ...theme.colors,
                              primary: '#B24629',
                              primary25: '#F4F4F4',
                            },
                        })}
                    />
                    <label>City</label>
                    <Select
                        defaultValue={pickCity}
                        styles={customStyles}
                        placeholder="Select City"
                        onChange={(pickCity) => cityChange(pickCity)}
                        options={dataCity}
                        theme={(theme) => ({
                            ...theme,
                            border: "none",
                            borderRadius: "8px",
                            colors: {
                              ...theme.colors,
                              primary: '#B24629',
                              primary25: '#F4F4F4',
                            },
                        })}
                    />
                    <Textbox
                        type="text"
                        label="Address Latitude"
                        name="warehouse_latitude"
                        value={warehouse_latitude}
                        onChange={addWhStringHandler}
                        placeholder="Input address latitude (check on google map)"
                        maxLength={charMax}
                        borderRadius={"8px"}
                    />
                    <Textbox
                        type="text"
                        label="Address Longitude"
                        name="warehouse_longitude"
                        value={warehouse_longitude}
                        onChange={addWhStringHandler}
                        placeholder="Input address longitude (check on google map)"
                        maxLength={charMax}
                        borderRadius={"8px"}
                    />
                    {/* <Textbox
                        type="text"
                        label="Warehouse Geolocation"
                        placeholder="CURRENTLY DISABLED"
                        disabled
                    /> */}
                </div>
                <div className="create-wh-modal-foot">
                    <button onClick={onCloseModal} disabled={submitLoad}>Cancel</button>
                    <button 
                        onClick={onSubmitNewWh} 
                        disabled={!warehouse_name || !warehouse_address || !pickProvince || !pickCity || !warehouse_latitude || !warehouse_longitude || submitLoad}
                    >
                        {submitLoad ? <CircularProgress style={{padding: "0.25rem"}}/> : "Confirm"}
                    </button>
                </div>
            </>
        )
    };

    const onSubmitNewWh = async (event) => { //* Untuk trigger submit button
        event.preventDefault();

        setSubmitLoad(true);
        
        let inputtedNewWh = {
            warehouse_name,
            warehouse_address,
            province_id: pickProvince.province_id,
            province: pickProvince.province,
            city_id: pickCity.city_id,
            city: pickCity.label,
            warehouse_latitude,
            warehouse_longitude
        };

        if (warehouse_name && warehouse_address &&  warehouse_latitude && warehouse_longitude && warehouse_name.length <= charMax && warehouse_address.length <= charMax && warehouse_latitude.length <= charMax && warehouse_longitude.length <= charMax && pickProvince && pickCity) {
            try {
                await axios.post(`${API_URL}/warehouse/add`, inputtedNewWh);
                setAddWhInput((prevState) => {
                    return {...prevState, warehouse_name: "", warehouse_address: "", warehouse_latitude: "", warehouse_longitude: ""}
                });
                setPickProvince("");
                setPickCity("");
                setSubmitLoad(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Create new warehouse success!',
                    text: `${inputtedNewWh.warehouse_name}`,
                    customClass: { //* CSS custom nya ada di AdminMainParent
                        popup: 'adm-swal-popup-override',
                        confirmButton: 'adm-swal-btn-override'
                    },
                    confirmButtonText: 'Continue',
                    confirmButtonAriaLabel: 'Continue'
                  });
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
            errorToast("Please make sure all input filled & all max 45 characters");
        };
    };

    return (
        <>
            {(getRoleId === 1) ?
                <div className="manage-wh-main-wrap">
                    {!loadData ?
                        <>
                            <div className="manage-wh-breadcrumb-wrap">
                                <Stack spacing={2}>
                                    <Breadcrumbs
                                        separator={<NavigateNextIcon fontSize="small" />}
                                        aria-label="manage warehouse breadcrumb"
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
                                                            <StyledTableCell align="left" className="txt-capitalize">{val.address}, {val.province}, {val.city}</StyledTableCell>
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
                :
                <NotFoundPage />
            }
        </>
    )
}

export default ManageWarehouse;


//? CHECKER FUNCTIONS SECTION - Ga jd dipake
// const latitudeCheck = (value) => {
//     let pattern = /[-.]/mig;
//     return pattern.test(value);
// };