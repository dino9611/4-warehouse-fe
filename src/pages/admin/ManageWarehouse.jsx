import { useState, useEffect } from "react";
import "./styles/ManageWarehouse.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import {API_URL} from "../../constants/api";
import Modal from '../../components/Modal';
import Textbox from "../../components/Textbox";
import Swal from 'sweetalert2';
import { successToast, errorToast } from "../../redux/actions/ToastAction";

function ManageWarehouse() {
    const [warehouses, setWarehouses] = useState([]);

    const [toggleModal, setToggleModal] = useState(false);

    const [addWhInput, setAddWhInput] = useState({ // Utk bawa input data warehouse ke BE
        warehouse_name: "",
        warehouse_address: "",
        // warehouse_lat: "",
        // warehouse_long: ""
      });

    const fetchWarehouse = async () => { // Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            res.data.forEach((val) => {
                val.latitude = parseFloat(val.latitude);
                val.longitude = parseFloat(val.longitude);
            });
            setWarehouses(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const {warehouse_name, warehouse_address} = addWhInput;

    useEffect(() => {
        fetchWarehouse();
    }, []);

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

    const addWhStringHandler = (event) => { // Utk setState data berbentuk string
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
                    />
                    <Textbox
                        type="text"
                        label="Warehouse Address"
                        name="warehouse_address"
                        value={warehouse_address}
                        onChange={(event) => addWhStringHandler(event)}
                        placeholder="Input the warehouse address"
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

    const onSubmitNewWh = async (event) => { // Untuk trigger submit button
        event.preventDefault();
        document.querySelector("div.create-wh-modal-foot > button").disabled = true;
        
        let inputtedNewWh = {
            warehouse_name: warehouse_name,
            warehouse_address: warehouse_address,
        };

        if (warehouse_name && warehouse_address) {
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
                    confirmButtonColor: '#B24629',
                  });
                fetchWarehouse();
            } catch (err) {
                console.log(err);
                document.querySelector("div.create-wh-modal-foot > button").disabled = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    confirmButtonColor: '#B24629',
                  });
            };
        } else {
            document.querySelector("div.create-wh-modal-foot > button").disabled = false;
            errorToast("Pastikan terisi semua (discount price tidak wajib)");
        };
    };

    return (
        <div className="manage-wh-main-wrap">
            <div className="manage-wh-header-wrap">
                <h4>Manage Warehouse</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="manage-wh-contents-wrap">
                <TableContainer component={Paper} style={{borderRadius: "12px"}}>
                    <div className="manage-wh-add-wrap">
                        <button onClick={modalClick}>+ Create Warehouse</button>
                    </div>
                    <Table sx={{ minWidth: 650 }} aria-label="warehouse table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Warehouse ID</TableCell>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Address</TableCell>
                                <TableCell align="left">Geolocation</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {warehouses
                            .map((val) => (
                                <TableRow
                                key={`${val.id}-${val.name}`}
                                >
                                    <TableCell 
                                        align="left" 
                                        component="th" 
                                        scope="row" 
                                        style={{width: "200px"}}
                                    >
                                        {val.id}
                                    </TableCell>
                                    <TableCell align="left" className="txt-capitalize">{val.name}</TableCell>
                                    <TableCell align="left" className="txt-capitalize">{val.address}</TableCell>
                                    <TableCell align="left">
                                        lat: {val.latitude}
                                        <br />
                                        long: {val.longitude}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal open={toggleModal} close={onCloseModal}>
                    {createWhModal()}
                </Modal>
            </div>
        </div>
    )
}

export default ManageWarehouse;