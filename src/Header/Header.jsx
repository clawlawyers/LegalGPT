import Styles from "./Header.module.css";
import { Link } from "react-router-dom";
import clawIcon from "../assets/icons/clawIcon.png";
import { useSelector, useDispatch } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import { logout } from "../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMediaQuery } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { MAINWEBSITE_ENDPOINT } from "../utils/utils";

function HeaderGpt() {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const handleAuthChange = () => {
    navigate("/login");
  };

  // const openHomepage = () => {
  //   var encodedStringBtoA = btoa(JSON.stringify(currentUser));
  //   console.log(currentUser);
  //   console.log(encodedStringBtoA);
  //   window.open(`${MAINWEBSITE_ENDPOINT}?user=${encodedStringBtoA}`);
  // };

  const openHomepage = () => {
    localStorage.setItem("userData", JSON.stringify(currentUser));
    window.open(MAINWEBSITE_ENDPOINT);
  };

  return (
    <div className={Styles.headerContainer}>
      <div className={Styles.headerContent}>
        <div className={Styles.headerLogo}>
          <Link
            to="#"
            style={{
              textDecoration: "none",
              color: "white",
              backgroundColor: "transparent",
            }}>
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
              }}>
              <button className={Styles.login}>
                <HomeIcon sx={{}} onClick={openHomepage} />
              </button>
            </div>
          </div>

          {/* {currentUser ? (
            <button
              className={Styles.login}
              onClick={() => {
                handleLogout();
              }}>
             
              Logout
            </button>
          ) : (
            <div style={{ backgroundColor: "transparent" }}>
              <div
                style={{
                  textDecoration: "none",
                  color: "white",
                  backgroundColor: "transparent",
                  transition: "color 0.3s ease",
                }}>
                <button
                  className={Styles.login}
                  onClick={() => {
                    handleAuthChange();
                    openLogin();
                  }}>
             
                  Login
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default HeaderGpt;
