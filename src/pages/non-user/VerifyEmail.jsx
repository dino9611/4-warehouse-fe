import React from "react";
import qs from "query-string";
import axios from "axios";
import { API_URL } from "../../constants/api";

class VerifyEmail extends React.Component {
  state = {
    verifyCondition: 1,
  };

  // fetchdata = async ()=>{
  //   const { token } = qs.parse(this.props.location.search);
  //   console.log(token);
  // }

  componentDidMount(props) {
    try {
      const { token } = qs.parse(this.props.location.search);
      console.log(token);
      const res = axios.get(`${API_URL}/auth/verified`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      this.setState({ verifyCondition: 2 });
    } catch (err) {
      alert(err);
      console.log(err);
      this.setState({ verifyCondition: 3 });
    }
  }

  render() {
    const { verifyCondition } = this.state;
    if (verifyCondition === 1) {
      return (
        <div>
          <h1>Sedang menunggu verifikasi</h1>
        </div>
      );
    }
    if (verifyCondition === 2) {
      return (
        <div>
          <h1>verifikasi berhasil</h1>
        </div>
      );
    }
    //   if(verifyCondition ===3){
    //       return(
    //           <div>
    //               <h1>verifikasi gagal</h1>
    //           </div>
    //       )
    //   }
    return (
      <div>
        <h1>verifikasi gaga</h1>
      </div>
    );
  }
}

export default VerifyEmail;
