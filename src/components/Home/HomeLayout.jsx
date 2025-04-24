import React, { useEffect } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import FooterBanner from "../../FooterBanner/FooterBanner";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadUserSessions,
  setMessageIdPromptData,
  setPromptsArrAction,
} from "../../reducers/promptSlice";
import { NODE_API_ENDPOINT } from "../../utils/utils";

const HomeLayout = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  const params = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  // console.log(params);

  // const urlParams = new URLSearchParams(window.location.search);
  // const encodedStringBtoA = urlParams.get("user");
  // const decodedString = atob(encodedStringBtoA);
  // const currentUser = JSON.parse(decodedString);
  // console.log(currentUser);
  // localStorage.setItem("token", currentUser.token);
  // dispatch(setPromptsArrAction(currentUser.promptArr));
  // navigate(currentUser.callbackUrl);

  // if (params.search !== "") {
  //   const setToken = params.search.split("user=")[1];
  //   localStorage.setItem("token", setToken);
  // } else {
  //   console.log(false);
  // }

  // useEffect(()=>{
  //   const urlParams = new URLSearchParams(window.location.search);
  // const encodedStringBtoA = urlParams.get("user");
  // const decodedString = atob(encodedStringBtoA);
  // const currentUser = JSON.parse(decodedString);
  // console.log(currentUser);
  // localStorage.setItem("token", currentUser.token);
  // dispatch(setPromptsArrAction(currentUser.promptArr));
  // navigate(currentUser.callbackUrl);
  // },[navigate, searchParams, currentUser])

  useEffect(() => {
    const callbackfunction = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const encodedStringBtoA = urlParams.get("user");
      const decodedString = atob(encodedStringBtoA);
      const currentUser = JSON.parse(decodedString);
      localStorage.setItem("token", currentUser.token);
      // if (currentUser) {
      console.log(currentUser?.currencyType);
      if (currentUser.redirectURL === "legalgpt") {
        console.log(currentUser);
        navigate("/gpt/socket");
        return;
      }
      if (currentUser.redirectURL === "casesearch") {
        console.log(currentUser);
        navigate("/case/search");
        return;
      }

      if (currentUser.prompt && currentUser.callbackUrl) {
        if (currentUser.callbackUrl == "/gpt/socket") {
          const res = await fetch(`${NODE_API_ENDPOINT}/gpt/session`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: currentUser.prompt,
              model: "legalGPT",
              currencyType: currentUser?.currencyType,
            }),
          });
          const { data } = await res.json();
          console.log(data);
          console.log("session id");

          const promptArr = [
            {
              text: currentUser.prompt,
              isDocument: null,
              contextId: null,
              isUser: true,
              sessionId: data.id,
            },
            {
              text: null,
              isDocument: null,
              contextId: null,
              isUser: false,
              sessionId: data.id,
            },
          ];

          dispatch(setPromptsArrAction(promptArr));

          navigate(`/gpt/socket/v1/${data.id}`);
          setUserGptResponse(
            {
              text: currentUser.prompt,
              isDocument: null,
              contextId: null,
              isUser: true,
              sessionId: data.id,
            },
            currentUser.token
          );
          dispatch(setLoadUserSessions());
        } else {
          navigate(currentUser.callbackUrl);
        }
      } else navigate("/");
      // }
    };
    callbackfunction();
  }, [navigate, searchParams]);

  async function setUserGptResponse(message, token) {
    const res = await fetch(`${NODE_API_ENDPOINT}/gpt/session/appendMessage`, {
      method: "POST",
      body: JSON.stringify({
        ...message,
        currencyType: currentUser?.currencyType,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();
    // console.log(resData);
    dispatch(setMessageIdPromptData({ index: 0, data: resData.data.id }));
  }

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#13161f",
        background: `radial-gradient(circle at 50% 0%, #018585, transparent 45rem),
      
      radial-gradient(circle at 100% 90%, #018585, transparent 15%)
      `,
        width: "100%",
      }}
    >
      <Outlet />
      <div
        style={{
          position: "fixed",
          height: 428,
          width: 428,

          left: "1px",
          background:
            "radial-gradient(circle, rgba(0, 128, 128,0.45) 0%, rgba(0, 128, 128, 0.15) 65%)",
          boxShadow: "0 0 100px 100px rgba(0, 128, 128, 0.15)",
          borderRadius: 428,
        }}
      />
      <FooterBanner />
    </div>
  );
};

export default HomeLayout;
