import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NODE_API_ENDPOINT } from "../../../utils/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  setLoadUserSessions,
  setMessageIdPromptData,
  setNewPromptData,
  setPromptLoading,
  setPromptsArrAction,
} from "../../../reducers/promptSlice";
import { CircularProgress, MenuItem, Popover, TextField } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./WebSocket.css";
import UploadIcon from "../../../assets/icons/Upload.png";
import { Close } from "@mui/icons-material";
import axios from "axios";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
// import regenerateIcon from "../../assets/images/regenerate.png";
import HomepageSuggestionCards from "./HomepageSuggestionCards";

const languageArr = [
  "Hindi",
  "Bengali",
  "Gujarati",
  "Marathi",
  "Punjabi",
  "English",
  "Kannada",
  "Telugu",
  "Tamil",
  "Malyalam",
];

const Prompts = () => {
  const promptsArr = useSelector((state) => state.prompt.prompts);
  const promptLoading = useSelector((state) => state.prompt.loading);
  const currentUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState("");
  const [inputText, setInputText] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [fileDialog, setFileDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileSubmitLoading, setFileSubmitLoading] = useState(false);

  async function getSessionId(e, message) {
    e.preventDefault();
    if (currentUser) {
      const res = await fetch(`${NODE_API_ENDPOINT}/gpt/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message.prompt, model: "legalGPT" }),
      });
      const { data } = await res.json();
      console.log(data);
      setSessionId(data.id);
      dispatch(
        setPromptsArrAction([
          {
            text: inputText,
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
        ])
      );
      setUserGptResponse({
        text: inputText,
        isDocument: null,
        contextId: null,
        isUser: true,
        sessionId: data.id,
      });
      dispatch(setLoadUserSessions());
      navigate(`v1/${data.id}`);
    }
  }

  async function setUserGptResponse(message) {
    if (currentUser) {
      const res = await fetch(
        `${NODE_API_ENDPOINT}/gpt/session/appendMessage`,
        {
          method: "POST",
          body: JSON.stringify(message),
          headers: {
            Authorization: `Bearer ${currentUser.jwt}`,
            "Content-Type": "application/json",
          },
        }
      );
      const resData = await res.json();
      // console.log(resData);
      dispatch(setMessageIdPromptData({ index: 0, data: resData.data.id }));
    }
  }

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedLanguage("");
    setUploadedFiles([]);
    setFileDialog(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the first file (if any)
    if (file) {
      setUploadedFiles([file]); // Update state with the single file
    }
  };

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      handleFileSubmit();
    }
  }, [uploadedFiles]);

  const handleFileSubmit = async () => {
    setFileSubmitLoading(true);
    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);
    formData.append("language", selectedLanguage.toLowerCase());
    try {
      const response = await axios.post(
        `${NODE_API_ENDPOINT}/gpt/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser.jwt}`,
          },
        }
      );

      const fileData = response.data;

      const res = await fetch(`${NODE_API_ENDPOINT}/gpt/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fileData.data.fetchUploaded.document,
          model: "legalGPT",
        }),
      });
      const { data } = await res.json();
      // setSessionId(data.id);
      dispatch(
        setPromptsArrAction([
          {
            text: fileData.data.fetchUploaded.document,
            isDocument: uploadedFiles[0].name,
            contextId: null,
            isUser: true,
            sessionId: data.id,
          },
        ])
      );
      setUserGptResponse({
        text: fileData.data.fetchUploaded.document,
        isDocument: uploadedFiles[0].name,
        contextId: null,
        isUser: true,
        sessionId: data.id,
      });

      navigate(`v1/${data.id}`);
      dispatch(setLoadUserSessions());
    } catch (error) {
      console.error(error);
    } finally {
      setFileSubmitLoading(false);
    }
  };

  async function onPromptSelect(selectedPrompt) {
    if (currentUser) {
      const res = await fetch(`${NODE_API_ENDPOINT}/gpt/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: selectedPrompt, model: "legalGPT" }),
      });
      const { data } = await res.json();
      console.log(data);
      setSessionId(data.id);
      dispatch(
        setPromptsArrAction([
          {
            text: selectedPrompt,
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
        ])
      );
      setUserGptResponse({
        text: selectedPrompt,
        isDocument: null,
        contextId: null,
        isUser: true,
        sessionId: data.id,
      });
      dispatch(setLoadUserSessions());
      navigate(`v1/${data.id}`);
    }
  }

  return (
    <div className="h-screen m-auto flex flex-col gap-5 justify-center items-center p-3 bg-[#0F0F0FCC]">
      <div className="md:w-[80%]">
        <div className="w-full flex-1 flex flex-col gap-10 justify-center items-center">
          <div
            style={{
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              paddingBottom: "40px",
            }}
          >
            <div
              style={{
                backgroundColor: "transparent",
                fontSize: "48px",
                fontWeight: 700,
                color: "#E5E5E5",
              }}
            >
              Welcome to{" "}
              <span
                style={{
                  padding: 3,
                  borderLeft: `4px solid #008080`,
                  background: `linear-gradient(to right, rgba(0,128,128,0.75), rgba(0,128,128,0))`,
                }}
              >
                LegalGPT
              </span>
            </div>
            <div
              style={{
                textAlign: "center",
                paddingTop: 10,
                fontSize: 16,
                background: "inherit",
              }}
            >
              The power of AI for your Legal service
            </div>
          </div>
          <HomepageSuggestionCards onPromptSelect={onPromptSelect} />
        </div>
        <form
          onSubmit={(e) => {
            getSessionId(e, {
              prompt: inputText,
            });
          }}
          className=" flex gap-2 w-full"
        >
          <input
            required
            placeholder="Add your query..."
            className="text-black flex-1 p-2 rounded-lg"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="button"
            aria-describedby={id}
            variant="contained"
            onClick={handleClick}
            style={{
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            <FileUploadIcon
              style={{ color: "white", backgroundColor: "transparent" }}
            />
          </button>

          <Popover
            className="w-full"
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {!fileDialog ? (
              <div className="p-3 bg-[#C2FFFF] w-full border-4 border-[#018081]">
                <div className="flex w-full justify-between items-center gap-28">
                  <p className="m-0 text-[#018081] text-lg font-semibold">
                    Select Document Language
                  </p>
                  <Close
                    sx={{ color: "#018081" }}
                    className="cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                <div>
                  <TextField
                    label="Choose a Language"
                    select
                    fullWidth
                    margin="normal"
                    size="small"
                    value={selectedLanguage}
                    onChange={handleChange}
                  >
                    {languageArr.sort().map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="w-full flex justify-end">
                  <button
                    disabled={selectedLanguage === ""}
                    onClick={() => setFileDialog(true)}
                    className="rounded-lg"
                    style={{
                      background: "linear-gradient(90deg,#018081,#001B1B)",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#C2FFFF] w-full border-4 border-[#018081]">
                <div className="flex w-full justify-between items-center gap-28 pb-2">
                  <p className="m-0 text-[#018081] text-lg font-semibold">
                    Upload Document
                  </p>
                  <Close
                    sx={{ color: "#018081" }}
                    className="cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                {fileSubmitLoading ? (
                  <div className="w-full h-[150px] flex justify-center items-center">
                    <CircularProgress sx={{ color: "#018081" }} />
                  </div>
                ) : (
                  <div className="file-upload-container">
                    <input
                      type="file"
                      id="file-upload"
                      className="file-input"
                      // multiple
                      single
                      accept=".docx, .pdf,.txt"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <div className="flex w-full justify-center pb-2">
                        <img className="rounded-none" src={UploadIcon} />
                      </div>
                      <span className="text-[#018081]">
                        Click Here to Choose a File to Upload
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </Popover>
          <button
            disabled={inputText === ""}
            type="submit"
            className="rounded-lg"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Prompts;