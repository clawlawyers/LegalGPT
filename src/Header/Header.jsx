import Styles from "./Header.module.css";
import { Link } from "react-router-dom";
import clawIcon from "../assets/icons/clawIcon.png";
import { useSelector, useDispatch } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import { logout } from "../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function HeaderGpt() {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("auth");
    localStorage.removeItem("persist:root");
    console.log("Redirecting to Home after logout");
    navigate("/"); // Redirect to Home page after logout
  };


const legalLogin=()=>{
const baseUrl =  LEGAL_ENDPOINT

const encodedUrl = btoa(JSON.stringify(baseUrl))

window.open(`https://www.clawlaw.in/login?redirectURL${encodedUrl}`)
}



  return (
    <div className={Styles.headerContainer}>
      <div className={Styles.headerContent}>
        <div className={Styles.headerLogo}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              backgroundColor: "transparent",
            }}
          >
            <img
              alt="Claw"
              className="w-full rounded-none"
              style={{
                backgroundColor: "transparent",
                height: "60px",
                width: "100px",
                objectFit: "contain",
              }}
              src={clawIcon}
            />
          </Link>
        </div>

        <div className={Styles.headerLink}>
          <div style={{ backgroundColor: "transparent" }}>
            <a
              href="https://clawlaw.in/"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "transparent",
                transition: "color 0.3s ease",
              }}
            >
              <button className={Styles.login}>
                <HomeIcon className="iconSize" />
              </button>
            </a>
          </div>

          {currentUser ? (
            <button className={Styles.login} onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div style={{ backgroundColor: "transparent" }}>
            <a
              href="https://clawlaw.in/"
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "transparent",
                transition: "color 0.3s ease",
              }}
            >
              <button className={Styles.login}>
               <AccountCircleIcon className="iconSize"/>
              </button>
            </a>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderGpt;