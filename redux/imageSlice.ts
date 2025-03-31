import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "images",
  initialState: { 
    selectedImages: [] as { uri: string }[], 
    selectionMode: "single" 
  },
  reducers: {
    toggleSelectionMode: (state) => {
      state.selectionMode = state.selectionMode === "single" ? "multiple" : "single";
    },
    selectImage: (state, action) => {
      if (state.selectionMode === "single") {
        state.selectedImages = [action.payload]; // Only one image
      } else {
        if (!state.selectedImages.find((img) => img.uri === action.payload.uri)) {
          state.selectedImages.push(action.payload);
        }
      }
    },
    deselectImage: (state, action) => {
      state.selectedImages = state.selectedImages.filter((img) => img.uri !== action.payload);
    },
    clearSelection: (state) => {
      state.selectedImages = [];
    },
  },
});

export const { toggleSelectionMode, selectImage, deselectImage, clearSelection } = imageSlice.actions;
export default imageSlice.reducer;
