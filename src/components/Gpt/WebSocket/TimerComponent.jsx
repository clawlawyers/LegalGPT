import React, { useEffect, useState } from "react";
import countDown from "../../../assets/icons/countdown.png";
import { Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../reducers/authSlice";

const TimerComponent = React.memo(() => {
  const currentUser = useSelector((state) => state.auth.user);
  const timeUsed = currentUser.totalUsed;
  const [timeLeft, setTimeLeft] = useState({
    minutes: timeUsed >= 15 ? 0 : 15 - timeUsed,
    seconds: 0,
  });
  const [countdownOver, setCountDownOver] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const calculateTimeLeft = () => {
      setTimeLeft((prevTime) => {
        const { minutes, seconds } = prevTime;
        if (seconds > 0) {
          return { minutes, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { minutes: minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          setCountDownOver(true);
          dispatch(logout());
          return { minutes: 0, seconds: 0 };
        }
      });
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  //   useEffect(() => {
  //     if (slotTimeInterval < new Date().getHours()) {
  //       setCountDownOver(true);
  //     }
  //   });

  return (
    <>
      <div
        className="flex justify-between items-center px-2 py-1 bg-white text-[#008080]  rounded"
        style={{ borderColor: timeLeft.minutes < 5 ? "red" : "white" }}
      >
        <h1 id="time-left" className="text-xs m-0 font-bold text-teal-800">
          Time Remaining:
        </h1>
        <h1
          className="text-xs m-0 font-semibold"
          style={{ color: timeLeft.minutes < 5 ? "red" : "#008080" }}
        >
          {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes} :{" "}
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </h1>
      </div>
      <Modal className="flex justify-center items-center" open={countdownOver}>
        <div
          className="w-1/2 flex flex-col justify-center gap-10 py-5 px-10"
          style={{
            background: "teal",
            // height: "450px",
            // width: "900px",
            // border: "4px solid",
            borderRadius: "10px",
          }}
        >
          <div className="flex flex-col justify-center items-center gap-10">
            <img className="w-28 h-28" alt="clock" src={countDown} />
            {/* <AccessTimeIcon className="h-28 w-28" /> */}
            <h1 className="text-3xl font-bold text-white">
              Your Free Trial is Over
            </h1>
          </div>
          <div className="flex justify-center gap-5">
            <button
              style={{ border: "1px solid white", width: "100%" }}
              //   onClick={() => EndSessionToCourtroom()}
              //   className="border-2 border-white rounded-lg py-2 px-8"
            >
              Exit To Homepage
            </button>
            <button
              style={{ border: "1px solid white", width: "100%" }}
              //   onClick={() => setFeedbackForm(true)}
            >
              Buy A Plan
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default TimerComponent;
