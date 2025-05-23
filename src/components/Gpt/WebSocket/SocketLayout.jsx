import React, { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import SocketSidebar from "./SocketSidebar";
import { NODE_API_ENDPOINT } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setToggleMenuManual } from "../../../reducers/promptSlice";
import { setUsedTime } from "../../../reducers/authSlice";

const SocketLayout = () => {
  const BATCH_INTERVAL = 60 * 1000;

  const currentUser = useSelector((state) => state.auth.user);
  //console.log(currentUser);

  const currentUserRef = useRef(currentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      console.log("dispatched");
      dispatch(setToggleMenuManual(false)); // Dispatch the action when in mobile view
    }
  }, []);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  console.log(currentUser);

  const updateEngagementTime = useCallback(async () => {
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/gpt/storeUsedTime`,
        {
          currencyType: currentUser?.currencyType,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      const timeData = response.data.usedTime;
      dispatch(setUsedTime(timeData));
    } catch (error) {
      console.error("Error updating engagement time:", error);
    }
  }, []);

  const flushQueue = useCallback(() => {
    const user = currentUserRef.current;
    console.log(user);

    if (user && user.plan[0].planName === "FREE") {
      updateEngagementTime();
    }
  }, [updateEngagementTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      flushQueue();
    }, BATCH_INTERVAL);

    return () => {
      clearInterval(interval);
      flushQueue();
    };
  }, [flushQueue]);

  return (
    <div className="flex h-screen">
      <SocketSidebar />
      <div className="flex-1 ">
        <Outlet className="" />
      </div>
    </div>
  );
};

export default SocketLayout;
