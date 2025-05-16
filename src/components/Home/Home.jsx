import React from "react";
import { useEffect, useState, useMemo } from "react";
import caseSearchIcon from "../../assets/icons/caseSearch.png";
import legalGptIcon from "../../assets/icons/legalGpt.png";
import { useNavigate } from "react-router-dom";
import HeaderGpt from "../../Header/Header";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import './Home.css';

// const prodArr = [
//   {
//     icon: caseSearchIcon,
//     name: "Case Search",
//     description:
//       "Streamline your legal research with ClawLaw's AI-powered Case Search. Quickly find relevant precedents, save time, and get accurate results for court prep or research, making your legal journey faster and easier.",
//     path: "/case/search",
//   },
//   {
//     icon: legalGptIcon,
//     name: "LegalGPT",
//     description:
//       "Revolutionize legal research with LegalGPT. Instantly access case summaries, references, insights, and tailored precedents. Get accurate info in minutes, skipping endless document searches, and unlock AI-driven legal intelligence",
//     path: "/gpt/socket",
//   },
// ];

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  console.log(currentUser?.currencyType);

  return (
    <>
      <div className="">
        {/* {init && (
          <Particles
            options={options}
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: 0, pointerEvents: "none" }} // Ensures clicks pass through
          />
        )} */}
        <div className="relative z-10">
          <HeaderGpt />
          <div className="md:h-full m-auto w-[80%] flex flex-col justify-center items-center mb-0 md:mb-12 pt-[-180px]">
            <div className="heading">
              <h1
                className="text-3xl md:text-5xl font-bold mt-5 p-5 text-center"
                style={{
                  background:
                    "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}>
                Unlock Legal Clarity with ClawLaw
              </h1>
              <div>
                <p className="text-sm md:text-lg  text-center">
                  Step into the future of legal solutions with{" "}
                  <span className="font-semibold text-white">ClawLaw</span>
                </p>
                <p className="text-sm md:text-lg  text-center">
                  Our{" "}
                  <span className="font-semibold text-white">
                    advanced AI tools
                  </span>{" "}
                  empower you to navigate complex legal landscapes with ease
                </p>
              </div>
            </div>

            <div className="mt-12 h-full md:h-72 w-full grid md:grid-cols-2 items-center justify-center gap-5">
              {/* {prodArr.map((x, index) => ( */}
              <div className="grid md:grid-cols-[30%_70%] w-full h-full justify-center items-center border-2 rounded-lg p-3 left-div card-hover">
                <div className="w-full h-full flex items-center justify-center">
                  <img className="w-24 h-24" src={caseSearchIcon} />
                </div>
                <div className="w-full h-full flex flex-col gap-2 py-2">
                  <h2 className="text-2xl font-semibold text-center md:text-start">
                    Case Search
                  </h2>
                  <div className="h-full flex-1 flex flex-col gap-2 justify-between">
                    <p className="text-center md:text-start">
                      Streamline your legal research with ClawLaw's AI-powered
                      Case Search. Quickly find relevant precedents, save time,
                      and get accurate results for court prep or research,
                      making your legal journey faster and easier.
                    </p>

                    <button className="exp-button"
                      onClick={() => {
                        if (currentUser?.currencyType === "INR") {
                          navigate("/case/search");
                        } else {
                          toast(" Coming Soon!", {
                            position: "top-center",
                          });
                        }
                      }}>
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-[30%_70%] w-full h-full justify-center items-center border-2 rounded-lg p-3 right-div card-hover">
                <div className="w-full h-full flex items-center justify-center">
                  <img className="w-24 h-24" src={legalGptIcon} />
                </div>
                <div className="w-full h-full flex flex-col gap-2 py-2">
                  <h2 className="text-2xl font-semibold text-center md:text-start">
                    LegalGPT
                  </h2>
                  <div className="h-full flex-1 flex flex-col gap-2 justify-between">
                    <p className="text-center md:text-start">
                      Revolutionize legal research with LegalGPT. Instantly
                      access case summaries, references, insights, and tailored
                      precedents. Get accurate info in minutes, skipping endless
                      document searches, and unlock AI-driven legal
                      intelligence.
                    </p>
                    <button className="exp-button" onClick={() => navigate("/gpt/socket")}>
                      Explore Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
