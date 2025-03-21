import { createSlice } from "@reduxjs/toolkit";

export const promptSlice = createSlice({
  name: "prompt",
  initialState: {
    prompts: [],
    loading: false,
    toggle: true,
    loadHistory: null,
    loadUserSession: false,
  },

  reducers: {
    setPromptsArrAction(state, action) {
      const newArr = [...state.prompts, ...action.payload];
      state.prompts = newArr;
    },
    removePromptsArr(state, action) {
      state.prompts = [];
    },

    setPromptLoading(state, action) {
      state.loading = !state.loading;
    },
    setDataUsingIndex(state, action) {
      const { index, text } = action.payload;
      const promptsArr = [...state.prompts];
      promptsArr[index] = text;
      state.prompts = promptsArr;
    },
    removePromptDatabyIndex(state, action) {
      const { index, newObj } = action.payload;
      const promptArr = state.prompts;
      promptArr[index] = newObj;
    },
    setNewPromptDataByIndex(state, action) {
      const { index, text } = action.payload;
      const promptArr = state.prompts;

      const currentText = promptArr[index].text || "";

      promptArr[index] = {
        ...promptArr[index],
        text: currentText + text,
      };
    },
    setNewPromptData(state, action) {
      const promptArr = state.prompts;

      if (promptArr.length > 0) {
        const lastPromptIndex = promptArr.length - 1;

        const currentText = promptArr[lastPromptIndex].text || "";

        promptArr[lastPromptIndex] = {
          ...promptArr[lastPromptIndex],
          text: currentText + action.payload.message,
        };
      }
    },
    setMessageIdPromptData(state, action) {
      const promptArr = state.prompts;

      if (promptArr.length > 0) {
        promptArr[action.payload.index] = {
          ...promptArr[action.payload.index],
          id: action.payload.data,
        };
      }
    },
    setToggleMenu(state, action) {
      state.toggle = !state.toggle;
    },
    setToggleMenuManual(state, action) {
      state.toggle = action.payload;
    },
    setPromptHistory(state, action) {
      state.loadHistory = action.payload;
    },
    removePromptHistory(state, action) {
      state.loadHistory = null;
    },
    setLoadUserSessions(state, action) {
      state.loadUserSession = !state.loadUserSession;
    },
  },
});

export const {
  setPromptsArrAction,
  setPromptLoading,
  setNewPromptData,
  removePromptsArr,
  setDataUsingIndex,
  setToggleMenu,
  setToggleMenuManual,
  setPromptHistory,
  removePromptHistory,
  setLoadUserSessions,
  setMessageIdPromptData,
  setNewPromptDataByIndex,
  removePromptDatabyIndex,
} = promptSlice.actions;

export default promptSlice.reducer;
