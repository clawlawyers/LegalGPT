import React, { useState, useCallback, useEffect, useRef } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, FormHelperText, InputLabel, Modal, Chip } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import LockIcon from "@mui/icons-material/Lock";
import CaseCard from "./CaseCard";
import Styles from "./index.module.css";
import { SearchOutlined } from "@mui/icons-material";
import { NODE_API_ENDPOINT } from "../utils/utils";
import { setPlan, setToken } from "../reducers/gptSlice";
import moment from "moment";
import { close, open } from "../reducers/popupSlice";
import { Helmet } from "react-helmet";
import TimerComponent from "../components/Gpt/WebSocket/TimerComponent";
import axios from "axios";
import dayjs from "dayjs";
// const courts = [
//   "Supreme Court of India",
//   "Chattisgarh High Court",
//   "Sikkim High Court",
//   "Uttarakhand High Court",
//   "Calcutta High Court",
//   "Jammu and Kashmir High Court",
//   "Delhi High Court",
//   "Delhi District Court",
//   "Gujarat High Court",
//   "Rajasthan High Court",
// ];

const courts = [
  "Supreme Court of India",
  "Allahabad High Court",
  "Calcutta High Court",
  "Delhi District Court",
  "Delhi High Court",
  "Gujarat High Court",
  "Jammu and Kashmir High Court",
  "Jharkhand High Court",
  "Karnataka High Court",
  "Kerela High Court",
  "Madhya Pradesh High Court",
  "Rajasthan High Court",
];

export default function CaseFinder({
  keyword = "Legal",
  primaryColor = "#008080",
  model = "legalGPT",
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment("18-sep-01"));
  const [endDate, setEndDate] = useState(moment(dayjs()));
  const [result, setResult] = useState([]);

  // const BATCH_INTERVAL = 60 * 1000;

  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.popup.open);
  const handlePopupClose = useCallback(() => dispatch(close()), [dispatch]);
  const [selectedCourts, setSelectedCourts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [summery, setsummery] = useState("");
  const [referenceMessage, setReferenceMessage] = useState("");
  const [referenceSocket, setReferenceSocket] = useState(null);
  const [referenceIndex, setReferenceIndex] = useState(0);

  // const currentUserRef = useRef(currentUser);

  // useEffect(() => {
  //   currentUserRef.current = currentUser;
  // }, [currentUser]);

  const handleCourtChange = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setSelectedCourts(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  }, []);

  async function handleCaseSearch(e) {
    e.preventDefault();

    if (selectedCourts.length === 0) {
      alert("Please select at least one court.");
      return;
    }

    const courtsString = selectedCourts.join(",");
    try {
      setLoading(true);
      // if (
      //   token?.used?.caseSearchTokenUsed >=
      //     token?.total?.totalCaseSearchTokens ||
      //   parseFloat(token?.used?.caseSearchTokenUsed) + 1 >
      //     token?.total?.totalCaseSearchTokens
      // ) {
      //   dispatch(open());
      //   throw new Error(
      //     "Not enough tokens, please upgrade or try again later!"
      //   );
      // }

      const response = await fetch(`${NODE_API_ENDPOINT}/gpt/case/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: startDate.format("YY-MMM-DD"),
          endDate: endDate.format("YY-MMM-DD"),
          query,
          courtName: courtsString,
        }),
      });
      const parsed = await response.json();
      if (parsed.success) {
        setResult(parsed.data.result);
        // dispatch(setToken({ token: parsed.data.token }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // const updateEngagementTime = useCallback(async () => {
  //   try {
  //     await axios.post(
  //       `${NODE_API_ENDPOINT}/gpt/storeUsedTime`,
  //       {
  //         // engagementData
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${currentUser.jwt}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error updating engagement time:", error);
  //   }
  // }, []);

  // const flushQueue = useCallback(() => {
  //   const user = currentUserRef.current;
  //   if (user) {
  //     updateEngagementTime();
  //   }
  // }, [updateEngagementTime]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     flushQueue();
  //   }, BATCH_INTERVAL);

  //   return () => {
  //     clearInterval(interval);
  //     flushQueue();
  //   };
  // }, [flushQueue]);

  useEffect(() => {
    console.log("triggered");
    const newSocket = new WebSocket(
      "wss://api.clawlaw.in:8000/api/v1/overview/case/view_overview"
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
    };

    newSocket.onmessage = (event) => {
      console.log(event.data);
      const formattedData = event.data
        .replaceAll("\\\\n\\\\n", "<br/>")
        .replaceAll("\\\\n", "<br/>")
        .replaceAll("\\n\\n", "<br/>")
        .replaceAll("\\n", "<br/>")
        .replaceAll("\n", "<br/>")
        .replaceAll(/\*([^*]+)\*/g, "<strong>$1</strong>")
        .replaceAll("\\", "")
        .replaceAll('"', "")
        .replaceAll(":", " :")
        .replaceAll("#", "")
        .replaceAll("**", "")
        .replaceAll("*", "");
      setReferenceMessage((prevMessages) => [...prevMessages, formattedData]);
    };

    newSocket.onclose = (event) => {
      // console.log(event);
      console.log("Closed code:", event.code);
      console.log("Close reason:", event.reason);
      console.log("WebSocket connection closed");
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setReferenceSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendReferenceMessage = (folderId, caseId) => {
    if (summery) {
      return;
    }
    setIsLoading(true);
    console.log({
      folder_id: folderId,
      case_id: caseId,
      search_query: query,
    });
    if (referenceSocket && referenceSocket.readyState === WebSocket.OPEN) {
      // console.log(message);
      referenceSocket.send(
        JSON.stringify({
          folder_id: folderId,
          case_id: caseId,
          search_query: query,
        })
      );
    }
  };

  useEffect(() => {
    if (referenceMessage.length === 0) return;

    const typeText = () => {
      if (referenceIndex < referenceMessage.length) {
        setsummery((prev) => (prev || "") + referenceMessage[referenceIndex]);
        setReferenceIndex((prev) => prev + 1);

        if (referenceMessage[referenceIndex] === "<EOS>") {
          console.log("Message is Finished");
          setIsLoading(false);
        }
      }
    };

    if (referenceIndex < referenceMessage.length) {
      const animationFrameId = requestAnimationFrame(typeText);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [referenceIndex, referenceMessage]);

  return (
    <div className=" flex flex-col gap-2 pt-20 overflow-auto">
      <div className="flex flex-col justify-center items-center heading">
        {/* {currentUser?.plan[0]?.planName === "FREE" ? <TimerComponent /> : null} */}
        <p className="text-2xl md:text-3xl text-center text-white font-bold m-0">
          Find Legal Cases With
        </p>
        <p
          className="text-4xl md:text-6xl font-bold text-center"
          style={{
            background:
              "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",

            color: "transparent",
          }}
        >
          Claw Case Search
        </p>
      </div>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Helmet>
          <title>Claw Case Search</title>
          <meta
            name="description"
            content="Claw's advanced case search empowers you to efficiently find relevant legal precedents. Search to navigate India's vast legal landscape with ease."
          />
          <meta
            name="keywords"
            content="digital legal transformation, privacy policies, your, us, concerns, business law services, data-driven law, legal news insights, legal compliance, questions"
          />
        </Helmet>
        <div className="m-auto w-[80%]">
          {/* <div
          className={`${
            collapsed ? Styles.contentContainer : Styles.contentContainer1
          }`}
        > */}
          <Modal open={isOpen} onClose={handlePopupClose}>
            <div className={Styles.modalContent}>
              <div className={Styles.modalHeader}>
                <button
                  onClick={handlePopupClose}
                  style={{
                    border: "none",
                    backgroundColor: "inherit",
                    backgroundImage: "none",
                  }}
                >
                  <ClearIcon style={{ fontSize: 30, color: "black" }} />
                </button>
              </div>
              <div className={Styles.modalBody}>
                <LockIcon style={{ fontSize: 80, color: primaryColor }} />
                <h3 style={{ fontSize: 28, fontWeight: 500 }}>Upgrade Now</h3>
                <div className={Styles.modalActions}>
                  <button
                    onClick={handlePopupClose}
                    className="backdropImg"
                    style={{
                      border: "none",
                      backgroundColor: "rgb(0, 128, 128)",
                      borderRadius: 15,
                      padding: 10,
                    }}
                  >
                    <Link
                      className="linkImg"
                      to="/pricing"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        width: "fit-content",
                        border: "none",
                      }}
                    >
                      Buy Credits
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <div className="uppar-div">
         <label className="block text-left w-full">Enter Case Search</label>
            <form
              onSubmit={handleCaseSearch}
              style={{
                marginTop: 2,
                marginBottom: 25,
                display: "flex",
                backgroundColor: "white",
                padding: 16,
                borderRadius: 10,
              }}
            >
              <SearchOutlined
                style={{ color: "#777", marginRight: "10px", marginTop: "7px" }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: 16,
                  outline: "none",
                  border: "none",
                  color: "black",
                }}
                placeholder="Enter your prompt to find all registered cases..."
              />
              <button
                type="submit"
                className={`${Styles.bgbutton} exp-button`}
                style={{
                  backgroundColor: primaryColor,
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  padding: "10px 30px",
                  cursor: "pointer",
                  marginLeft: 10,
                }}
              >
                Search
              </button>
            </form>
          </div>
          <div className={Styles.inputGrid}>
            <div className="flex-1 left-box">
              <div>Court Name</div>
              <FormControl
                sx={{ width: "100%" }}
                error={selectedCourts.length === 0}
              >
                <Select
                  multiple
                  value={selectedCourts}
                  onChange={handleCourtChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                          Select a court....
                        </span>
                      );
                    }
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          maxHeight: 80,
                          overflow: "auto",
                        }}
                      >
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            sx={{ backgroundColor: "#e0f7fa" }}
                          />
                        ))}
                      </Box>
                    );
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        width: 250,
                      },
                    },
                    // Important: This keeps the menu from auto-closing on select
                    autoFocus: false,
                  }}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    maxWidth: "450px",
                    fontWeight: "bold",
                    fontSize: "10px",
                  }}
                >
                  {courts.map((court) => (
                    <MenuItem key={court} value={court}>
                      {court}
                    </MenuItem>
                  ))}
                </Select>
                {selectedCourts.length === 0 && (
                  <FormHelperText>
                    Please select at least one court.
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="right-box" style={{ display: "flex", gap: 10 }}>
              <div>
                <div>Search Start Date</div>
                <DatePicker
                  value={startDate}
                  onChange={(newVal) => setStartDate(newVal)}
                  // shouldDisableDate={(date) => date.isAfter(dayjs())}
                  sx={{ backgroundColor: "white", borderRadius: "10px" }}
                  shouldDisableDate={(date) => date.isAfter(dayjs())}
                />
              </div>
              <div>
                <div>Search End Date</div>
                <DatePicker
                  value={endDate}
                  onChange={(newVal) => setEndDate(newVal)}
                  defaultValue={dayjs()}
                  // shouldDisableDate={(date) => date.isAfter(dayjs())}
                  sx={{ backgroundColor: "white", borderRadius: "10px" }}
                  shouldDisableDate={(date) =>
                    date.isAfter(dayjs()) ||
                    (startDate && date.isBefore(startDate))
                  }
                />
              </div>
            </div>
          </div>

          <div
            className="h-screen mt-5"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <CircularProgress style={{ color: "white" }} />
                <p>Loading Related Cases...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* {result
                ? result.map((relatedCase) => (
                    <CaseCard
                      caseId={relatedCase.case_id}
                      name={relatedCase.Title}
                      date={relatedCase.Date}
                      citations={relatedCase.num_cites}
                      court={relatedCase.court}
                      key={relatedCase.id}
                      query={query}
                    />
                  ))
                : search.get("id") === messageId &&
                  cases.map((relatedCase) => (
                    <CaseCard
                      caseId={relatedCase.case_id}
                      name={relatedCase.Title}
                      citations={relatedCase.num_cites}
                      date={relatedCase.Date}
                      court={relatedCase.court}
                      key={relatedCase.id}
                      query={query}
                    />
                  ))} */}
                {result.map((relatedCase) => (
                  <CaseCard
                    caseId={relatedCase.case_id}
                    name={relatedCase.Title}
                    date={relatedCase.Date}
                    citations={relatedCase.num_cites}
                    court={relatedCase.court}
                    key={relatedCase.id}
                    query={query}
                    sendReferenceMessage={sendReferenceMessage}
                    summery={summery}
                    setsummery={setsummery}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    referenceSocket={referenceSocket}
                  />
                ))}
              </div>
            )}
          </div>
          {/* </div> */}
        </div>
      </LocalizationProvider>
    </div>
  );
}

function StudentReferralModal() {
  const [open, setOpen] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const jwt = useSelector((state) => state.auth.user.jwt);
  const dispatch = useDispatch();

  async function handleRedeem(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${NODE_API_ENDPOINT}/gpt/referralCode/redeem`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralCode }),
      });
      const { data } = await res.json();
      dispatch(setPlan({ plan: data.plan }));
      dispatch(setToken({ token: data.token }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setReferralCode("");
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => {
          if (!loading) setOpen(false);
        }}
      >
        <div
          style={{
            backgroundColor: "#1e1e1e",
            position: "absolute",
            top: "50%",
            left: "50%",
            color: "white",
            borderRadius: 10,
            overflowY: "scroll",
            padding: 10,
            transform: "translate(-50%, -50%)",
            boxShadow: 24,
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              disabled={loading}
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                backgroundColor: "inherit",
                backgroundImage: "none",
              }}
            >
              <ClearIcon style={{ fontSize: 30, color: "white" }} />
            </button>
          </div>
          <form
            onSubmit={handleRedeem}
            style={{
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 15,
              alignItems: "center",
            }}
          >
            <h3>Redeem Referral Code</h3>
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Referral Code"
              style={{
                width: "100%",
                outline: "none",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "#2d2d2d",
                color: "white",
              }}
            />
            <button
              className="backdropImg"
              disabled={loading}
              type="submit"
              style={{
                borderRadius: 15,
                color: "white",
                textDecoration: "none",
                padding: 10,
                width: "fit-content",
                border: "none",
              }}
            >
              {loading ? (
                <CircularProgress style={{ color: "white", padding: 10 }} />
              ) : (
                "Redeem"
              )}
            </button>
          </form>
        </div>
      </Modal>
      <button
        className="backdropImg"
        onClick={() => setOpen(true)}
        style={{
          borderRadius: 15,
          backgroundColor: "#008080",
          color: "white",
          textDecoration: "none",
          padding: 10,
          width: "fit-content",
          border: "none",
        }}
      >
        Student Referral
      </button>
    </>
  );
}
