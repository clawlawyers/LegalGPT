import React, { useCallback, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import SocketSidebar from "./SocketSidebar";
import { NODE_API_ENDPOINT } from "../../../utils/utils";
import { useSelector } from "react-redux";
import axios from "axios";

const SocketLayout = () => {
  const BATCH_INTERVAL = 60 * 1000;

  const currentUser = useSelector((state) => state.auth.user);
  // console.log(currentUser);

  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const updateEngagementTime = useCallback(async () => {
    try {
      await axios.post(
        `${NODE_API_ENDPOINT}/gpt/storeUsedTime`,
        {
          // engagementData
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating engagement time:", error);
    }
  }, []);

  const flushQueue = useCallback(() => {
    const user = currentUserRef.current;
    if (user) {
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
      <div className="flex-1">
        <Outlet className="" />
      </div>
    </div>
  );
};

export default SocketLayout;
