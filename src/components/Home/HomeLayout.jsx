import React from "react";
import { Outlet } from "react-router-dom";
import FooterBanner from "../../FooterBanner/FooterBanner";

const HomeLayout = () => {
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
