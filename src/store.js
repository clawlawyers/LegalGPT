import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import gptSlice from "./reducers/gptSlice";
import promptSlice from "./reducers/promptSlice";
import popupSlice from "./reducers/popupSlice";

export default configureStore({
  reducer: {
    auth: authSlice,
    gpt: gptSlice,
    prompt: promptSlice,
    popup: popupSlice,
  },
});
