import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { retrieveActivePlanUser } from "./reducers/gptSlice";
import { retrieveAuth } from "./reducers/authSlice";
import {
  createBrowserRouter,
  RouterProvider,
  useParams,
} from "react-router-dom";
import HomeLayout from "./components/Home/HomeLayout";
import Home from "./components/Home/Home";
import AuthWall from "./components/Auth/AuthWall";
import SocketLayout from "./components/Gpt/WebSocket/SocketLayout";
import Prompts from "./components/Gpt/WebSocket/Prompts";
import WebSocketComponent from "./components/Gpt/WebSocket/WebSocket";
import { Toaster } from "react-hot-toast";
import NotFound from "./NotFound/index";
import CaseFinder from "./CaseSearch/CaseFinder";
import AboutUs from "./AboutUs/AboutUs";
import Contact from "./Contact/Contact";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "./RefundPolicy/RefundPolicy";
import TermsAndConditions from "./Terms & Conditions/TermsAndConditions";
import ShippingPolicy from "./ShippingPolicy/ShippingPolicy";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveAuth());
    // dispatch(retrieveActivePlanUser());
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "case/search",
          element: <AuthWall />,
          children: [{ path: "", element: <CaseFinder /> }],
        },

        { path: "about-us", element: <AboutUs /> },
        { path: "contact", element: <Contact /> },
        {
          path: "privacyPolicy",
          element: <PrivacyPolicy />,
        },
        { path: "refund-and-cancellation-policy", element: <RefundPolicy /> },
        { path: "terms-and-conditions", element: <TermsAndConditions /> },
        { path: "shipping-and-delivery", element: <ShippingPolicy /> },
      ],
    },
    {
      path: "/gpt",
      element: <AuthWall />,
      children: [
        {
          path: "socket",
          element: <SocketLayout />,
          children: [
            { path: "", element: <Prompts /> },
            { path: "v1/:sessionId", element: <WebSocketComponent /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div className="App">
      
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
