import React from "react";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { ListGroup, ListGroupItemText, ListGroupItemHeading } from "reactstrap";
import "./style/address.css";
import "../../components/styles/modal.css";
import Modal from "../../components/Modal";

class Address extends React.Component {
  state = {
    recipient: "",
    phone_number: "",
    address: "",
    city: "",
    province: "",
    modalAddress: false,
    resAddress: [],
    latitude: "",
    longitude: "",
  };

  async componentDidMount() {
    try {
      //get address
      let dataAddress = await axios.get(
        `${API_URL}/user/address/2` // user_id belum diganti dari redux
      );
      console.log(dataAddress.data);

      // cek address
      if (!dataAddress.data.length) {
        this.setState({ resAddress: false });
        return;
      } else {
        this.setState({ resAddress: dataAddress.data });
        console.log(this.state.resAddress);
      }
    } catch (error) {
      console.log(error);
    }
  }

  renderAddressFalse = () => {
    return (
      <div className="">
        <div>Belum ada alamat</div>
        <div></div>
      </div>
    );
  };
  renderAddressTrue = () => {
    const { resAddress } = this.state;
    return (
      <div>
        <div>
          {resAddress?.map((val, index) => {
            return (
              <div key={index} className="render-address row">
                <div>
                  <h4>{val.recipient}</h4>
                  <h6>{val.phone_number}</h6>

                  <h6>{`${val.address},${val.province},${val.city}`}</h6>

                  {val.is_main_address ? (
                    <h5 className="checkout-main-address">Utama</h5>
                  ) : (
                    <button className="btn-alamat-utama">
                      Jadikan Alamat Utama
                    </button>
                  )}
                </div>
                <div>
                  <button className="btn-delete-alamat">Hapus</button>
                  <button className="btn-edit-alamat">Ubah</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  // <ListGroup>
  //   <ListGroupItemHeading>
  //     {this.state.resAddress.recipient}
  //   </ListGroupItemHeading>
  //   <h6>{this.state.resAddress.phone_number}</h6>
  //   {/* <ListGroupItemText>{this.state.resAddress.address}</ListGroupItemText> */}
  //   <h6>
  //     {`${this.state.resAddress.address},${this.state.resAddress.province},${this.state.resAddress.city}`}
  //   </h6>
  //   {/* <ListGroupItemText>{`${this.state.resAddress.province},${this.state.resAddress.city}`}</ListGroupItemText> */}
  //   <button className="btn-tambah-alamat">Hapus</button>
  // </ListGroup>
  // {/* <div className="">
  //   <div>{`${this.state.resAddress.recipient}`}</div>
  //   <div>{this.state.resAddress.phone_number}</div>
  //   <div>{this.state.resAddress.address}</div>
  //   <div>{`${this.state.resAddress.city}, ${this.state.resAddress.province}`}</div>
  // </div>
  // <div>
  //   <button className="btn-tambah-alamat">Simpan</button>
  //   <button className="btn-tambah-alamat">Hapus</button>
  // </div> */}
  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onSaveAddressClick = () => {
    const { recipient, phone_number, address, city, province } = this.state;
    axios
      //dapetin data dari google geocode api
      .get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: "AIzaSyBWhGEZmXTsLT8rrd5BGdclTaXg5gk3O-w",
        },
      })
      .then((res) => {
        console.log(res.data);
        // ambil data lat & lang
        console.log(res.data.results[0].geometry.location.lat);
        // const addAddress = {
        //   recipient,
        //   phone_number,
        //   address,
        //   city,
        //   province,
        //   latitude: res.data.results[0].geometry.location.lat,
        //   longitude: res.data.results[0].geometry.location.lng,
        // };
        axios
          .post(`${API_URL}/user/address/2`, {
            recipient,
            phone_number,
            address,
            city,
            province,
            latitude: res.data.results[0].geometry.location.lat,
            longitude: res.data.results[0].geometry.location.lng,
          })
          .then((res) => {
            console.log(res.data);
          });

        // console.log(addAddress);
        alert(`berhasil menambah alamat`);
        this.setState({ modalAddress: false });
      })
      .catch((err) => {
        console.log(err);
        alert("Lokasi tidak ditemukan");
      });
  };
  onAddAddressClick = () => {
    this.setState({ modalAddress: !this.state.modalAddress });
  };
  renderModalAddAddress = () => {
    const { recipient, phone_number, address, city, province } = this.state;
    return (
      <div className="w-100">
        <h5 className="d-flex justify-content-center w-100">Isi Alamat Anda</h5>
        <div className="mt-3">
          {/* <button className="btn-tambah-alamat">Tambah alamat baru</button> */}
        </div>
        <div className="cart-detail-border my-3"></div>
        <div className="checkout-listadd-wrapper">
          <h6>Nama Penerima</h6>
          <input
            type="text"
            name="recipient"
            className="form-control"
            placeholder="nama penerima"
            onChange={this.onInputChange}
            value={recipient}
          />
          <h6>Nomor telepon</h6>
          <input
            type="text"
            name="phone_number"
            className="form-control"
            placeholder="nomor handphone"
            onChange={this.onInputChange}
            value={phone_number}
          />
          <h6>Alamat</h6>
          <input
            type="text"
            name="address"
            className="form-control"
            placeholder="alamat"
            onChange={this.onInputChange}
            value={address}
          />
          <h6>Provinsi</h6>
          <input
            type="text"
            name="province"
            className="form-control"
            placeholder="provinsi"
            onChange={this.onInputChange}
            value={province}
          />
          <h6>Kota</h6>
          <input
            type="text"
            name="city"
            className="form-control"
            placeholder="kota"
            onChange={this.onInputChange}
            value={city}
          />
          <button
            className="btn-tambah-alamat"
            onClick={this.onSaveAddressClick}
          >
            Simpan
          </button>
        </div>
      </div>
    );
  };

  render() {
    console.log(this.state.resAddress);
    return (
      <div>
        <div>
          <button
            className="btn-tambah-alamat"
            onClick={this.onAddAddressClick}
          >
            Tambah Alamat Baru
          </button>
        </div>
        <div className="mt-5">
          {!this.state.resAddress
            ? this.renderAddressFalse()
            : this.renderAddressTrue()}
        </div>
        <div></div>
        <Modal
          open={this.state.modalAddress}
          close={() => this.setState({ modalAddress: false })}
          className="modal-address"
          style={{ width: "100%" }}
        >
          {this.renderModalAddAddress()}
        </Modal>
      </div>
    );
  }
}

export default Address;
