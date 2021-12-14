import "./styles/AdminNotFound.css";
import Admin404Img from "../../assets/visuals/Admin_Not_Found_01.jpeg";
import {Link} from "react-router-dom";

function AdminNotFound() {
    
    
    return (
        <div className="adm-404-main-wrap">
            <div className="adm-404-sub-wrap">
                <div className="adm-404-heading-wrap">
                    <h2>You're trying access forbidden path!</h2>
                </div>
                <div className="adm-404-img-wrap">
                    <img src={Admin404Img}  alt="Admin-Not-Found" />
                </div>
                <div className="adm-404-foot-wrap">
                    <h2>
                        Are you lost traveller??? {" "}
                        <Link to="/" className="link-no-decoration adm-404-cstm-link">Click here to homepage</Link>
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default AdminNotFound;