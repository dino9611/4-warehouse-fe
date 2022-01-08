import "./styles/NotFoundV1.css";
import Admin404Img from "../../assets/components/404.svg";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AdmBtnPrimary from "../../components/admin/AdmBtnPrimary";

function NotFoundPage() {
    const getRoleId = useSelector((state) => state.auth.role_id);

    let history = useHistory();

    //* Utk kembali ke homepage
    const backToHome = () => (getRoleId === 1 || getRoleId === 2) ? history.push("/admin/dashboard") : history.push("/");
    
    return (
        <div className="adm-404-main-wrap">
            <div className="adm-404-sub-wrap">
                <div className="adm-404-img-wrap">
                    <img src={Admin404Img}  alt="Admin-Not-Found" />
                </div>
                <div className="adm-404-body-wrap">
                    <h2>Are you lost?</h2>
                    <h6>Looks like the page you are trying to visit doesn't exist.</h6>
                    <h6>Please check the correct URL and try again.</h6>
                </div>
                <div className="adm-404-foot-wrap">
                    <AdmBtnPrimary padding={"0.625rem 1rem"} onClick={backToHome}>
                        {(getRoleId === 1 || getRoleId === 2) ? "Back to home" : "Back to homepage"}
                    </AdmBtnPrimary>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage;