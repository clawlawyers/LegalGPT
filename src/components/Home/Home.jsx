import React from "react";
import caseSearchIcon from "../../assets/gifs/caseSearch.gif";
import legalGptIcon from "../../assets/gifs/legalGpt.gif";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-auto m-auto w-[80%] flex flex-col justify-center items-center">
      <div>
        <h1
          className="text-5xl font-bold p-5 text-center"
          style={{
            background:
              "linear-gradient(to bottom, rgb(0, 128, 128) 0%, #00FFA3 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",

            color: "transparent",
          }}
        >
          Unlock Legal Clarity with ClawLaw
        </h1>
        <div>
          <p className="text-center text-lg">
            Step into the future of legal solutions with{" "}
            <span className="font-semibold text-white">ClawLaw</span>
          </p>
          <p className="text-center text-lg">
            Our{"  "}
            <span className="font-semibold text-white">
              advanced AI tools
            </span>{" "}
            empower you to navigate complex legal landscapes with ease
          </p>
        </div>
      </div>
      <div className="mt-10 h-64 w-full grid md:grid-cols-2 items-center justify-center gap-5">
        <div className="grid h-full md:grid-cols-[40%_60%] items-center border-2 rounded-lg p-3">
          <div className="w-full items-center justify-center">
            <img className="h-36" src={caseSearchIcon} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Case Search</h2>
            <p>
              Streamline your legal research with ClawLaw's AI-powered Case
              Search. Quickly find relevant precedents, save time, and get
              accurate results for court prep or research, making your legal
              journey faster and easier.
            </p>
            <button onClick={() => navigate("/case/search")}>
              Explore Now
            </button>
          </div>
        </div>
        <div className="h-full grid md:grid-cols-[40%_60%] items-center border-2 rounded-lg p-3">
          <div className="w-full items-center justify-center">
            <img className="h-56" src={legalGptIcon} />
          </div>
          <div className="flex flex-col justify-between">
            <h2 className="text-2xl font-semibold">LegalGPT</h2>
            <p>
              Revolutionize legal research with LegalGPT. Instantly access case
              summaries, references, insights, and tailored precedents. Get
              accurate info in minutes, skipping endless document searches, and
              unlock AI-driven legal intelligence
            </p>
            <button onClick={() => navigate("/gpt/socket")}>Explore Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
