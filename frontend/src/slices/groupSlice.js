import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingGroup: false,
  isCreatingGroup: false,
  isEditingGroup: false,
  isDeletingGroup: false,
  group: [],
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    showGroupRequest: (state, action) => {
      state.isGettingGroup = true;
    },
    showGroupSuccess: (state, action) => {
      state.group = action.payload;
      state.isGettingGroup = false;
    },
    showGroupError: (state, action) => {
      state.isGettingGroup = false;
    },
    editGroupRequest: (state, action) => {
      state.isEditingGroup = true;
    },
    editGroupSuccess: (state, action) => {
      state.isEditingGroup = false;
    },
    editGroupError: (state, action) => {
      state.isEditingGroup = false;
    },
    createGroupRequest: (state, action) => {
      state.isCreatingGroup = true;
    },
    createGroupSuccess: (state, action) => {
      state.isCreatingGroup = false;
    },
    createGroupError: (state, action) => {
      state.isCreatingGroup = false;
    },
    deleteGroupRequest: (state, action) => {
      state.isDeletingGroup = true;
    },
    deleteGroupSuccess: (state, action) => {
      state.isDeletingGroup = false;
    },
    deleteGroupError: (state, action) => {
      state.isDeletingGroup = false;
    },
    resetGroupState: (state, action) => initialState,
  },
});
export const {
  showGroupRequest,
  showGroupSuccess,
  showGroupError,
  editGroupRequest,
  editGroupSuccess,
  editGroupError,
  createGroupRequest,
  createGroupSuccess,
  createGroupError,
  deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupError,
  resetGroupState,
} = groupSlice.actions;

export default groupSlice.reducer;
