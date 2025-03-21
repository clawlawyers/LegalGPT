import Styles from "./Header.module.css";
import { Link } from "react-router-dom";
import clawIcon from "../assets/icons/clawIcon.png";
import { useSelector, useDispatch } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import { logout } from "../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useMediaQuery } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

function HeaderGpt() {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

 







const is320 = useMediaQuery('(max-width:320px)');
const is375_425 = useMediaQuery('(min-width:321px) and (max-width:425px)');
const is768 = useMediaQuery('(min-width:426px) and (max-width:768px)');
const isAbove768 = useMediaQuery('(min-width:769px)');

// Dynamically decide icon size
const iconSize = is320
  ? "15px"
  : is375_425
  ? "15px"
  : is768
  ? "20px"
  : "20px"; // default for larger screens



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
            <div
             
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "transparent",
                transition: "color 0.3s ease",
              }}
            >
              <button className={Styles.login} >
                <HomeIcon   sx={{ fontSize: iconSize }}  />
              </button>
            </div>
          </div>

          {currentUser ? (
            <button className={Styles.login} >
              <LogoutIcon sx={{ fontSize: iconSize }} /> 
            </button>
          ) : (
            <div style={{ backgroundColor: "transparent" }}>
            <div
            
              style={{
                textDecoration: "none",
                color: "white",
                backgroundColor: "transparent",
                transition: "color 0.3s ease",
              }}
            >
              <button className={Styles.login}>
               <AccountCircleIcon sx={{ fontSize: iconSize }} />
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderGpt;