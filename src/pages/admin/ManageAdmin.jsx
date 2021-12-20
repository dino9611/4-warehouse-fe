import { useState, useEffect } from "react";
import "./styles/ManageAdmin.css";
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
import ShowPassFalse from "../../assets/components/Show-Pass-False.svg";
import ShowPassTrue from "../../assets/components/Show-Pass-True.svg";

function ManageAdmin() {
    const [adminList, setAdminList] = useState([]);

    const [warehouses, setWarehouses] = useState([]);
    console.log(warehouses);

    const [toggleModal, setToggleModal] = useState(false);

    const [showPass, setShowPass] = useState("password"); // Utk rubah input type form pass pada modal add admin

    const [passToggle, setPassToggle] = useState(false); // Utk atur showPass pada modal add admin

    const [addAdmInput, setAddAdmInput] = useState({ // Utk bawa input data new admin ke BE
        new_username: "",
        new_password: "",
        assign_warehouse: 0
      });

    const fetchAdminList = async () => { // Utk render data list admin
        try {
            const res = await axios.get(`${API_URL}/admin/list`);
            setAdminList(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const fetchWarehouse = async () => { // Utk render data list warehouse
        try {
            const res = await axios.get(`${API_URL}/warehouse/list`);
            setWarehouses(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    let {new_username, new_password, assign_warehouse} = addAdmInput;

    useEffect(() => {
        fetchAdminList();
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

    const addAdmStringHandler = (event) => { // Utk setState data berbentuk string
        setAddAdmInput((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    };

    const addAdmNumberHandler = (event) => { // Utk setState data berbentuk number
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
                    />
                    <div>
                        <Textbox
                            type={showPass}
                            label="Set Password"
                            name="new_password"
                            value={new_password}
                            onChange={(event) => addAdmStringHandler(event)}
                            placeholder="Set the new admin password"
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
                    <button onClick={onSubmitAddAdm} disabled={!new_username || !new_password || !assign_warehouse}>Confirm</button>
                    <button onClick={onCloseModal}>Cancel</button>
                </div>
            </>
        )
    };

    const onSubmitAddAdm = async (event) => { // Untuk trigger submit button
        event.preventDefault();
        document.querySelector("div.add-adm-modal-foot > button").disabled = true;
        
        let inputtedAdm = {
            new_username: new_username,
            new_password: new_password,
            assign_warehouse: assign_warehouse
        };

        if (new_username || new_password || assign_warehouse) {
            try {
                await axios.post(`${API_URL}/admin/add`, inputtedAdm);
                setAddAdmInput((prevState) => {
                    return {...prevState, new_username: "", new_password: "", assign_warehouse: 0}
                });
                document.querySelector("div.add-adm-modal-foot > button").disabled = false;
                Swal.fire({
                    icon: 'success',
                    title: 'Add new admin/warehouse admin success!',
                    text: `${inputtedAdm.new_username}`,
                    confirmButtonColor: '#B24629',
                  });
                fetchAdminList();
            } catch (error) {
                console.log(error);
                document.querySelector("div.add-adm-modal-foot > button").disabled = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...something went wrong, reload/try again',
                    confirmButtonColor: '#B24629',
                  });
            };
        } else {
            document.querySelector("div.add-adm-modal-foot > button").disabled = false;
            errorToast("Please input all form");
        };
    };

    return (
        <div className="manage-adm-main-wrap">
            <div className="manage-adm-header-wrap">
                <h4>Manage Admin</h4>
                <h4>nanti breadcrumb {`>`} admin {`>`} xxx</h4>
            </div>
            <div className="manage-adm-contents-wrap">
                <TableContainer component={Paper} style={{borderRadius: "12px"}}>
                    <div className="manage-adm-add-wrap">
                        <button onClick={modalClick}>+ Add Admin</button>
                    </div>
                    <Table sx={{ minWidth: 650 }} aria-label="warehouse table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">User ID</TableCell>
                                <TableCell align="left">Username</TableCell>
                                <TableCell align="left">Role</TableCell>
                                <TableCell align="left">Warehouse ID</TableCell>
                                <TableCell align="left">Warehouse Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminList
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
                                    <TableCell align="left" className="txt-capitalize">{val.username}</TableCell>
                                    <TableCell align="left" className="txt-capitalize">{(val.role_id === 2) ? `${val.role}/Warehouse Admin` : val.role}</TableCell>
                                    <TableCell align="left" style={{width: "200px"}}>{val.warehouse_id}</TableCell>
                                    <TableCell align="left">{val.warehouse_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal open={toggleModal} close={onCloseModal}>
                    {AddAdminModal()}
                </Modal>
            </div>
        </div>
    )
}

export default ManageAdmin;