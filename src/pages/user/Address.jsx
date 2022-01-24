import React, { Fragment } from "react";
import axios from "axios";
import { API_URL } from "../../constants/api";
// import { ListGroup, ListGroupItemText, ListGroupItemHeading } from "reactstrap";
// import Select from "react-select";
import "./style/address.css";
import "../../components/styles/modal.css";
import Modal from "../../components/Modal";
import { connect } from "react-redux";
// import { Checkbox } from "@mui/material";
import SuccessSnack from "../../components/SuccessSnack";
import ErrorSnack from "../../components/ErrorSnackbar";
import Select from "react-select";
import { Label } from "reactstrap";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
// const addressEditValue = this.state.addressEdit;

class Address extends React.Component {
  state = {
    recipient: "",
    phone_number: "",
    address: "",
    city: "",
    province: "",
    modalAddress: false,
    modalDelete: false,
    modalEdit: false,
    resAddress: [],
    dataAddress: {},
    latitude: "",
    longitude: "",
    user_id: "",
    idAddress: "",
    isSearchable: true,
    dataProvince: [],
    dataCity: [],
    pickProvince: "",
    pickCity: "",
    successSnack: false,
    errorSnack: false,
    addressEdit: {},
    pickEditProvince: "",
    pickEditCity: "",
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ errorSnack: false, successSnack: false });
  };

  fetchProvince = async () => {
    try {
      let res = await axios.get(`${API_URL}/user/address/province`);
      this.setState({ dataProvince: res.data });
      console.log(this.state.dataProvince);
    } catch (error) {
      console.log(error);
    }
  };

  fetchCity = async () => {
    const { pickProvince } = this.state;
    try {
      let res = await axios.get(
        `${API_URL}/user/address/city/${pickProvince.province}`
      );
      this.setState({ dataCity: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  // get data address
  async componentDidMount() {
    const { user_id } = this.props;
    const { dataProvince, modalAddress, modalEdit, pickProvince } = this.state;
    // console.log(prevState, "tes prevstate");
    try {
      //? get address
      let dataAddress = await axios.get(`${API_URL}/user/address/${user_id}`);
      // console.log(dataAddress.data);

      //?get data province
      if ((!modalAddress || !modalEdit) && !dataProvince.length) {
        this.fetchProvince();
        console.log("lewat fetchProvince");
      }

      this.setState({ resAddress: dataAddress.data });
    } catch (error) {
      console.log(error);
    }
  }
  //func utk update data
  fetchData = async () => {
    const { user_id } = this.props;
    try {
      //get address
      let dataAddress = await axios.get(`${API_URL}/user/address/${user_id}`);
      // console.log(dataAddress.data);

      this.setState({ resAddress: dataAddress.data });
      // console.log(this.state.resAddress);
    } catch (error) {
      console.log(error);
    }
  };

  // get data kota
  async componentDidUpdate(prevProps, prevState) {
    const { pickProvince, modalEdit, modalAddress, pickEditProvince } =
      this.state;
    try {
      // console.log(prevState.pickProvince);
      if (prevState.pickProvince !== pickProvince) {
        this.fetchCity();
        // console.log("lewat fetchCIty");
      }
    } catch (error) {
      console.log(error);
    }
  }
  //render page kalau belom ada address
  renderAddressFalse = () => {
    return (
      <div>
        <div className="belum-ada-alamat">Belum ada alamat</div>
      </div>
    );
  };

  // onclick utk delete address
  onDeleteClick = (e, id) => {
    const { idAddress } = this.state;

    try {
      axios.delete(`${API_URL}/user/address/delete/${idAddress} `);

      this.fetchData();
      this.setState({
        modalDelete: false,
        successSnack: true,
        message: "Berhasil menghapus alamat",
      });
      // console.log();
    } catch (error) {
      console.log(error);
      this.setState({
        errorSnack: true,
        message: error.response.data.message || "Server Error",
      });
    }
  };

  // onCheckMainAddress = (e, id) => {
  //   const { user_id } = this.props;
  //   const { idAddress } = this.state;
  //   if (e.target.checked) {
  //     axios
  //       .patch(`${API_URL}/user/default-address/${id}`, {
  //         user_id: user_id,
  //       })
  //       .then((res) => {
  //         console.log("berhasil checked");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } else {
  //   }
  // };

  //? onclick untuk ganti address jadi main address
  onMainAddressClick = async (e, id) => {
    // const { idAddress } = this.state;
    const { user_id } = this.props;
    this.setState({ idAddress: id });
    try {
      await axios.patch(`${API_URL}/user/default-address/${id}`, {
        user_id: user_id,
      });

      console.log(this.state.idAddress);
      this.setState({
        successSnack: true,
        message: "Berhasil mengganti alamat",
      });

      this.fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  // render page address kalau address sudah ada
  renderAddressTrue = () => {
    const { resAddress } = this.state;
    return (
      <div className="parent-address">
        {resAddress?.map((val, index) => {
          return (
            // <div key={index} className="render-address ">
            <div key={index} className="row render-address-test">
              <div className="test-kiri">
                <div>
                  <h4>{val.recipient}</h4>
                  <h6>{val.phone_number}</h6>

                  <h6>{`${val.address}, ${val.province}, ${val.city}`}</h6>
                </div>
                <div>
                  {val.is_main_address ? (
                    <h5 className="main-address">Utama</h5>
                  ) : null}
                </div>
              </div>
              <div className="test-kanan">
                {val.is_main_address ? (
                  <button
                    onClick={(e) => this.onEditClick(e, val)}
                    className="btn-edit-alamat"
                  >
                    Ubah
                  </button>
                ) : (
                  <>
                    <button
                      onClick={(e) => this.onDeleteModalClick(e, val.id)}
                      className="btn-delete-alamat"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={(e) => this.onEditClick(e, val)}
                      className="btn-edit-alamat"
                    >
                      Ubah
                    </button>
                  </>
                )}
                {val.is_main_address ? null : (
                  <button
                    onClick={(e) => this.onMainAddressClick(e, val.id)}
                    className="btn-alamat-utama"
                  >
                    Jadikan Alamat Utama
                  </button>
                )}
              </div>
            </div>
            // </div>
          );
        })}
      </div>
    );
  };

  // onchange input add address
  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // onchange province
  provinceChange = (pickProvince) => {
    this.setState({ pickProvince, pickCity: "" });
    console.log(pickProvince);
  };

  // provinceEditChange = (pickEditProvince) => {
  //   this.setState({ pickEditProvince, pickEditCity: "" });
  // };

  //onChange city add address
  cityChange = (pickCity) => {
    this.setState({ pickCity });
    console.log();
  };

  //onChange city  edit address
  cityEditChange = (pickEditCity) => {
    this.setState({ pickEditCity });
    console.log();
  };

  // onchange input edit address
  onInputEditChange = (e) => {
    const { addressEdit } = this.state;
    this.setState({
      addressEdit: { ...addressEdit, [e.target.name]: e.target.value },
    });

    console.log("lewat defaulValue", this.state.addressEdit);
  };

  // onclick submit add address
  onSaveAddressClick = () => {
    const {
      recipient,
      phone_number,
      address,
      city,
      province,
      pickProvince,
      pickCity,
    } = this.state;
    const { user_id } = this.props;
    const addAddress = `${address},${pickProvince.province},${pickCity.city_name}`;
    if (recipient && phone_number && address && pickProvince && pickCity) {
      axios
        //dapetin data dari google geocode api
        .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: addAddress,
            key: "AIzaSyBWhGEZmXTsLT8rrd5BGdclTaXg5gk3O-w",
          },
        })
        .then((res) => {
          console.log(res.data);
          // ambil data lat & lang
          console.log(res.data.results[0].geometry.location.lat);
          axios
            .post(`${API_URL}/user/address/${user_id}`, {
              recipient,
              phone_number,
              address,
              city: pickCity.city_name,
              city_id: pickCity.city_id,
              province_id: pickProvince.province_id,
              province: pickProvince.province,
              latitude: res.data.results[0].geometry.location.lat,
              longitude: res.data.results[0].geometry.location.lng,
            })
            .then((res) => {
              console.log(addAddress);

              this.setState({
                modalAddress: false,
                successSnack: true,
                message: "Berhasil menambah alamat",
                pickProvince: "",
                pickCity: "",
                recipient: "",
                phone_number: "",
                address: "",
              });

              this.fetchData();
            })
            .catch((err) => {
              console.log(err);
              this.setState({
                errorSnack: true,
                message: err.response.data.message || "Server Error",
              });
            });
          // console.log(addAddress);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            errorSnack: true,
            message: err.response.data.message || "Server Error",
          });
        });
    } else {
      this.setState({ errorSnack: "true", message: "Tolong isi Semua Input" });
    }
  };

  // buka modal untuk add address
  onAddAddressClick = () => {
    this.setState({ modalAddress: !this.state.modalAddress });
  };

  //buka modal untuk edit
  onEditClick = (e, val) => {
    this.setState({
      modalEdit: !this.state.modalEdit,
      idAddress: val.id,
      addressEdit: val,
    });
  };

  // buka modal delete
  onDeleteModalClick = (e, id) => {
    this.setState({ modalDelete: !this.state.modalDelete, idAddress: id });
  };

  onCancelDeleteClick = () => {
    this.setState({ modalDelete: false });
  };

  onCancelClick = () => {
    this.setState({ modalEdit: false, modalAddress: false });
  };

  //onclick submit edit address
  onEditAddressClick = async () => {
    const {
      recipient,
      phone_number,
      address,
      city,
      province,
      resAddress,
      idAddress,
      dataAddress,
      pickEditCity,
      pickEditProvince,
      pickProvince,
      addressEdit,
    } = this.state;
    const addAddress = `${addressEdit.address},${pickProvince.province},${pickEditCity.city_name}`;
    await axios
      //dapetin data dari google geocode api
      .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: addAddress,
          key: "AIzaSyBWhGEZmXTsLT8rrd5BGdclTaXg5gk3O-w",
        },
      })
      .then((res) => {
        console.log(res.data);
        console.log(addAddress);
        // ambil data lat & lang
        // console.log(res.data.results[0].geometry.location.lat);
        let editInput = {
          recipient: addressEdit.recipient,
          phone_number: addressEdit.phone_number,
          address: addressEdit.address,
          city: pickEditCity.city_name,
          city_id: pickEditCity.city_id,
          province_id: pickProvince.province_id,
          province: pickProvince.province,
          latitude: res.data.results[0].geometry.location.lat,
          longitude: res.data.results[0].geometry.location.lng,
        };
        if (!pickProvince) {
          editInput.longitude = addressEdit.longitude;
          editInput.latitude = addressEdit.latitude;
          editInput.province = addressEdit.province;
          editInput.city = addressEdit.city;
          editInput.province_id = addressEdit.province_id;
          editInput.city_id = addressEdit.city_id;
          console.log("lewat kondisi", editInput.province, editInput.city);
        }
        axios
          .patch(`${API_URL}/user/address/edit/${idAddress}`, editInput)
          .then((res) => {
            console.log(res.data);
            this.fetchData();
            this.setState({
              modalEdit: false,
              successSnack: true,
              message: "Berhasil mengubah alamat",
              pickProvince: "",
              pickCity: "",
              recipient: "",
              phone_number: "",
              address: "",
            });
          });

        // console.log(addAddress);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          errorSnack: true,
          message: err.response.data.message || "Server Error",
        });
      });
  };

  // render modal delete
  renderDeleteAddress = () => {
    return (
      <div>
        <div>
          <h4>Anda yakin ingin menghapus alamat ini?</h4>
        </div>
        <div>
          <button onClick={this.onDeleteClick} className="btn-yes-delete">
            Yes
          </button>
          <button
            onClick={this.onCancelDeleteClick}
            className="btn-cancel-delete"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // render modal edit alamat
  renderModalEdit = () => {
    //proteksi semua form terisi
    const {
      recipient,
      phone_number,
      address,
      dataProvince,
      resAddress,
      dataCity,
      addressEdit,
      pickProvince,
      pickCity,
    } = this.state;

    return (
      <div className="w-100">
        <h5 className="d-flex justify-content-center w-100">Isi Alamat Anda</h5>
        <div className="mt-3"></div>
        <div className=" my-3">
          <div className="">
            <h6 className="mt-3">Nama Penerima</h6>
            <input
              type="text"
              name="recipient"
              className="form-control input-form"
              placeholder="nama penerima"
              onChange={this.onInputEditChange}
              // defaultValue={addressEdit.recipient}
              maxLength="45"
              value={addressEdit.recipient}
            />
            <h6 className="mt-3">Nomor telepon</h6>
            <input
              type="text"
              name="phone_number"
              className="form-control input-form"
              placeholder="nomor handphone"
              onChange={this.onInputEditChange}
              // value={addressEdit.phone_number}
              value={addressEdit.phone_number}
            />
            <h6 className="mt-3">Alamat Lengkap</h6>
            <input
              type="text"
              name="address"
              className="form-control input-form"
              placeholder="alamat"
              onChange={this.onInputEditChange}
              maxLength="120"
              // value={addressEdit.address}
              value={addressEdit.address}
            />
            <h6 className="mt-3">Provinsi</h6>

            <Select
              className="dropdown-form"
              placeholder="Masukkan Provinsi"
              onChange={this.provinceChange}
              defaultValue={{
                label: addressEdit.province,
                value: addressEdit.province,
              }}
              // {(e) => this.setState({ pickProvince: e.target.value })}
              options={dataProvince}
            />

            <h6 className="mt-3">Kota</h6>

            <Select
              className="dropdown-form"
              placeholder="Masukkan Kota"
              onChange={this.cityEditChange}
              defaultValue={{
                label: addressEdit.city,
                value: addressEdit.city,
              }}
              options={dataCity}
            />

            <div className="row">
              <button
                className="btn-simpan-alamat"
                onClick={this.onEditAddressClick}
                // disabled={!pickCity || !pickProvince}
              >
                Ubah
              </button>

              <button onClick={this.onCancelClick} className="btn-batal-alamat">
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // render modal tambah alamat
  renderModalAddAddress = () => {
    const {
      recipient,
      phone_number,
      address,
      pickCity,
      pickProvince,
      dataProvince,
      dataCity,
    } = this.state;
    return (
      <div className="w-100">
        <h5 className="d-flex justify-content-center w-100 ">
          Isi Alamat Anda
        </h5>
        <div className="mt-3"></div>
        <div className=" my-3"></div>
        <div className="">
          <h6 className="mt-3">Nama Penerima</h6>
          <input
            type="text"
            name="recipient"
            className="form-control input-form"
            placeholder="nama penerima"
            onChange={this.onInputChange}
            maxLength="45"
            value={recipient}
          />
          <h6 className="mt-3">Nomor telepon</h6>
          <input
            type="text"
            name="phone_number"
            className="form-control input-form"
            placeholder="nomor handphone"
            onChange={this.onInputChange}
            value={phone_number}
          />
          <h6 className="mt-3">Alamat Lengkap</h6>
          <input
            type="text"
            name="address"
            className="form-control input-form"
            placeholder="alamat"
            onChange={this.onInputChange}
            maxLength="120"
            value={address}
          />
          <h6 className="mt-3">Provinsi</h6>

          <Select
            className="dropdown-form"
            placeholder="Masukkan Provinsi"
            onChange={this.provinceChange}
            defaultValue={pickProvince}
            // {(e) => this.setState({ pickProvince: e.target.value })}
            options={dataProvince}
          />

          <h6 className="mt-3">Kota</h6>

          <Select
            className="dropdown-form"
            placeholder="Masukkan Kota"
            onChange={this.cityChange}
            defaultValue={pickCity}
            options={dataCity}
          />

          <div className="row">
            <button
              className="btn-simpan-alamat"
              onClick={this.onSaveAddressClick}
              disabled={!pickCity || !pickProvince}
            >
              Simpan
            </button>

            <button onClick={this.onCancelClick} className="btn-batal-alamat">
              Batal
            </button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    console.log("testes", this.state.addressEdit);
    return (
      <div>
        <div className="row">
          <h5 className="daftar-alamat">Daftar Alamat</h5>

          <button
            className="btn-tambah-alamat"
            onClick={this.onAddAddressClick}
          >
            Tambah Alamat Baru
          </button>
        </div>
        <div className="mt-5">
          {this.state.resAddress.is_delete
            ? this.renderAddressFalse()
            : this.renderAddressTrue()}
        </div>
        <div>
          <Modal
            open={this.state.modalAddress}
            close={() => this.setState({ modalAddress: false })}
            classModal="modal-address"
          >
            {this.renderModalAddAddress()}
          </Modal>
        </div>
        <div>
          <Modal
            open={this.state.modalDelete}
            close={() => this.setState({ modalDelete: false })}
            // classModal="modal-address"
          >
            {this.renderDeleteAddress()}
          </Modal>
        </div>
        <div>
          <Modal
            open={this.state.modalEdit}
            close={() => this.setState({ modalEdit: false })}
            classModal="modal-address"
          >
            {this.renderModalEdit()}
          </Modal>
        </div>
        <SuccessSnack
          message={this.state.message}
          successSnack={this.state.successSnack}
          handleClose={this.handleClose}
          // autoHideDuration={3000}
        />
        <ErrorSnack
          message={this.state.message}
          errorSnack={this.state.errorSnack}
          handleClose={this.handleClose}
          // autoHideDuration={3000}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user_id: state.auth.id,
  };
};

export default connect(mapStateToProps)(Address);
