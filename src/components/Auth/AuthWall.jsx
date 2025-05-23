import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuthState } from "../../hooks/useAuthState";
import { useLocation, Outlet, useNavigate, Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Button, Modal, Typography } from "@mui/material";
import { CLAW_ENDPOINT } from "../../utils/endpointUtils";
// import { ClearIcon } from "@mui/x-date-pickers";
// import { close } from "../features/popup/popupSlice";

export default function AuthWall() {
  const currentUser = useSelector((state) => state.auth.user);

  const { isAuthLoading } = useAuthState();

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const [isOpen, setisOpen] = useState(false);

  const handleLogin = () => {
    const searchParams = new URLSearchParams({
      callbackUrl: pathname,
    }).toString();
    // navigate(`/login?${searchParams}`);
    window.open(`${CLAW_ENDPOINT}`, "_self");
  };

  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      console.log("User is not logged in");
      setisOpen(true);
    }
  }, [isAuthLoading, currentUser]);

  const handleClose = () => {
    setisOpen(false);
  };

  if (isAuthLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <CircularProgress style={{ color: "white" }} />
        <div>Loading ...</div>
      </div>
    );
  } else if (!isAuthLoading && !currentUser) {
    return (
      <>
        <Modal
          sx={{ background: "#f2f2f2" }}
          open={isOpen}
          // onClose={handleClose}
          // aria-labelledby="modal-modal-title"
          // aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "white",
              border: "2px solid rgb(0, 128, 128)",
              borderRadius: "10px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Login Required
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2 }}
              style={{ color: "black" }}
            >
              You must be logged in to access this page.
            </Typography>
            <Button
              onClick={handleLogin}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              style={{
                border: "none",
                backgroundColor: "rgb(0, 128, 128)",
                borderRadius: 10,
                padding: 10,
              }}
            >
              Go to Login
            </Button>
          </Box>
        </Modal>
      </>
    );
  } else if (currentUser) {
    return <Outlet />;
  } else {
    return <div>Error</div>;
  }
}
